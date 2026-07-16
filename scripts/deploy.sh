#!/usr/bin/env bash
set -euo pipefail

# Deploy the Worker, injecting GitHub Variables as runtime `var` bindings.
#
# Non-secret runtime config (read via `cloudflare:workers` env, e.g. RESEND_FROM)
# is passed with `wrangler deploy --var KEY:VALUE`. This is atomic with the
# deploy and reconciles deletions for free: `keep_vars` defaults to false, so a
# variable removed from GitHub is simply not passed and disappears from the
# Worker on the next deploy. Secrets are inherited across deploys and handled
# separately by sync-secrets.sh — never touched here.
#
# PUBLIC_* variables are excluded: those are build-time (baked into the static
# output via .env / import.meta.env), not runtime Worker vars. CLOUDFLARE_* and
# GITHUB_TOKEN are workflow infrastructure, never app config.
#
# Env:
#   VARS_CONTEXT  — ${{ toJSON(vars) }} (JSON object of all GitHub Variables)
#   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
# Optional:
#   WRANGLER_BIN  — wrangler invocation (default: "pnpm exec wrangler")
#
# Extra args ("$@") are forwarded to `wrangler deploy`.

run_wrangler() {
  # shellcheck disable=SC2086 — WRANGLER_BIN is intentionally word-split.
  ${WRANGLER_BIN:-pnpm exec wrangler} "$@"
}

VAR_ARGS=()
if [ -n "${VARS_CONTEXT:-}" ]; then
  while IFS= read -r line; do
    [ -n "$line" ] && VAR_ARGS+=("--var" "$line")
  done < <(echo "$VARS_CONTEXT" | jq -r '
    to_entries[]
    | select(.key | ascii_upcase | (startswith("CLOUDFLARE_") or . == "GITHUB_TOKEN" or startswith("PUBLIC_")) | not)
    # --var uses KEY:VALUE and the deploy command is one shell line, so skip
    # multi-line values (none expected for runtime config like email addresses).
    | select(.value | type == "string" and length > 0 and (contains("\n") | not))
    | "\(.key):\(.value)"
  ')
fi

if [ "${#VAR_ARGS[@]}" -gt 0 ]; then
  echo "Injecting GitHub Variables as Worker vars:"
  printf '  - %s\n' "${VAR_ARGS[@]}" | grep -v -- '--var' || true
fi

# Empty-array expansion is unsafe under `set -u` on bash 3.x (macOS local runs).
run_wrangler deploy ${VAR_ARGS[@]+"${VAR_ARGS[@]}"} "$@"
