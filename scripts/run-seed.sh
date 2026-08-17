#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

is_firestore_emulator_listening() {
  local pids cmd
  pids="$(lsof -tiTCP:8080 -sTCP:LISTEN 2>/dev/null || true)"
  for pid in $pids; do
    cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
    if [[ "$cmd" == *"cloud-firestore-emulator"* ]]; then
      return 0
    fi
  done
  return 1
}

if [ -z "${FIRESTORE_EMULATOR_HOST:-}" ] \
  && [ -z "${FIREBASE_AUTH_EMULATOR_HOST:-}" ] \
  && [ "${SEED_LIVE:-}" != "true" ] \
  && is_firestore_emulator_listening; then
  export FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
  export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
  export FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:9199"
  echo "Detected running Firebase emulators — seeding locally."
fi

exec npm --prefix functions run seed
