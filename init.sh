#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> Working directory: $PWD"

if [ ! -d node_modules ]; then
  echo "==> Installing dependencies"
  npm install
else
  echo "==> node_modules present — skipping npm install"
fi

echo "==> Baseline verification (physics-core + ingestor)"
npm test

echo "==> Startup commands"
echo "    npm run dev              # explicadora  http://localhost:3000"
echo "    npm run dev:ingestor     # ingestor     http://localhost:3001"

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  echo "==> Starting explicadora"
  exec npm run dev
fi

echo "Set RUN_START_COMMAND=1 to launch the explicadora from this script."
