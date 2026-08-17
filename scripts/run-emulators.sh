#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

EMULATOR_PORTS=(8080 9099 5001 9199 4000 9150)

java_major_version() {
  local java_bin="$1"
  "$java_bin" -version 2>&1 | head -1 | sed -E 's/.*version "([0-9]+).*/\1/'
}

resolve_java_home() {
  if [ -n "${JAVA_HOME:-}" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    local major
    major="$(java_major_version "$JAVA_HOME/bin/java")"
    if [ "$major" -ge 21 ]; then
      echo "$JAVA_HOME"
      return 0
    fi
  fi

  local candidates=(
    "/Applications/Android Studio.app/Contents/jbr/Contents/Home"
    "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
    "/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
  )

  for candidate in "${candidates[@]}"; do
    if [ -x "$candidate/bin/java" ]; then
      local major
      major="$(java_major_version "$candidate/bin/java")"
      if [ "$major" -ge 21 ]; then
        echo "$candidate"
        return 0
      fi
    fi
  done

  return 1
}

is_emulator_process() {
  local cmd="$1"
  [[ "$cmd" == *"cloud-firestore-emulator"* ]] \
    || [[ "$cmd" == *"cloud-storage-rules-runtime"* ]] \
    || [[ "$cmd" == *"firebase/emulators"* ]] \
    || [[ "$cmd" == *"firebase emulators:start"* ]] \
    || [[ "$cmd" == *"ui-v1"* && "$cmd" == *"firebase"* ]]
}

stop_stale_emulators() {
  local stopped=false

  for port in "${EMULATOR_PORTS[@]}"; do
    local pids
    pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    for pid in $pids; do
      local cmd
      cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
      if [ -n "$cmd" ] && is_emulator_process "$cmd"; then
        echo "Stopping stale Firebase emulator on port $port (PID $pid)..."
        kill "$pid" 2>/dev/null || true
        stopped=true
      fi
    done
  done

  if [ "$stopped" = true ]; then
    sleep 1
  fi
}

warn_foreign_port_conflicts() {
  local conflicts=()
  for port in "${EMULATOR_PORTS[@]}"; do
    local pids
    pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    for pid in $pids; do
      local cmd
      cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
      if [ -n "$cmd" ] && ! is_emulator_process "$cmd"; then
        conflicts+=("port $port (PID $pid)")
      fi
    done
  done

  if [ "${#conflicts[@]}" -gt 0 ]; then
    echo "Error: emulator ports are used by non-Firebase processes:"
    printf '  - %s\n' "${conflicts[@]}"
    echo "Stop those processes or change ports in firebase.json."
    exit 1
  fi
}

if resolved_home="$(resolve_java_home)"; then
  export JAVA_HOME="$resolved_home"
  export PATH="$JAVA_HOME/bin:$PATH"
else
  initial_major="$(java_major_version "java")"
  echo "Error: firebase-tools requires JDK 21 or newer."
  echo "Current Java major version: ${initial_major}"
  echo "Install JDK 21+ (e.g. brew install openjdk@21) or use Android Studio's bundled JBR."
  exit 1
fi

stop_stale_emulators
warn_foreign_port_conflicts

exec npx firebase emulators:start --import ./firebase/emulator-data --export-on-exit ./firebase/emulator-data
