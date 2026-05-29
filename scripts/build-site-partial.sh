#!/usr/bin/env sh
# 점검 모드: 채용(/recruitment)만 live, 나머지는 점검 페이지
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PARTIAL="$ROOT/site-partial"
MANIFEST="$ROOT/site/assets/space-green-cluster.json"
ENV_MEDIA_DIR="$PARTIAL/recruitment/environment(green cluster)"

rm -rf "$PARTIAL"
mkdir -p "$PARTIAL/recruitment" "$PARTIAL/assets"

cp "$ROOT/site-offline/index.html" "$PARTIAL/index.html"
cp "$ROOT/site-offline/index.html" "$PARTIAL/404.html"

# manifest가 cloudinary면 로컬 미디어는 배포하지 않음 (CDN만 사용)
USE_CLOUDINARY=0
if [ -f "$MANIFEST" ] && grep -q '"mode": "cloudinary"' "$MANIFEST"; then
  USE_CLOUDINARY=1
else
  node "$ROOT/scripts/sync-environment-media.js" --local
fi

cp -R "$ROOT/site/recruitment/." "$PARTIAL/recruitment/"
cp "$ROOT/site/assets/melanoir-shell.css" "$PARTIAL/assets/"
cp "$ROOT/site/assets/recruitment-space-carousel.js" "$PARTIAL/assets/"
cp "$MANIFEST" "$PARTIAL/assets/space-green-cluster.json"

if [ "$USE_CLOUDINARY" = 1 ] && [ -d "$ENV_MEDIA_DIR" ]; then
  find "$ENV_MEDIA_DIR" -type f \( \
    -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o \
    -iname '*.webp' -o -iname '*.gif' -o -iname '*.avif' -o \
    -iname '*.mp4' -o -iname '*.webm' -o -iname '*.mov' -o -iname '*.m4v' \
  \) -delete
  find "$ENV_MEDIA_DIR" -name '.DS_Store' -delete 2>/dev/null || true
  echo "Omitted local environment media (using Cloudinary manifest)"
fi

echo "Built $PARTIAL (maintenance + recruitment only)"
