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

async function check(label, fn) {
  try {
    await fn();
    console.log(`ok   ${label}`);
  } catch (err) {
    failures.push(`${label}: ${err.message}`);
    console.error(`FAIL ${label}: ${err.message}`);
  }
}

async function main() {
  await check("GET /health.json", async () => {
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
