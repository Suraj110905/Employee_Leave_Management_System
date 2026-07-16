# =============================================================================
# LeavePortal Backend – Production Dockerfile
# Multi-stage build: deps → production
# =============================================================================

# ── Stage 1: Install production dependencies ─────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy manifests only — leverage Docker layer cache
COPY package*.json ./

# Install only production dependencies (omit devDependencies)
RUN npm ci --omit=dev --ignore-scripts

# ── Stage 2: Production runtime image ────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy pre-installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source (respects .dockerignore)
COPY . .

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

# Expose application port
EXPOSE 5000

# Health check — Render will use this
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/v1/health || exit 1

# Start production server
CMD ["node", "server.js"]
