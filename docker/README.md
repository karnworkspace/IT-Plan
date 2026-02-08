# Docker Setup - TaskFlow

## Quick Start

### 1. Setup Environment

```bash
# Copy environment file
cp docker/.env.example .env

# Edit .env if needed (default values work for development)
```

### 2. Start Development Environment

```bash
# Using Make (recommended)
make dev

# Or using docker-compose directly
docker-compose up -d
```

### 3. Access Applications

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React App |
| **Backend API** | http://localhost:3000 | Express API |
| **Health Check** | http://localhost:3000/api/v1/health | API Status |
| **Adminer** | http://localhost:8080 | Database GUI (optional) |

---

## Available Commands

### Using Make

```bash
# Development
make dev          # Start development environment
make dev-build    # Build and start
make dev-down     # Stop
make dev-logs     # View logs

# Production
make prod         # Start production
make prod-build   # Build and start production
make prod-down    # Stop production

# Database
make db-studio    # Open Prisma Studio
make db-migrate   # Run migrations
make db-reset     # Reset database (WARNING!)

# Utilities
make adminer      # Start with Adminer
make clean        # Remove all containers/volumes
```

### Using Docker Compose

```bash
# Development
docker-compose up -d              # Start
docker-compose up -d --build      # Build and start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose logs -f backend    # View backend logs only

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down

# Database operations
docker-compose exec backend npx prisma studio
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

---

## Services Overview

### PostgreSQL
- **Image:** postgres:16-alpine
- **Port:** 5432
- **Credentials:** taskflow / taskflow123 (default)
- **Database:** taskflow

### Backend
- **Framework:** Express + TypeScript
- **Port:** 3000
- **Hot Reload:** Yes (development mode)
- **ORM:** Prisma

### Frontend
- **Framework:** React + Vite
- **Port:** 5173 (dev) / 80 (prod)
- **Hot Reload:** Yes (development mode)

---

## Environment Variables

### Database
| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | taskflow | Database username |
| `POSTGRES_PASSWORD` | taskflow123 | Database password |
| `POSTGRES_DB` | taskflow | Database name |
| `POSTGRES_PORT` | 5432 | Database port |

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` | 3000 | API port |
| `JWT_ACCESS_SECRET` | (required) | JWT signing key |
| `JWT_REFRESH_SECRET` | (required) | Refresh token key |
| `CORS_ORIGIN` | http://localhost:5173 | Allowed origins |

### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_PORT` | 5173 | Dev server port |
| `VITE_API_URL` | http://localhost:3000/api/v1 | API URL |

---

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check if postgres is running
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Rebuild Containers
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Reset Everything
```bash
# Remove all containers and volumes
make clean

# Or manually
docker-compose down -v --rmi all
```

---

## Development Tips

### View Logs
```bash
# All services
make dev-logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute Commands in Container
```bash
# Backend
docker-compose exec backend sh
docker-compose exec backend npx prisma studio

# Frontend
docker-compose exec frontend sh
```

### Database Access
```bash
# Using Adminer (GUI)
make adminer
# Open http://localhost:8080
# Server: postgres, User: taskflow, Password: taskflow123

# Using psql (CLI)
docker-compose exec postgres psql -U taskflow -d taskflow
```

---

## Production Deployment

```bash
# 1. Update .env with production values
# - Strong JWT secrets
# - Proper CORS origins
# - Production database credentials

# 2. Build and start
make prod-build

# 3. Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

---

**Last Updated:** 2026-02-08
