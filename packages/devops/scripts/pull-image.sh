#!/usr/bin/env bash
set -euo pipefail

# Defaults
APP_DIR="/home/freedom-label/freedom-label"
cd "$APP_DIR"

usage() {
  cat <<'USAGE'
Usage:
  ./pull-images --b "<backend_version>" --f "<frontend_version>"

Notes:
- Versions should be provided without the leading 'b' or 'f' prefix.
- The script expects these env vars in .env:
    GITHUB_USERNAME, GITHUB_REPOSITORY_NAME, GITHUB_IMAGE_BACKEND, GITHUB_IMAGE_FRONTEND
- It will pull:
    ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_BACKEND}:b<backend_version>
    ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_FRONTEND}:f<frontend_version>
USAGE
}

BACKEND_VER=""
FRONTEND_VER=""
GHCR_USER=""
GHCR_TOKEN=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --b) BACKEND_VER="${2:-}"; shift 2 ;;
    --f) FRONTEND_VER="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

if [[ -z "$BACKEND_VER" || -z "$FRONTEND_VER" || -z "$GHCR_USER" || -z "$GHCR_TOKEN" ]]; then
  echo "Error: missing required arguments."
  usage
  exit 1
fi

# Load .env to get image paths
if [[ -f .env ]]; then
  # shellcheck disable=SC1091
  source .env
else
  echo "Error: .env not found in $APP_DIR"
  exit 1
fi

: "${GITHUB_USERNAME:?Missing GITHUB_USERNAME in .env}"
: "${GITHUB_REPOSITORY_NAME:?Missing GITHUB_REPOSITORY_NAME in .env}"
: "${GITHUB_IMAGE_BACKEND:?Missing GITHUB_IMAGE_BACKEND in .env}"
: "${GITHUB_IMAGE_FRONTEND:?Missing GITHUB_IMAGE_FRONTEND in .env}"

BACKEND_TAG="b${BACKEND_VER}"
FRONTEND_TAG="f${FRONTEND_VER}"

BACKEND_IMAGE="ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_BACKEND}:${BACKEND_TAG}"
FRONTEND_IMAGE="ghcr.io/${GITHUB_USERNAME}/${GITHUB_REPOSITORY_NAME}/${GITHUB_IMAGE_FRONTEND}:${FRONTEND_TAG}"

echo "Logging in to GHCR as ${GHCR_USER}..."
echo "${GHCR_TOKEN}" | sudo docker login ghcr.io -u "${GHCR_USER}" --password-stdin >/dev/null

pull_if_missing() {
  local image="$1"
  if docker image inspect "$image" >/dev/null 2>&1; then
    echo "Image already present locally: $image (skipping pull)"
  else
    echo "Pulling $image ..."
    docker pull "$image"
  fi
}

pull_if_missing "$BACKEND_IMAGE"
pull_if_missing "$FRONTEND_IMAGE"

echo "Verifying images are present..."
docker image inspect "$BACKEND_IMAGE" >/dev/null
docker image inspect "$FRONTEND_IMAGE" >/dev/null

echo "Success. Pulled (or verified) images:"
echo " - $BACKEND_IMAGE"
echo " - $FRONTEND_IMAGE"
