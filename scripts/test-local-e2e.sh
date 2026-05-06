#!/bin/bash
# ============================================================
# Local E2E Test Runner (Playwright)
# Starts isolated test Docker env, seeds data, runs Playwright
# Usage: ./scripts/test-local-e2e.sh
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.test.yml"
API_URL="http://localhost:3100/api/v1"
FRONTEND_URL="http://localhost:5174"
MAX_WAIT=120

echo "╔════════════════════════════════════════════╗"
echo "║  TaskFlow E2E Tests (Playwright)           ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# --- Cleanup function ---
cleanup() {
    echo ""
    echo "🧹 Stopping test containers..."
    docker compose -f "$COMPOSE_FILE" down -v --remove-orphans 2>/dev/null || true
}
trap cleanup EXIT

# --- 1. Start test environment ---
echo "📦 Starting test Docker environment (backend + frontend)..."
docker compose -f "$COMPOSE_FILE" down -v --remove-orphans 2>/dev/null || true
docker compose -f "$COMPOSE_FILE" up -d --build 2>&1 | tail -5

# --- 2. Wait for backend ---
echo ""
echo "⏳ Waiting for backend to be ready (max ${MAX_WAIT}s)..."
elapsed=0
while [ $elapsed -lt $MAX_WAIT ]; do
    if curl -s "$API_URL/health" | grep -q '"success":true' 2>/dev/null; then
        echo "✅ Backend ready (${elapsed}s)"
        break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
    if [ $((elapsed % 10)) -eq 0 ]; then echo "   ...waiting (${elapsed}s)"; fi
done
if [ $elapsed -ge $MAX_WAIT ]; then
    echo "❌ Backend did not start within ${MAX_WAIT}s"
    docker compose -f "$COMPOSE_FILE" logs --tail=20 test-backend
    exit 1
fi

# --- 3. Wait for frontend ---
echo ""
echo "⏳ Waiting for frontend to be ready..."
elapsed=0
while [ $elapsed -lt $MAX_WAIT ]; do
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null | grep -q "200"; then
        echo "✅ Frontend ready (${elapsed}s)"
        break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
    if [ $((elapsed % 10)) -eq 0 ]; then echo "   ...waiting (${elapsed}s)"; fi
done
if [ $elapsed -ge $MAX_WAIT ]; then
    echo "❌ Frontend did not start within ${MAX_WAIT}s"
    docker compose -f "$COMPOSE_FILE" logs --tail=20 test-frontend
    exit 1
fi

# --- 4. Seed test data ---
echo ""
echo "🌱 Seeding test data..."
node "$PROJECT_DIR/scripts/seed-test-data.mjs" "$API_URL"
echo ""

# --- 5. Run Playwright ---
echo "🎭 Running Playwright E2E tests..."
cd "$PROJECT_DIR"
npx playwright test --reporter=list
TEST_EXIT=$?

exit $TEST_EXIT
