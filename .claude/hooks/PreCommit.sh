#!/bin/bash
# PreCommit Hook - Secret detection gate
# Prevents committing sensitive data

echo "🔒 Pre-Commit Security Check"
echo "============================="

ERRORS=0

# Check for hardcoded secrets
echo "Checking for secrets..."
PATTERNS=(
  "password\s*=\s*['\"]"
  "JWT_SECRET\s*=\s*['\"]"
  "API_KEY\s*=\s*['\"]"
  "POSTGRES_.*=\s*['\"].*@"
  "Bearer\s+[A-Za-z0-9\-._~+/]+"
)

for pattern in "${PATTERNS[@]}"; do
  FOUND=$(git diff --cached --diff-filter=ACM -S "$pattern" -- '*.ts' '*.tsx' '*.js' '*.json' 2>/dev/null | grep -c "+")
  if [ "$FOUND" -gt 0 ]; then
    echo "  ❌ Potential secret found matching: $pattern"
    ERRORS=$((ERRORS + 1))
  fi
done

# Check for .env files being committed
if git diff --cached --name-only | grep -qE "^\.env$|\.env\.production$|\.env\.local$"; then
  echo "  ❌ .env file detected in staged changes!"
  ERRORS=$((ERRORS + 1))
fi

# Check for console.log in production code
CONSOLE_LOGS=$(git diff --cached --diff-filter=ACM -- 'backend/src/*.ts' 'frontend/src/*.ts' 'frontend/src/*.tsx' | grep -c "console\.log" 2>/dev/null || true)
if [ "$CONSOLE_LOGS" -gt 0 ]; then
  echo "  ⚠️  Found $CONSOLE_LOGS console.log statements in staged changes"
fi

if [ "$ERRORS" -gt 0 ]; then
  echo ""
  echo "❌ Pre-commit check FAILED with $ERRORS issues"
  echo "   Fix the issues above before committing."
  exit 1
else
  echo ""
  echo "✅ Pre-commit check PASSED"
  exit 0
fi
