#!/usr/bin/env bash
set -euo pipefail

# Full sync of GitHub secrets to Cloudflare Worker.
# Creates, updates, and deletes secrets so the Worker exactly matches GitHub.
#
# Required env:
#   SECRETS_CONTEXT  — ${{ toJSON(secrets) }} (JSON object of all available secrets)
#   CLOUDFLARE_API_TOKEN
#   CLOUDFLARE_ACCOUNT_ID
#
# Optional env:
#   WRANGLER_BIN — wrangler invocation (default: "pnpm exec wrangler";
#                  node_modules/.bin is not on PATH in CI run steps)
#
# Usage:
#   SECRETS_CONTEXT='{"KEY":"val",...}' ./scripts/sync-secrets.sh
#   SECRETS_CONTEXT='{"KEY":"val",...}' ./scripts/sync-secrets.sh --env preview

run_wrangler() {
  # shellcheck disable=SC2086 — WRANGLER_BIN is intentionally word-split.
  ${WRANGLER_BIN:-pnpm exec wrangler} "$@"
}

ENV_ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --env) ENV_ARGS+=("--env" "$2"); shift 2 ;;
    *) shift ;;
  esac
done
# Empty-array expansion under `set -u` breaks on bash 3.x (macOS); this form is safe.
ENV_ARGS=(${ENV_ARGS[@]+"${ENV_ARGS[@]}"})

# GitHub secrets to sync — exclude workflow infrastructure (Cloudflare deploy
# creds and GitHub's auto-injected ephemeral token) and empty values.
GITHUB_SECRETS=$(echo "$SECRETS_CONTEXT" | jq -c '
  to_entries
  | map(select(.key | ascii_upcase | startswith("CLOUDFLARE_") | not))
  | map(select(.key | ascii_upcase != "GITHUB_TOKEN"))
  | map(select(.value | length > 0))
  | from_entries
')

# Existing Worker secrets (may fail on first deploy or when none exist).
EXISTING=$(run_wrangler secret list ${ENV_ARGS[@]+"${ENV_ARGS[@]}"} 2>/dev/null || echo '[]')
if ! echo "$EXISTING" | jq -e 'type == "array"' >/dev/null 2>&1; then
  EXISTING='[]'
fi

# Safety valve: an empty GitHub side with a non-empty Worker side almost always
# means the secrets context was withheld (Dependabot-triggered run, permissions
# change), not that every secret was deliberately deleted. Never mass-delete.
if [ "$GITHUB_SECRETS" = "{}" ]; then
  if [ "$(echo "$EXISTING" | jq 'length')" -gt 0 ]; then
    echo "WARNING: no GitHub secrets in context but the Worker has secrets — skipping sync." >&2
    echo "         To really delete all Worker secrets, run 'wrangler secret delete' manually." >&2
  else
    echo "No secrets to sync."
  fi
  exit 0
fi

# Build sync JSON:
# - GitHub secrets → their values (create/update)
# - Worker secrets not in GitHub → null (delete)
SYNC_JSON=$(jq -n \
  --argjson github "$GITHUB_SECRETS" \
  --argjson existing "$EXISTING" \
  '$github as $g
   | ($existing | map(.name)) as $names
   | reduce $names[] as $n ($g;
       if ($g | has($n)) | not then .[$n] = null else . end)')

echo "Syncing secrets to Cloudflare Worker..."
echo "$SYNC_JSON" | jq -r 'to_entries | map(if .value == null then "  - \(.key) (delete)" else "  - \(.key) (set)" end)[]'
echo "$SYNC_JSON" | run_wrangler secret bulk ${ENV_ARGS[@]+"${ENV_ARGS[@]}"}
echo "Secret sync complete."
