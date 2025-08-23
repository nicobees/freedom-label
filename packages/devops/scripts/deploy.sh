#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/freedom-label/freedom-label"
UNIT_NAME="freedom-label"
COMPOSE_FILE="docker-compose.yml"
BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://localhost:8000/health}"
HEALTH_TIMEOUT_SEC="${HEALTH_TIMEOUT_SEC:-90}"
HEALTH_INTERVAL_SEC="${HEALTH_INTERVAL_SEC:-3}"

cd "$APP_DIR"

usage() {
  cat <<'USAGE'
Usage:
  ./deploy --b "<backend_version>" --f "<frontend_version>"

Behavior:
- Updates .env with:
    VERSION_BACKEND=b<backend_version>
    VERSION_FRONTEND=f<frontend_version>
- Verifies the corresponding images exist locally.
- Restarts the systemd unit to apply the new images.
- Waits for unit to become active and then polls backend health:
    env BACKEND_HEALTH_URL=http://localhost:8000/health (default)
    env HEALTH_TIMEOUT_SEC=90, HEALTH_INTERVAL_SEC=3 (defaults)
USAGE
}

BACKEND_VER=""
FRONTEND_VER=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --b) BACKEND_VER="${2:-}"; shift 2 ;;
    --f) FRONTEND_VER="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

if [[ -z "$BACKEND_VER" || -z "$FRONTEND_VER" ]]; then
  echo "Error: --b and --f are required."
  usage
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Error: .env not found in $APP_DIR"
  exit 1
fi
if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Error: $COMPOSE_FILE not found in $APP_DIR"
  exit 1
fi

# shellcheck disable=SC1091
source .env

: "${GITHUB_USERNAME:?Missing GITHUB_USERNAME in .env}"
: "${GITHUB_REPOSITORY_NAME:?Missing GITHUB_REPOSITORY_NAME in .env}"
: "${GITHUB_IMAGE_BACKEND:?Missing GITHUB_IMAGE_BACKEND in .env}"
: "${GITHUB_IMAGE_FRONTEND:?Missing GITHUB_IMAGE_FRONTEND in .env}"

NEW_VERSION_BACKEND="b${BACKEND_VER}"
NEW_VERSION_FRONTEND="f${FRONTEND_VER}"

BACKEND_IMAGE="ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_BACKEND}:${NEW_VERSION_BACKEND}"
FRONTEND_IMAGE="ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_FRONTEND}:${NEW_VERSION_FRONTEND}"

echo "Ensuring images exist locally before deploy..."
sudo docker image inspect "$BACKEND_IMAGE" >/dev/null || { echo "Missing local image: $BACKEND_IMAGE. Run pull-images first."; exit 1; }
sudo docker image inspect "$FRONTEND_IMAGE" >/dev/null || { echo "Missing local image: $FRONTEND_IMAGE. Run pull-images first."; exit 1; }

echo "Updating .env with new versions..."
update_env_var() {
  local key="$1"
  local value="$2"
  if grep -qE "^${key}=" .env; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" .env
  else
    echo "${key}=${value}" >> .env
  fi
}
update_env_var "VERSION_BACKEND" "$NEW_VERSION_BACKEND"
update_env_var "VERSION_FRONTEND" "$NEW_VERSION_FRONTEND"

echo "Updated .env values:"
grep -E "^(VERSION_BACKEND|VERSION_FRONTEND)=" .env || true

echo "Restarting systemd unit: ${UNIT_NAME} ..."
sudo systemctl restart "${UNIT_NAME}"

echo "Waiting for service to become active..."
for i in {1..60}; do
  state="$(systemctl is-active "${UNIT_NAME}" || true)"
  if [[ "$state" == "active" ]]; then
    echo "Service is active."
    break
  fi
  if (( i == 60 )); then
    echo "Service did not become active in time." >&2
    sudo systemctl status "${UNIT_NAME}" --no-pager -l || true
    exit 1
  fi
  sleep 1
done

echo "Probing backend health at ${BACKEND_HEALTH_URL} ..."
deadline=$((SECONDS + HEALTH_TIMEOUT_SEC))
while (( SECONDS < deadline )); do
  # Prefer curl; fallback to wget if not present
  if command -v curl >/dev/null 2>&1; then
    if curl -fsS --max-time 2 "${BACKEND_HEALTH_URL}" >/dev/null; then
      echo "Backend is healthy (HTTP 200)."
      HEALTH_OK=1
      break
    fi
  elif command -v wget >/dev/null 2>&1; then
    if wget -qO- "${BACKEND_HEALTH_URL}" >/dev/null; then
      echo "Backend is healthy (HTTP 200)."
      HEALTH_OK=1
      break
    fi
  else
    echo "Neither curl nor wget found; cannot probe health." >&2
    break
  fi
  sleep "${HEALTH_INTERVAL_SEC}"
done

if [[ "${HEALTH_OK:-0}" -ne 1 ]]; then
  echo "Backend failed to report healthy within ${HEALTH_TIMEOUT_SEC}s." >&2
  echo "Recent service status:"
  sudo systemctl status "${UNIT_NAME}" --no-pager -l || true

  exit 1
fi

echo
echo "Deployment completed successfully."
