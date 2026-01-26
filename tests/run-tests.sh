#!/bin/bash

# ============================================
# AI Agent Test Runner Script
# Automated testing for Task Management System
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TESTS_DIR="$PROJECT_ROOT/tests"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
REPORTS_DIR="$TESTS_DIR/reports"

# ============================================
# Helper Functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

wait_for_port() {
    local port=$1
    local timeout=$2
    local count=0
    
    while ! check_port $port; do
        sleep 1
        count=$((count + 1))
        if [ $count -ge $timeout ]; then
            return 1
        fi
    done
    return 0
}

# ============================================
# Main Functions
# ============================================

check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "Dependencies OK"
}

setup_tests() {
    log_info "Setting up test environment..."
    
    cd "$TESTS_DIR"
    
    if [ ! -d "node_modules" ]; then
        log_info "Installing test dependencies..."
        npm install
    fi
    
    if ! npx playwright --version &> /dev/null; then
        log_info "Installing Playwright browsers..."
        npx playwright install
    fi
    
    mkdir -p "$REPORTS_DIR"
    
    log_success "Test environment ready"
}

start_backend() {
    if check_port 3001; then
        log_info "Backend already running on port 3001"
        return 0
    fi
    
    log_info "Starting backend server..."
    cd "$BACKEND_DIR"
    npm run dev &
    BACKEND_PID=$!
    
    if wait_for_port 3001 30; then
        log_success "Backend started (PID: $BACKEND_PID)"
    else
        log_error "Failed to start backend"
        exit 1
    fi
}

start_frontend() {
    if check_port 5173; then
        log_info "Frontend already running on port 5173"
        return 0
    fi
    
    log_info "Starting frontend server..."
    cd "$FRONTEND_DIR"
    npm run dev &
    FRONTEND_PID=$!
    
    if wait_for_port 5173 30; then
        log_success "Frontend started (PID: $FRONTEND_PID)"
    else
        log_error "Failed to start frontend"
        exit 1
    fi
}

run_api_tests() {
    log_info "Running API tests..."
    cd "$TESTS_DIR"
    
    if npm run test:api; then
        log_success "API tests passed!"
        return 0
    else
        log_error "API tests failed!"
        return 1
    fi
}

run_e2e_tests() {
    log_info "Running E2E tests..."
    cd "$TESTS_DIR"
    
    if npm run test:e2e; then
        log_success "E2E tests passed!"
        return 0
    else
        log_error "E2E tests failed!"
        return 1
    fi
}

generate_report() {
    log_info "Generating test report..."
    
    echo ""
    echo "============================================"
    echo "           TEST RESULTS SUMMARY"
    echo "============================================"
    echo ""
    
    if [ -f "$REPORTS_DIR/e2e-results.json" ]; then
        log_info "E2E Results:"
        cat "$REPORTS_DIR/e2e-results.json" | head -50
    fi
    
    echo ""
    echo "Reports available at:"
    echo "  - API: $REPORTS_DIR/api-test-report.html"
    echo "  - E2E: $REPORTS_DIR/e2e/index.html"
    echo ""
}

cleanup() {
    log_info "Cleaning up..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
}

# ============================================
# Main Script
# ============================================

main() {
    echo ""
    echo "============================================"
    echo "  🤖 AI Agent Automated Test Runner"
    echo "============================================"
    echo ""
    
    trap cleanup EXIT
    
    check_dependencies
    setup_tests
    
    # Parse arguments
    RUN_API=false
    RUN_E2E=false
    START_SERVERS=false
    
    for arg in "$@"; do
        case $arg in
            --api) RUN_API=true ;;
            --e2e) RUN_E2E=true ;;
            --start-servers) START_SERVERS=true ;;
            --all) RUN_API=true; RUN_E2E=true ;;
            --help)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --api           Run API tests only"
                echo "  --e2e           Run E2E tests only"
                echo "  --all           Run all tests"
                echo "  --start-servers Start backend and frontend"
                echo "  --help          Show this help"
                exit 0
                ;;
        esac
    done
    
    # Default: run all
    if [ "$RUN_API" = false ] && [ "$RUN_E2E" = false ]; then
        RUN_API=true
        RUN_E2E=true
    fi
    
    # Start servers if requested
    if [ "$START_SERVERS" = true ]; then
        start_backend
        start_frontend
        sleep 5
    fi
    
    # Run tests
    API_RESULT=0
    E2E_RESULT=0
    
    if [ "$RUN_API" = true ]; then
        run_api_tests || API_RESULT=$?
    fi
    
    if [ "$RUN_E2E" = true ]; then
        run_e2e_tests || E2E_RESULT=$?
    fi
    
    generate_report
    
    # Exit with error if any test failed
    if [ $API_RESULT -ne 0 ] || [ $E2E_RESULT -ne 0 ]; then
        log_error "Some tests failed!"
        exit 1
    fi
    
    log_success "All tests passed! 🎉"
}

main "$@"
