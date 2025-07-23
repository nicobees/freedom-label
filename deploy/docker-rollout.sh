
#!/usr/bin/env bash
set -euo pipefail
docker rollout -f docker-compose.yml api ui
