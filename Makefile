# ============================================
# TaskFlow Docker Commands
# ============================================
# Usage: make <command>

.PHONY: help dev dev-build dev-down dev-logs prod prod-build prod-down clean db-studio db-migrate db-reset

# Default target
help:
	@echo "TaskFlow Docker Commands"
	@echo "========================"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-build    - Build and start development environment"
	@echo "  make dev-down     - Stop development environment"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-build   - Build and start production environment"
	@echo "  make prod-down    - Stop production environment"
	@echo ""
	@echo "Database:"
	@echo "  make db-studio    - Open Prisma Studio (database GUI)"
	@echo "  make db-migrate   - Run database migrations"
	@echo "  make db-reset     - Reset database (WARNING: deletes all data)"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean        - Remove all containers, volumes, and images"
	@echo "  make adminer      - Start with Adminer (database management)"

# ============================================
# Development Commands
# ============================================

# Start development environment
dev:
	docker-compose up -d
	@echo ""
	@echo "Development environment started!"
	@echo "================================"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:3000"
	@echo "API:      http://localhost:3000/api/v1/health"
	@echo ""
	@echo "Run 'make dev-logs' to view logs"

# Build and start development environment
dev-build:
	docker-compose up -d --build
	@echo ""
	@echo "Development environment built and started!"

# Stop development environment
dev-down:
	docker-compose down

# View development logs
dev-logs:
	docker-compose logs -f

# Start with Adminer (database management tool)
adminer:
	docker-compose --profile tools up -d
	@echo ""
	@echo "Adminer started at http://localhost:8080"
	@echo "Server: postgres | User: taskflow | Password: taskflow123"

# ============================================
# Production Commands
# ============================================

# Start production environment
prod:
	docker-compose -f docker-compose.prod.yml up -d

# Build and start production environment
prod-build:
	docker-compose -f docker-compose.prod.yml up -d --build

# Stop production environment
prod-down:
	docker-compose -f docker-compose.prod.yml down

# ============================================
# Database Commands
# ============================================

# Open Prisma Studio
db-studio:
	docker-compose exec backend npx prisma studio

# Run database migrations
db-migrate:
	docker-compose exec backend npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
db-reset:
	@echo "WARNING: This will delete all data in the database!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker-compose exec backend npx prisma migrate reset --force

# ============================================
# Cleanup Commands
# ============================================

# Remove all containers, volumes, and images
clean:
	@echo "WARNING: This will remove all TaskFlow containers, volumes, and images!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.prod.yml down -v --rmi all 2>/dev/null || true
	@echo "Cleanup complete!"
