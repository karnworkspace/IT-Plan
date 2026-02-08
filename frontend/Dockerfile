# Frontend Dockerfile - Multi-stage build
# Supports: development, production

# ============================================
# Stage 1: Base
# ============================================
FROM node:20-alpine AS base

WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS dependencies

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# ============================================
# Stage 3: Development
# ============================================
FROM base AS development

WORKDIR /app

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Development command with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# Stage 4: Build (for production)
# ============================================
FROM dependencies AS build

WORKDIR /app

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:3000/api/v1

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# ============================================
# Stage 5: Production (Nginx)
# ============================================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/share/nginx/html && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nodejs:nodejs /var/run/nginx.pid

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
