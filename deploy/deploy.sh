#!/bin/bash
# ==============================================
# TaskFlow — Manual Deploy Script
# Usage: ./deploy/deploy.sh
# รันบน production server เมื่อต้องการ deploy มือ
# ==============================================

set -e  # หยุดทันทีถ้ามี error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DEPLOY_DIR="${DEPLOY_DIR:-/home/deploy/taskflow}"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="${BACKUP_DIR:-/home/deploy/backups}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  TaskFlow — Production Deploy${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

cd "$DEPLOY_DIR"

# --- Step 1: Backup database ---
echo -e "${YELLOW}[1/6] Backing up database...${NC}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/taskflow_pre_deploy_$(date +%Y%m%d_%H%M%S).sql.gz"
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U taskflow taskflow | gzip > "$BACKUP_FILE"
echo -e "${GREEN}  Backup saved: $BACKUP_FILE${NC}"

# --- Step 2: Pull latest code ---
echo -e "${YELLOW}[2/6] Pulling latest code...${NC}"
git pull origin main
echo -e "${GREEN}  Latest commit: $(git log --oneline -1)${NC}"

# --- Step 3: Build & restart containers ---
echo -e "${YELLOW}[3/6] Building & restarting containers...${NC}"
docker compose -f "$COMPOSE_FILE" up -d --build

# --- Step 4: Run Prisma db push ---
echo -e "${YELLOW}[4/6] Syncing database schema...${NC}"
docker compose -f "$COMPOSE_FILE" exec -T backend npx prisma db push --accept-data-loss

# --- Step 5: Clean up ---
echo -e "${YELLOW}[5/6] Cleaning old Docker images...${NC}"
docker image prune -f

# --- Step 6: Health check ---
echo -e "${YELLOW}[6/6] Running health checks...${NC}"
sleep 10

# Backend health
if curl -sf http://localhost:4201/api/v1/health > /dev/null 2>&1; then
  echo -e "${GREEN}  Backend: OK${NC}"
else
  echo -e "${RED}  Backend: FAILED${NC}"
fi

# Frontend health
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}  Frontend: OK (HTTP $HTTP_CODE)${NC}"
else
  echo -e "${RED}  Frontend: FAILED (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy complete!${NC}"
echo -e "${GREEN}========================================${NC}"
docker compose -f "$COMPOSE_FILE" ps
