---
description: Auto-generate and update project documentation
---

# Generate Documentation

Update project documentation based on current codebase state.

## Steps:

### 1. Scan Current State
- Read `prisma/schema.prisma` for database models
- Scan `backend/src/routes/` for API endpoints
- Scan `backend/src/services/` for business logic
- Scan `frontend/src/pages/` for UI pages
- Scan `frontend/src/components/` for reusable components

### 2. Update Documentation Files
- **Doc/CODE-SCHEMA.md**: Update if schema or endpoints changed
- **Doc/PROJECT-PROGRESS.md**: Add new phase if significant changes
- **Doc/QUICK-REFERENCE.md**: Update commands and feature list

### 3. Generate API Summary
For each route file, extract:
- HTTP method + path
- Required auth (public/auth/admin)
- Request body schema
- Response format

### 4. Verify Consistency
- Ensure CLAUDE.md references are still valid
- Check all linked files exist
- Verify test accounts still work

## Output:
List all documentation files updated with a brief summary of changes.
