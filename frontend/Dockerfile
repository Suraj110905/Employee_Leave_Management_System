# =============================================================================
# LeavePortal Frontend – Production Dockerfile
# Stage 1: Build React app with Vite
# Stage 2: Serve static assets with Nginx
# =============================================================================

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy package manifests — leverage Docker layer cache
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy all source files
COPY . .

# Build production bundle (reads .env.production automatically)
RUN npm run build

# ── Stage 2: Nginx production server ──────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built React assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
