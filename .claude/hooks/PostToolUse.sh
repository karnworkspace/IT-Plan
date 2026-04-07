#!/bin/bash
# PostToolUse Hook - Auto-lint after file modifications
# Runs TypeScript check on modified files

FILE="$1"
TOOL="$2"

# Only run after Write/Edit tools
if [[ "$TOOL" != "Write" && "$TOOL" != "Edit" ]]; then
  exit 0
fi

# Only check TypeScript files
if [[ ! "$FILE" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

echo "🔍 Post-edit lint check for: $(basename $FILE)"

# Determine if backend or frontend
if [[ "$FILE" == *"backend/"* ]]; then
  cd backend
  npx tsc --noEmit --pretty 2>&1 | tail -5
elif [[ "$FILE" == *"frontend/"* ]]; then
  cd frontend
  npx tsc -b --noEmit --pretty 2>&1 | tail -5
fi
