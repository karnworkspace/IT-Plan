# Skill: API Creation

## Purpose
สร้าง API endpoint ที่มี validation, error handling และ database operations ตามมาตรฐาน

## When to Use
- สร้าง CRUD endpoints
- สร้าง business logic APIs
- สร้าง webhook handlers

## Prerequisites
- Project setup เรียบร้อย
- Database connected
- Zod installed

## Step-by-Step

### Step 1: สร้าง Schema
```typescript
// schema.ts
import { z } from 'zod';

export const createSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

export const updateSchema = createSchema.partial();

export type CreateInput = z.infer<typeof createSchema>;
```

### Step 2: สร้าง Route Handler
```typescript
// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSchema } from './schema';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const [data, total] = await Promise.all([
      prisma.model.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.model.count(),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const result = await prisma.model.create({ data });

    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

### Step 3: Dynamic Route (by ID)
```typescript
// [id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.model.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}
```

## Testing Checklist
- [ ] GET list - pagination ทำงาน
- [ ] POST - สร้างข้อมูลได้
- [ ] Validation errors return 400
- [ ] GET by ID - return 404 เมื่อไม่พบ
- [ ] PUT - update ได้
- [ ] DELETE - ลบได้

## Best Practices
1. Validate input ทุกครั้ง
2. ใช้ response format เดียวกัน
3. Log errors พร้อม context
4. ใช้ HTTP status codes ถูกต้อง
5. เพิ่ม pagination สำหรับ list

## Common Pitfalls
- ลืม await async operations
- ไม่ handle validation errors
- Expose sensitive data in errors
- ไม่ check duplicates
