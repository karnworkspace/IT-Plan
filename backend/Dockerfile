# Backend Dockerfile - Multi-stage build
# Supports: development, production

# ============================================
# Stage 1: Base
# ============================================
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies for native modules (bcrypt) and Prisma
RUN apk add --no-cache python3 make g++ openssl openssl-dev

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS dependencies

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# ============================================
# Stage 3: Development
# ============================================
FROM base AS development

WORKDIR /app

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Development command (with hot reload)
CMD ["npm", "run", "dev"]

# ============================================
# Stage 4: Build (for production)
# ============================================
FROM dependencies AS build

WORKDIR /app

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ============================================
# Stage 5: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma files
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma Client for production
RUN npx prisma generate

# Copy built files
COPY --from=build /app/dist ./dist

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Production command
CMD ["npm", "start"]
