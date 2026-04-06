#!/bin/bash
# SessionStart Hook - Load project context
# Displays project status summary when starting a new session

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 YTY TaskFlow - Session Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Git status
echo ""
echo "📌 Git Status:"
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "   Branch: $BRANCH"
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "   Uncommitted changes: $UNCOMMITTED files"

# Docker status
echo ""
echo "🐳 Docker:"
if docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | grep -q "taskflow"; then
  docker ps --format "   {{.Names}}: {{.Status}}" 2>/dev/null | grep "taskflow"
else
  echo "   No TaskFlow containers running"
fi

# Quick summary
echo ""
echo "📚 Key Files:"
echo "   CLAUDE.md → AI guidelines"
echo "   Doc/PROJECT-PROGRESS.md → Current phase"
echo "   Doc/CODE-SCHEMA.md → Full codebase map"
echo ""
echo "🔗 Commands: /review /deploy /test-all /document /db-status /scaffold"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
