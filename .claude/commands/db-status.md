---
description: Check database status, schema sync, and data integrity
---

# Database Status Check

Check current database state, schema synchronization, and data integrity.

## Steps:

### 1. Connection Check
```bash
cd backend && npx prisma db execute --stdin <<< "SELECT 1 as connected;"
```

### 2. Schema Sync Status
```bash
cd backend && npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma
```

### 3. Data Summary
```bash
cd backend && npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const counts = {
    users: await p.user.count(),
    projects: await p.project.count(),
    tasks: await p.task.count(),
    comments: await p.comment.count(),
    tags: await p.tag.count(),
    groups: await p.group.count(),
    notifications: await p.notification.count()
  };
  console.table(counts);
  await p.\$disconnect();
})();
"
```

### 4. Report
- Connection status
- Schema drift (if any)
- Record counts per table
- Last migration applied
- Recommendations
