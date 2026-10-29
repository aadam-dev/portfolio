#!/usr/bin/env bash
# Render every plate (desktop and phone, day and night), then encode them for the web.
set -euo pipefail
cd "$(dirname "$0")/../.."
PY=.cache/bpy-venv/bin/python
[ -x "$PY" ] || { python3 -m venv .cache/bpy-venv && $PY -m pip install -q bpy==5.2.3 pillow; }
SAMPLES=${SAMPLES:-256}
for view in desktop phone; do
  for phase in day night; do
    $PY scripts/desk-blender/build.py --view $view --phase $phase --samples "$SAMPLES" 2>&1 | grep -E "^rendered|Error|Traceback" || true
  done
done
node scripts/desk-blender/encode.mjs
