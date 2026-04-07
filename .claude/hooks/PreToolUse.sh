#!/bin/bash
# PreToolUse Hook - Safety gate before destructive operations
# Blocks dangerous commands like dropping tables, force pushing, etc.

COMMAND="$1"

# Check for dangerous database operations
DANGEROUS_DB=(
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE"
  "DELETE FROM.*WHERE 1"
  "prisma migrate reset"
)

for pattern in "${DANGEROUS_DB[@]}"; do
  if echo "$COMMAND" | grep -iqE "$pattern"; then
    echo "⛔ BLOCKED: Dangerous database operation detected!"
    echo "   Pattern: $pattern"
    echo "   Command: $COMMAND"
    echo ""
    echo "   This operation could cause data loss."
    echo "   If intentional, run manually outside the agent."
    exit 1
  fi
done

# Check for dangerous git operations
DANGEROUS_GIT=(
  "git push.*--force"
  "git reset --hard"
  "git clean -fd"
  "git checkout \."
)

for pattern in "${DANGEROUS_GIT[@]}"; do
  if echo "$COMMAND" | grep -iqE "$pattern"; then
    echo "⛔ BLOCKED: Dangerous git operation detected!"
    echo "   Pattern: $pattern"
    echo "   This could cause irreversible changes."
    exit 1
  fi
done

exit 0
