#!/bin/bash

# ===========================================
# TaskFlow - Full Test Suite Runner
# ===========================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:3001/api/v1}"
REPORT_DIR="./reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}"
echo "=============================================="
echo "   TaskFlow - Full Test Suite"
echo "   $(date)"
echo "=============================================="
echo -e "${NC}"

# Check if API is running
echo -e "${YELLOW}🔍 Checking API availability...${NC}"
if curl -s "${API_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API is running at ${API_URL}${NC}"
else
    echo -e "${RED}❌ API is not available at ${API_URL}${NC}"
    echo -e "${YELLOW}Please start the backend server first:${NC}"
    echo "   cd backend && npm run dev"
    echo "   OR"
    echo "   docker-compose up -d"
    exit 1
fi

# Create reports directory
mkdir -p "$REPORT_DIR"

# Run API Tests
echo ""
echo -e "${BLUE}📋 Running API Tests...${NC}"
echo "----------------------------------------------"
npm run test:api -- --json --outputFile="$REPORT_DIR/api-results.json" 2>&1 | tee "$REPORT_DIR/api-output.txt"
API_EXIT_CODE=${PIPESTATUS[0]}

# Run Scenario Tests
echo ""
echo -e "${BLUE}📋 Running Scenario Tests...${NC}"
echo "----------------------------------------------"
API_URL="$API_URL" npx jest --config jest.config.js scenarios/ --json --outputFile="$REPORT_DIR/scenario-results.json" 2>&1 | tee "$REPORT_DIR/scenario-output.txt"
SCENARIO_EXIT_CODE=${PIPESTATUS[0]}

# Generate Summary
echo ""
echo -e "${BLUE}📊 Generating Test Summary...${NC}"
echo "----------------------------------------------"

# Parse results
if [ -f "$REPORT_DIR/api-results.json" ]; then
    API_PASSED=$(cat "$REPORT_DIR/api-results.json" | grep -o '"numPassedTests":[0-9]*' | grep -o '[0-9]*' || echo "0")
    API_FAILED=$(cat "$REPORT_DIR/api-results.json" | grep -o '"numFailedTests":[0-9]*' | grep -o '[0-9]*' || echo "0")
    API_TOTAL=$(cat "$REPORT_DIR/api-results.json" | grep -o '"numTotalTests":[0-9]*' | grep -o '[0-9]*' || echo "0")
else
    API_PASSED="N/A"
    API_FAILED="N/A"
    API_TOTAL="N/A"
fi

if [ -f "$REPORT_DIR/scenario-results.json" ]; then
    SCENARIO_PASSED=$(cat "$REPORT_DIR/scenario-results.json" | grep -o '"numPassedTests":[0-9]*' | grep -o '[0-9]*' || echo "0")
    SCENARIO_FAILED=$(cat "$REPORT_DIR/scenario-results.json" | grep -o '"numFailedTests":[0-9]*' | grep -o '[0-9]*' || echo "0")
    SCENARIO_TOTAL=$(cat "$REPORT_DIR/scenario-results.json" | grep -o '"numTotalTests":[0-9]*' | grep -o '[0-9]*' || echo "0")
else
    SCENARIO_PASSED="N/A"
    SCENARIO_FAILED="N/A"
    SCENARIO_TOTAL="N/A"
fi

# Print Summary
echo ""
echo -e "${GREEN}=============================================="
echo "   TEST RESULTS SUMMARY"
echo "==============================================${NC}"
echo ""
echo "API Tests:"
echo "  ✅ Passed: $API_PASSED"
echo "  ❌ Failed: $API_FAILED"
echo "  📊 Total:  $API_TOTAL"
echo ""
echo "Scenario Tests:"
echo "  ✅ Passed: $SCENARIO_PASSED"
echo "  ❌ Failed: $SCENARIO_FAILED"
echo "  📊 Total:  $SCENARIO_TOTAL"
echo ""

# Overall status
if [ "$API_EXIT_CODE" -eq 0 ] && [ "$SCENARIO_EXIT_CODE" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    OVERALL_STATUS="PASSED"
else
    echo -e "${RED}⚠️ SOME TESTS FAILED${NC}"
    OVERALL_STATUS="FAILED"
fi

echo ""
echo "Reports saved to: $REPORT_DIR/"
echo "  - api-results.json"
echo "  - scenario-results.json"
echo "  - api-output.txt"
echo "  - scenario-output.txt"

# Return appropriate exit code
if [ "$OVERALL_STATUS" = "PASSED" ]; then
    exit 0
else
    exit 1
fi
