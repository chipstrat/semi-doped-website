#!/usr/bin/env bash
# Rebuild the Semi Doped site from the latest code + Buzzsprout feed.
# Runs hourly on framework via cron so new episodes appear without a deploy.
# Caddy serves dist/ via a read-only bind mount; astro build writes the new
# output in place, so no container restart is needed.
set -euo pipefail
cd "$(dirname "$0")/.."

git pull -q --ff-only
npm ci --silent
npm run build --silent
