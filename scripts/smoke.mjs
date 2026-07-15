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
const failures = [];
const HEALTH_RETRIES = 5;
const HEALTH_RETRY_DELAY_MS = 3000;

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

async function assertHealth() {
  const res = await fetch(`${base}/health.json`);
  if (res.status !== 200) throw new Error(`status ${res.status}`);
  const body = await res.json();
  if (body.status !== "ok") throw new Error(`status field "${body.status}"`);
  if (expectedSha && body.commit !== expectedSha) {
    throw new Error(`commit ${body.commit} != expected ${expectedSha} (stale deploy?)`);
  }
  if (res.headers.get("x-content-type-options") !== "nosniff") {
    throw new Error("missing X-Content-Type-Options: nosniff");
  }
  if (!res.headers.get("content-security-policy")) {
    throw new Error("missing Content-Security-Policy");
  }
}

async function main() {
  await check("GET /health.json", async () => {
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

  for (const path of PATHS) {
    await check(`GET ${path}`, async () => {
      const res = await fetch(`${base}${path}`);
      if (res.status !== 200) throw new Error(`status ${res.status}`);
    });
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${PATHS.length + 1} checks passed against ${base}`);
}

main();
