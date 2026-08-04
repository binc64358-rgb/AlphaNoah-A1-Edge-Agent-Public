#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAME="AlphaNoah-A1-Edge-Agent-v0.1.1-linux-x86_64"
STAGE="$ROOT/dist/$NAME"
ARCHIVE="$ROOT/dist/$NAME.tar.gz"
[[ -f "$ROOT/frontend/dist/index.html" ]] || { echo "Run npm --prefix frontend run build first."; exit 1; }
rm -rf "$STAGE"
mkdir -p "$STAGE/app/backend" "$STAGE/app/frontend" "$STAGE/config" "$STAGE/scripts" "$STAGE/data" "$STAGE/logs"
cp -R "$ROOT/src" "$STAGE/app/backend/src"
find "$STAGE/app/backend/src" -type d -name "__pycache__" -prune -exec rm -rf {} +
cp -R "$ROOT/examples" "$STAGE/app/backend/examples"
cp "$ROOT/pyproject.toml" "$ROOT/requirements.txt" "$STAGE/app/backend/"
cp -R "$ROOT/frontend/dist/." "$STAGE/app/frontend/"
cp "$ROOT/config/alphanoah.env.example" "$ROOT/config/provider.example.env" "$STAGE/config/"
cp "$ROOT/scripts/common.sh" "$ROOT/scripts/install.sh" "$ROOT/scripts/configure.sh" "$ROOT/scripts/start.sh" "$ROOT/scripts/stop.sh" "$ROOT/scripts/restart.sh" "$ROOT/scripts/status.sh" "$ROOT/scripts/healthcheck.sh" "$ROOT/scripts/reset_demo.sh" "$ROOT/scripts/provider_probe.py" "$STAGE/scripts/"
cp "$ROOT/README_LOCAL.md" "$ROOT/PROVIDER_SETUP.md" "$STAGE/"
cp "$ROOT/DEMO_GUIDE_LOCAL.md" "$STAGE/DEMO_GUIDE.md"
cp "$ROOT/SECURITY_AND_PRIVACY.md" "$STAGE/"
packaging_commit="$(git -C "$ROOT" rev-parse HEAD)"
printf "AlphaNoah A1 Edge Agent Local Edge Release\nCore Release: v0.1.1-amd-hackathon-final\nCore Commit: 31d74174db86584f26be8761848486ca32359168\nPackaging Commit: %s\nOfficial validated reference platform: AMD Ryzen AI Max+ 395 / gfx1151\n" "$packaging_commit" > "$STAGE/RELEASE_INFO.txt"
chmod 755 "$STAGE/scripts/"*.sh
chmod 700 "$STAGE/config" "$STAGE/data" "$STAGE/logs"
unsafe="$(find "$STAGE" -type f \( -name "*.pyc" -o -name "*.sqlite3" -o -name "alphanoah.env" \) -print -quit)"
[[ -z "$unsafe" ]] || { echo "Unsafe package content detected."; exit 1; }
tar -C "$ROOT/dist" -czf "$ARCHIVE" "$NAME"
(cd "$ROOT/dist" && sha256sum "$(basename "$ARCHIVE")" > SHA256SUMS)
echo "$ARCHIVE"
