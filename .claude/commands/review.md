---
description: Run code review on recent changes
---

# Code Review

Review the current diff for code quality, bugs, and best practices.

## Steps:
1. Run `git diff` to see uncommitted changes
2. Run `git diff --cached` to see staged changes
3. For each changed file, check:
   - TypeScript strict mode compliance (no `any` types)
   - Proper error handling with AppError
   - API response format: `{ success: true/false, data/error }`
   - Input validation present
   - No hardcoded credentials or secrets
   - Consistent naming: PascalCase (files/components), camelCase (functions), UPPER_SNAKE (constants)

## Backend Checklist:
- [ ] Service layer contains business logic (not controllers)
- [ ] Controllers only handle HTTP req/res
- [ ] Proper Prisma queries (no raw SQL unless necessary)
- [ ] Error middleware catches all errors
- [ ] Auth middleware on protected routes

## Frontend Checklist:
- [ ] Components use TypeScript interfaces (from types/)
- [ ] Ant Design components used consistently
- [ ] Zustand store updated correctly
- [ ] API calls go through services/ layer
- [ ] No console.log left in production code

## Output:
Provide a summary with:
- 🔴 Critical issues (must fix)
- 🟡 Warnings (should fix)
- 🟢 Good practices found
- 📝 Suggestions for improvement
