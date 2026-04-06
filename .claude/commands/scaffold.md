---
description: Scaffold a new feature with all layers (service, controller, routes, frontend)
---

# Scaffold New Feature

Create boilerplate files for a new feature across the full stack.

## Input Required:
- Feature name (e.g., "report", "timeline")
- CRUD operations needed
- Auth requirements (public/auth/admin)

## Steps:

### 1. Backend Files
Create in order:
1. `backend/src/services/{feature}.service.ts` — Business logic with Prisma
2. `backend/src/controllers/{feature}.controller.ts` — HTTP handlers
3. `backend/src/routes/{feature}.routes.ts` — Express routes with auth middleware

### 2. Frontend Files
Create in order:
1. `frontend/src/services/{feature}Service.ts` — API client (Axios)
2. `frontend/src/pages/{feature}/{Feature}Page.tsx` — Main page component
3. `frontend/src/types/index.ts` — Add TypeScript interfaces

### 3. Database (if needed)
1. Add model to `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`

### 4. Register Routes
1. Add to `backend/src/routes/index.ts`
2. Add to `frontend/src/App.tsx` router

## Coding Standards:
- TypeScript strict mode, no `any`
- API Response: `{ success: true, data }` or `{ success: false, error }`
- PascalCase for files/components, camelCase for functions
- Use AppError for error handling
