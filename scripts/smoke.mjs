#!/usr/bin/env node
// Post-deploy smoke test. Usage: node scripts/smoke.mjs <baseURL> [expectedSHA]
// Exits non-zero if any check fails, failing the calling CI job.

const [baseArg, expectedSha] = process.argv.slice(2);

if (!baseArg) {
  console.error("usage: node scripts/smoke.mjs <baseURL> [expectedSHA]");
  process.exit(2);
}

const base = baseArg.replace(/\/$/, "");
const PATHS = ["/", "/es/", "/en/", "/blog/salud-renal-prevencion-enfermedad-renal/"];
// Worker version propagation is usually seconds but has been observed to take
// over 15s; give it a full minute before declaring the deploy stale.
const HEALTH_RETRIES = 10;
const HEALTH_RETRY_DELAY_MS = 6000;
const failures = [];

// Basic-auth: when AUTH_USER + AUTH_PASS are set (staging/preview), send
// credentials so the smoke test isn't blocked by the auth gate.
const AUTH_USER = process.env.AUTH_USER;
const AUTH_PASS = process.env.AUTH_PASS;
const AUTH_HEADER =
  AUTH_USER && AUTH_PASS ? { Authorization: `Basic ${btoa(`${AUTH_USER}:${AUTH_PASS}`)}` } : {};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function check(label, fn) {
  try {
    await fn();
    console.log(`ok   ${label}`);
  } catch (err) {
    failures.push(`${label}: ${err.message}`);
    console.error(`FAIL ${label}: ${err.message}`);
  }
}

// /api/health is served by the Worker script (never prerendered, never
// edge-cached), so its commit SHA flips atomically with the deploy. Retries
// only cover the seconds-scale global propagation of a new Worker version.
async function assertHealth() {
  const res = await fetch(`${base}/api/health`, { headers: AUTH_HEADER });
  if (res.status !== 200) throw new Error(`status ${res.status}`);
  if (res.headers.get("cache-control") !== "no-store") {
    throw new Error("health response must be Cache-Control: no-store (is it prerendered again?)");
  }
  const body = await res.json();
  if (body.status !== "ok") throw new Error(`status field "${body.status}"`);
  if (expectedSha && body.commit !== expectedSha) {
    throw new Error(`commit ${body.commit} != expected ${expectedSha} (stale deploy?)`);
  }
}

async function main() {
  await check("GET /api/health", async () => {
    let lastErr;
    for (let i = 0; i < HEALTH_RETRIES; i++) {
      try {
        await assertHealth();
        return;
      } catch (err) {
        lastErr = err;
        if (i < HEALTH_RETRIES - 1) {
          console.log(`  retry ${i + 1}/${HEALTH_RETRIES} after ${HEALTH_RETRY_DELAY_MS}ms...`);
          await sleep(HEALTH_RETRY_DELAY_MS);
        }
      }
    }
    throw lastErr;
  });

  let homeHtml = "";
  await check("GET / (with security headers)", async () => {
    const res = await fetch(`${base}/`, { headers: AUTH_HEADER });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    // Static pages get their headers from public/_headers via Workers Assets;
    // assert them here, on a real page, where they protect actual users.
    if (res.headers.get("x-content-type-options") !== "nosniff") {
      throw new Error("missing X-Content-Type-Options: nosniff");
    }
    if (!res.headers.get("content-security-policy")) {
      throw new Error("missing Content-Security-Policy");
    }
    homeHtml = await res.text();
  });

  for (const path of PATHS.slice(1)) {
    await check(`GET ${path}`, async () => {
      const res = await fetch(`${base}${path}`, { headers: AUTH_HEADER });
      if (res.status !== 200) throw new Error(`status ${res.status}`);
    });
  }

  // Advisory only: static assets revalidate through the edge cache, so pages
  // can lag a deploy by a few minutes at any given location. Not a failure --
  // the cache converges on its own -- but worth surfacing in the deploy log.
  if (expectedSha && homeHtml && !homeHtml.includes(`content="${expectedSha}"`)) {
    console.log("warn / still serves a previous build (edge cache converging, not fatal)");
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${PATHS.length + 1} checks passed against ${base}`);
}

main();
