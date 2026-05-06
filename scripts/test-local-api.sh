#!/bin/bash
# ============================================================
# Local API Integration Test Runner
# Starts isolated test Docker env, seeds data, runs smoke tests
# Usage: ./scripts/test-local-api.sh
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.test.yml"
API_URL="http://localhost:3100/api/v1"
MAX_WAIT=120  # seconds to wait for backend

echo "╔════════════════════════════════════════════╗"
echo "║  TaskFlow API Integration Tests            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# --- Cleanup function ---
cleanup() {
    echo ""
    echo "🧹 Stopping test containers..."
    docker compose -f "$COMPOSE_FILE" down -v --remove-orphans 2>/dev/null || true
}

# Cleanup on exit (pass or fail)
trap cleanup EXIT

# --- 1. Start test environment ---
echo "📦 Starting test Docker environment..."
docker compose -f "$COMPOSE_FILE" down -v --remove-orphans 2>/dev/null || true
docker compose -f "$COMPOSE_FILE" up -d --build 2>&1 | tail -5

# --- 2. Wait for backend health ---
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
    if [ $((elapsed % 10)) -eq 0 ]; then
        echo "   ...waiting (${elapsed}s)"
    fi
done

if [ $elapsed -ge $MAX_WAIT ]; then
    echo "❌ Backend did not start within ${MAX_WAIT}s"
    echo "   Logs:"
    docker compose -f "$COMPOSE_FILE" logs --tail=20 test-backend
    exit 1
fi

# --- 3. Seed test data ---
echo ""
echo "🌱 Seeding test data..."
node "$PROJECT_DIR/scripts/seed-test-data.mjs" "$API_URL"
echo ""

# --- 4. Run smoke tests ---
echo "🔬 Running API smoke tests..."
node "$PROJECT_DIR/scripts/smoke-api.mjs" "$API_URL"
TEST_EXIT=$?

exit $TEST_EXIT
