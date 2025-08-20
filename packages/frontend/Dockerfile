# syntax=docker/dockerfile:1.6
# ================================
# Build Stage - React/TypeScript
# ================================
# Debian-based Node for broader prebuilt coverage; buildx will pull the right arch
FROM node:22-bookworm-slim AS build

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (cached via BuildKit)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ================================
# Production Stage - Nginx
# ================================
# Multi-arch Nginx; buildx will select linux/arm/v7 at build time
FROM nginx:alpine AS production

# Copy built React assets from build stage
# The --chown flag ensures files are owned by the nginx user (uid 101)
# This prevents permission issues when nginx serves the files
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
# Again using --chown to ensure proper ownership for the nginx user
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# The nginx-unprivileged image runs on port 8080 instead of 80
# This is because non-root users cannot bind to privileged ports (< 1024)
EXPOSE 8080

# Start nginx
# The nginx-unprivileged image is already configured to run as the nginx user
CMD ["nginx", "-g", "daemon off;"]
