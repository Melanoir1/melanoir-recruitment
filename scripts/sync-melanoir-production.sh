#!/usr/bin/env bash
# Sync local web/site to match https://melanoir.co.kr (production baseline).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../" && pwd)"
SITE="$ROOT/web/site"
BASE="https://melanoir.co.kr"
BASELINE_COMMIT="0249735"

cd "$ROOT"

echo "→ Melanoir production sync (baseline commit ${BASELINE_COMMIT})"

if git cat-file -e "${BASELINE_COMMIT}:web/site/assets/landing-i18n.js" 2>/dev/null; then
  git checkout "${BASELINE_COMMIT}" -- web/site/assets/landing-i18n.js
else
  echo "  ! baseline commit not found locally; pulling landing-i18n.js from ${BASE}"
  curl -fsSL "${BASE}/assets/landing-i18n.js" -o "${SITE}/assets/landing-i18n.js"
fi

LIVE_HASH="$(curl -fsSL "${BASE}/assets/landing-i18n.js" | shasum -a 256 | awk '{print $1}')"
LOCAL_HASH="$(shasum -a 256 "${SITE}/assets/landing-i18n.js" | awk '{print $1}')"

if [[ "$LIVE_HASH" != "$LOCAL_HASH" ]]; then
  echo "  ! git baseline differs from live; overwriting from ${BASE}"
  curl -fsSL "${BASE}/assets/landing-i18n.js" -o "${SITE}/assets/landing-i18n.js"
  LOCAL_HASH="$LIVE_HASH"
fi

echo "  ✓ landing-i18n.js matches production (${LOCAL_HASH:0:12}…)"
echo "  Preview: npm run dev  →  http://localhost:3456"
