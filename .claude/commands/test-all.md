---
description: Execute full test suite for YTY TaskFlow
---

# Run Full Test Suite

Execute comprehensive testing across the entire YTY TaskFlow application.

## Steps:

### 1. TypeScript Compilation Check
```bash
cd backend && npx tsc --noEmit
cd ../frontend && npx tsc -b --noEmit
```

### 2. Backend API Tests
```bash
cd tests && npm test
```

### 3. Frontend Lint
```bash
cd frontend && npm run lint
```

### 4. Database Schema Validation
```bash
cd backend && npx prisma validate
```

### 5. Build Verification
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

## Report:
After running all tests, provide:
- Total tests run / passed / failed
- Any TypeScript errors found
- Lint warnings/errors
- Build status (success/failure)
- Recommendations for fixing failures
