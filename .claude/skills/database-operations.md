# Skill: Database Operations

## Purpose
จัดการ database operations ด้วย Prisma อย่างถูกต้องและมีประสิทธิภาพ

## When to Use
- เพิ่ม/แก้ไข database schema
- สร้าง migrations
- Query ข้อมูล
- Optimize queries

## Prerequisites
- Prisma installed
- Database connected
- Schema file พร้อม

## Step-by-Step

### Step 1: Update Schema
```prisma
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

### Step 2: Run Migration
```bash
# Development
npx prisma migrate dev --name add_user_table

# Production
npx prisma migrate deploy
```

### Step 3: Generate Client
```bash
npx prisma generate
```

### Step 4: Basic Queries
```typescript
import { prisma } from '@/lib/prisma';

// Create
const user = await prisma.user.create({
  data: { name: 'John', email: 'john@example.com' }
});

// Read - single
const user = await prisma.user.findUnique({
  where: { id: 'xxx' }
});

// Read - list with pagination
const users = await prisma.user.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' },
  where: { role: 'USER' }
});

// Update
const updated = await prisma.user.update({
  where: { id: 'xxx' },
  data: { name: 'Jane' }
});

// Delete
await prisma.user.delete({
  where: { id: 'xxx' }
});
```

### Step 5: Relations
```typescript
// Include relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'xxx' },
  include: { posts: true }
});

// Select specific fields
const userPartial = await prisma.user.findUnique({
  where: { id: 'xxx' },
  select: { id: true, name: true }
});
```

### Step 6: Transactions
```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: {...} });
  const order = await tx.order.create({
    data: { userId: user.id, ... }
  });
  return { user, order };
});
```

## Testing Checklist
- [ ] Schema valid
- [ ] Migrations สำเร็จ
- [ ] CRUD operations ทำงาน
- [ ] Relations ถูกต้อง
- [ ] Indexes เพียงพอ

## Best Practices
1. ใช้ uuid เป็น primary key
2. เพิ่ม createdAt, updatedAt ทุก table
3. ใช้ transactions สำหรับ multi-step operations
4. ใช้ select/include เฉพาะที่ต้องการ
5. เพิ่ม indexes สำหรับ fields ที่ query บ่อย

## Common Pitfalls
- N+1 query problem - ใช้ include แทน
- ลืม await prisma calls
- ไม่ handle connection errors
- Migration conflicts
