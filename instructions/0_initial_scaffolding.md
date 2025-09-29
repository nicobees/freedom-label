# === Project Mission ===

Build a complete monorepo called **freedom-label** that satisfies the following requirements.

## 1. Back-End (Python 3.12 + FastAPI 0.116)

1.1 Framework: FastAPI with Pydantic v2 and uvicorn[1].  
1.2 Single path: `POST /print-label` returning `200 OK` on success, returning 4XX with custom messages in case business logic fails, returning 5XX in case of server errors.
1.4 Implementation: `from print import print_label` (already exists).  
1.5 Validation, OpenAPI tags, and example payloads.  
1.6 Dependency injection for config (use Pydantic Settings).  
1.7 Async-ready; dependencies await print_label if coroutine.  
1.8 Unit tests: pytest + httpx + anyio. Aim ≥ 95 % coverage.  
1.9 Code quality: ruff, black, isort, mypy strict, pre-commit CI.

## 2. Front-End (React 18 + Vite 5 + TypeScript 5.3)

2.1 Bootstrapped with `npm create vite@latest -- --template react-ts`[26].  
2.2 UI: single page with responsive form — Patient Name, PWR, Due Date, Print (submit) button.  
2.3 Form validation: Tanstack Form + Zod.  
2.4 Styling: Tailwind CSS v4.0 + dark-mode toggle[25].  
2.5 Env vars via Vite’s import.meta.env.  
2.6 Fetch POST to `/api/print-label`; optimistic toast on success.  
2.7 ESLint (typescript-eslint) + Prettier; Husky pre-commit hooks.  
2.8 Vitest + React Testing Library with 100 % critical-path coverage.  
2.9 Render OpenAPI schema via RapiDoc at `/docs/ui` route.

## 3. Docker & Compose

3.1 Multi-stage Dockerfiles (builder → slim runtime).  
3.2 Target platforms: `linux/arm/v7` and `linux/amd64`.  
3.3 Healthcheck: `curl -f http://localhost:8000/health || exit 1`.  
3.4 docker-compose.yml:

```
services:
  api:
    build: ./backend
    image: ghcr.io/${GITHUB_REPOSITORY_OWNER}/optical-api:${TAG:-dev}
    restart: unless-stopped
    healthcheck: ...
    depends_on: [db]
  ui:
    build: ./frontend
    image: ghcr.io/${GITHUB_REPOSITORY_OWNER}/optical-ui:${TAG:-dev}
    restart: unless-stopped
    depends_on: [api]
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - db:/var/lib/postgresql/data
volumes:
  db:
```

3.5 Override file for local dev with hot-reloading mounts.

## 4. Zero-Downtime Deploy

4.1 Include the shell script `deploy/docker-rollout.sh`:

```
#!/usr/bin/env bash
set -euo pipefail
docker rollout -f docker-compose.yml api ui
```

4.2 Document fallback (`docker compose up -d`) if rollout unavailable[29].

## 5. GitHub Actions

5.1 `.github/workflows/ci.yml`: lint, type-check, tests, buildx bake.  
5.2 `.github/workflows/release.yml` (manual):  
 • Login to GHCR,  
 • buildx `platform=linux/arm/v7,linux/amd64`,  
 • push semantic tag (`vX.Y.Z`) and `latest`,  
 • ssh via `gh-vpn-deploy` reusable workflow calling `docker rollout` on the Pi[22][32].  
5.3 Secrets to expect: `GHCR_PAT`, `PI_SSH_HOST`, `PI_SSH_USER`, `PI_SSH_KEY`, `OPENVPN_PROFILE`.

## 6. Raspberry Pi 2 Model B Ops

6.1 Raspbian Bookworm (32-bit).  
6.2 Enable systemd hardware watchdog:

```
echo "RuntimeWatchdogSec=14" | sudo tee -a /etc/systemd/system.conf
sudo reboot
```

6.3 Auto-restart on kernel panic: `echo 'kernel.panic = 10' | sudo tee -a /etc/sysctl.conf`[19].
6.4 Install `docker-rollout` CLI via one-liner:

```
curl -sSL https://raw.githubusercontent.com/wowu/docker-rollout/main/docker-rollout \
 | sudo install -m 755 /dev/stdin /usr/local/bin/docker-rollout

```

## 7. OpenVPN Exposure

7.1 Use PiVPN for server mode OR maintain `.ovpn` profile for client mode[28][33].
7.2 The release workflow assumes a TCP 1194 tunnel; it runs `ssh -o "ProxyCommand ..."`.
7.3 Document firewall port-forward checklist.

## 8. Environments

8.1 **Development** profile: `.env.dev`, compose override, SQLite, ports 8000/5173.
8.2 **Production** profile: `.env`, Postgres, Caddy reverse proxy (HTTPS).
8.3 Twelve-Factor config parity.

## 9. Observability

9.1 Structured logging (loguru), log rotation.
9.2 Metrics: `/metrics` Prometheus endpoint via `prometheus_fastapi_instrumentator`.
9.3 Health endpoints for liveness/readiness.

## 10. Documentation

10.1 Markdown-based `/docs` directory with MkDocs-Material site.
10.2 CONTRIBUTING.md (commit-lint rules, Conventional Commits).
10.3 ARCHITECTURE.md diagram (C4 model, PlantUML).

# === Acceptance Criteria ===

- `gh workflow run ci.yml` green on first try.
- Running `docker compose --profile=prod up -d` starts all containers healthy in < 30 s on a Raspberry Pi 2 Model B.
- `curl -X POST http://<pi-ip>:8000/print-label -d '{"sku":"ABC123","quantity":3}'` returns `200 OK`.
- UI delivers the form, validates, and shows toast on success.
- Hot module reload works in dev mode.
- Rolling update (`docker rollout ui`) performs blue-green with 0 downtime.
- All code passes ruff/black/isort/mypy & eslint/prettier gates.
- Documentation site builds locally via `mkdocs serve`.

# === Output Format ===

Return a **single GitHub pull request** description containing:

1. A bullet-point changelog.
2. A tree view of new/modified files.
3. Any follow-up TODOs.

**Do NOT** include generated code inline; instead push commits to the repo detected via `GITHUB_REPOSITORY` env var.

## Why These Choices?

### FastAPI over Flask

FastAPI natively supports async, Pydantic v2 validation, and first-class OpenAPI docs, making it ideal for lean API services on constrained ARM boards.

### Vite over CRA

Vite’s native ESM dev-server is 58% faster than CRA for TypeScript builds, slashing Pi-cross-build times.

### Tailwind v4

Tailwind CSS 4.0 delivers 3.5× faster full builds and advanced cascade layers, perfect for the single-form UI without manual CSS.

### docker-rollout

Provides Compose-level blue-green deploys with health-check awareness, something Docker Compose lacks natively.

### Buildx Multi-Arch

GitHub Actions + `docker buildx` enables one workflow to ship both `amd64` and `arm/v7` images, aligning dev laptops with Raspberry Pi production.

### Watchdog & kernel panic auto-reboot

Hardware watchdog reboots within 14 s of a freeze, while `kernel.panic=10` covers fatal kernel errors—critical for unattended kiosks.

## Suggested Table of Lint/Format Tools

| Layer  | Tool       | Purpose              | Strictness Level                     |
| ------ | ---------- | -------------------- | ------------------------------------ |
| Python | ruff       | Fast static analysis | `ruff check --select ALL`[13]        |
| Python | black      | Code formatting      | Line length = 88                     |
| Python | isort      | Import order         | Profile = black                      |
| Python | mypy       | Static types         | `--strict` mode                      |
| JS/TS  | eslint     | Code quality         | `@typescript-eslint/recommended`[15] |
| JS/TS  | prettier   | Formatting           | Tailwind plugin                      |
| Git    | pre-commit | Gatekeeper           | Runs all hooks locally               |

## Key GitHub Actions Jobs (CI Workflow)

| Job              | Runner          | Steps (abridged)                                                          |
| ---------------- | --------------- | ------------------------------------------------------------------------- |
| lint             | `ubuntu-latest` | Checkout → `pip install .[dev]` → ruff/black/isort/mypy → eslint/prettier |
| test             | `ubuntu-latest` | `pytest -q --cov` → `vitest run --coverage --run`                         |
| build            | `ubuntu-latest` | Setup QEMU → setup-buildx → `docker buildx bake` (both arches)            |
| analysis         | `ubuntu-latest` | Upload SBOM via Syft                                                      |
| release (manual) | `ubuntu-latest` | Build & push images → SSH → `docker rollout`                              |

All jobs use the **cache-actions** strategy for pip/npm/buildx layers to minimize cold-start times.

## Security Hardening Checklist

- Run Python under `uvicorn --workers 2 --root-path /api --reload` (dev) or Gunicorn `--preload` (prod).
- Pin dependency versions in `pyproject.toml` & `package.json` to avoid supply-chain drift.
- Enable dependabot-alerts and autoscan for GHCR images.
- Use PostgreSQL with least-privilege user; store secrets in `docker secrets` or `1Password Connect`.

## Common Pitfalls & Agent Guardrails

1. **ARM builds timing out** → adjust `buildx` `--push` concurrency; use `--load` only for local checks.
2. **Raspberry Pi clock drift** → ensure `systemd-timesyncd` active.
3. **OpenVPN routing** → add `route-nopull` in the `.ovpn` if split-tunnel needed.
4. **Tailwind v4 JIT purge** → confirm `content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}']`.
5. **docker-compose v2 vs v1** → always pin `docker compose` plugin ≥ 2.27 for healthcheck syntax.

### Final Tip

After initial generation, you can ask the Agentic AI follow-up questions like _“Add Helm charts”_ or _“Integrate Keycloak auth”_. Because the monorepo is cleanly structured and fully typed, incremental improvements become a breeze.

# General Instructions

- When generating new TypeScript code, please follow the existing coding style.
- Use `strict` mode in Typescript: also use eslint modules that check for `strict` mode
- Ensure all new functions and classes have JSDoc comments.
- Prefer functional programming paradigms where appropriate.
- All code should be compatible with TypeScript 5.0 and Node.js 24+.

## Coding Style:

- Use 4 spaces for indentation.
- Always use strict equality (`===` and `!==`).

## Regarding Dependencies:

- Avoid introducing new external dependencies unless absolutely necessary.
- If a new dependency is required, please state the reason.
