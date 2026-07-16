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
# Usage:
#   SECRETS_CONTEXT='{"KEY":"val",...}' ./scripts/sync-secrets.sh
#   SECRETS_CONTEXT='{"KEY":"val",...}' ./scripts/sync-secrets.sh --env preview

WRANGLER_ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --env) WRANGLER_ARGS+=("--env" "$2"); shift 2 ;;
    *) shift ;;
  esac
done

# GitHub secrets to sync — exclude infrastructure creds and empty values.
GITHUB_SECRETS=$(echo "$SECRETS_CONTEXT" | jq -c '
  to_entries
  | map(select(.key | startswith("CLOUDFLARE_") | not))
  | map(select(.value | length > 0))
  | from_entries
')

# Existing Worker secrets (may fail on first deploy or when none exist).
EXISTING=$(wrangler secret list "${WRANGLER_ARGS[@]}" 2>/dev/null || echo '[]')
if ! echo "$EXISTING" | jq -e 'type == "array"' >/dev/null 2>&1; then
  EXISTING='[]'
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

if [ "$SYNC_JSON" = "{}" ]; then
  echo "No secrets to sync."
  exit 0
fi

echo "Syncing secrets to Cloudflare Worker..."
echo "$SYNC_JSON" | jq -r 'to_entries | map(if .value == null then "  - \(.key) (delete)" else "  - \(.key) (set)" end)[]'
echo "$SYNC_JSON" | wrangler secret bulk "${WRANGLER_ARGS[@]}"
echo "Secret sync complete."
