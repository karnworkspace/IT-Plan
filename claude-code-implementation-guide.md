# Claude Code Implementation Guide
## คู่มือการนำ Claude Code มาใช้ในองค์กร

**Version:** 1.0  
**Last Updated:** January 2026  
**Prepared for:** SENA Development PCL - Digital Platform & Integration Team

---

## 📋 สารบัญ

1. [ภาพรวมและวัตถุประสงค์](#ภาพรวมและวัตถุประสงค์)
2. [โครงสร้างไดเรกทอรีมาตรฐาน](#โครงสร้างไดเรกทอรีมาตรฐาน)
3. [กระบวนการ Setup เริ่มต้น](#กระบวนการ-setup-เริ่มต้น)
4. [การจัดการ Context Files](#การจัดการ-context-files)
5. [การสร้างและใช้งาน Skills](#การสร้างและใช้งาน-skills)
6. [Workflow การพัฒนาระบบ](#workflow-การพัฒนาระบบ)
7. [Best Practices และ Guidelines](#best-practices-และ-guidelines)
8. [มาตรฐานการตั้งชื่อและจัดเก็บ](#มาตรฐานการตั้งชื่อและจัดเก็บ)
9. [Checklist และ Templates](#checklist-และ-templates)

---

## ภาพรวมและวัตถุประสงค์

### วัตถุประสงค์
- สร้าง **Foundation** ที่มั่นคงสำหรับการพัฒนาระบบด้วย AI-assisted development
- กำหนด **Standard** การจัดการ Context และ Knowledge สำหรับ Claude Code
- เพิ่ม **Productivity** และลดเวลาการ onboard นักพัฒนาใหม่
- รักษา **Consistency** ของคุณภาพโค้ดและสถาปัตยกรรมระบบ

### ขอบเขตการใช้งาน
- พัฒนา Web Applications (Next.js, Node.js)
- สร้าง API Endpoints และ Integrations
- จัดการ Database Schema และ Migrations
- ทำ Infrastructure as Code
- เขียน Documentation และ Technical Specs

---

## โครงสร้างไดเรกทอรีมาตรฐาน

### รูปแบบโครงสร้างโปรเจค

```
project-root/
├── .claude/
│   ├── context/
│   │   ├── 01-architecture.md
│   │   ├── 02-tech-stack.md
│   │   ├── 03-database-schema.md
│   │   ├── 04-api-structure.md
│   │   ├── 05-coding-standards.md
│   │   ├── 06-security-requirements.md
│   │   └── 07-business-rules.md
│   │
│   ├── skills/
│   │   ├── nextjs-development.md
│   │   ├── api-creation.md
│   │   ├── database-operations.md
│   │   ├── s3-file-management.md
│   │   ├── authentication-flow.md
│   │   ├── email-integration.md
│   │   └── deployment-process.md
│   │
│   ├── templates/
│   │   ├── api-endpoint-template.ts
│   │   ├── database-model-template.ts
│   │   ├── component-template.tsx
│   │   └── test-template.spec.ts
│   │
│   └── README.md
│
├── src/
├── docs/
├── tests/
└── ...
```

### คำอธิบายแต่ละส่วน

#### `.claude/context/` - ความรู้พื้นฐานของโปรเจค
เก็บข้อมูลที่ Claude ควรรู้เพื่อเข้าใจโปรเจคโดยรวม

#### `.claude/skills/` - วิธีการทำงานเฉพาะทาง
เก็บ step-by-step guides และ best practices สำหรับงานที่ทำบ่อย

#### `.claude/templates/` - Code Templates
เก็บ template โค้ดที่ใช้เป็นพื้นฐานในการสร้างไฟล์ใหม่

---

## กระบวนการ Setup เริ่มต้น

### Phase 1: การเตรียมโปรเจค (ครั้งเดียวต่อโปรเจค)

#### Step 1.1: สร้างโครงสร้าง Directory

```bash
# สร้าง directory structure
mkdir -p .claude/{context,skills,templates}

# สร้าง README
touch .claude/README.md
```

#### Step 1.2: เขียน Core Context Files

**ลำดับความสำคัญในการสร้าง:**

1. **01-architecture.md** - สถาปัตยกรรมระบบ
2. **02-tech-stack.md** - เทคโนโลยีที่ใช้
3. **03-database-schema.md** - โครงสร้างฐานข้อมูล
4. **05-coding-standards.md** - มาตรฐานการเขียนโค้ด
5. เพิ่มเติมตามความจำเป็น

#### Step 1.3: Commit เข้า Version Control

```bash
git add .claude/
git commit -m "Initial Claude Code setup with context and skills"
git push origin main
```

### Phase 2: การสร้าง Skills (ทำควบคู่กับการพัฒนา)

#### Step 2.1: ระบุ Tasks ที่ทำบ่อย
- สร้าง API endpoint
- เพิ่ม database table
- Upload file ไป S3
- ส่ง email notification
- Deploy application

#### Step 2.2: สร้าง Skill File สำหรับแต่ละ Task
ใช้ Template ด้านล่างในการสร้าง

#### Step 2.3: Test และ Refine
- ทดลองใช้งานจริง
- ปรับปรุงจาก feedback
- Update ตาม best practices ใหม่

---

## การจัดการ Context Files

### Template: Architecture Context

```markdown
# System Architecture

## Overview
[คำอธิบายระบบโดยรวม 2-3 ประโยค]

## Architecture Diagram
```
[Mermaid diagram หรือ ASCII art]
```

## Components
### Frontend
- Framework: Next.js 14 (App Router)
- UI Library: Tailwind CSS + shadcn/ui
- State Management: Zustand

### Backend
- Runtime: Node.js 20 LTS
- Framework: Next.js API Routes
- ORM: Prisma

### Database
- Primary: PostgreSQL 15
- Cache: Redis (optional)

### Cloud Services
- Hosting: DigitalOcean Droplets
- Storage: AWS S3
- Email: SMTP (specify provider)

## Data Flow
[อธิบายการไหลของข้อมูลในระบบ]

## Integration Points
- [ระบบ A] - เชื่อมต่อผ่าน REST API
- [ระบบ B] - เชื่อมต่อผ่าน Webhook

## Security Considerations
- Authentication: JWT tokens
- Authorization: Role-based access control
- Data encryption: [ระบุวิธีการ]
```

### Template: Tech Stack Context

```markdown
# Technology Stack

## Language & Runtime
- **Primary Language:** TypeScript 5.x
- **Runtime:** Node.js 20 LTS
- **Package Manager:** npm 10.x

## Frontend Stack
- **Framework:** Next.js 14.x (App Router)
- **Styling:** Tailwind CSS 3.x
- **UI Components:** shadcn/ui
- **Form Handling:** React Hook Form + Zod
- **State Management:** Zustand / React Context

## Backend Stack
- **API Framework:** Next.js Route Handlers
- **ORM:** Prisma 5.x
- **Validation:** Zod
- **Authentication:** NextAuth.js / Custom JWT

## Database
- **Type:** PostgreSQL 15.x
- **Migration Tool:** Prisma Migrate
- **Connection Pooling:** PgBouncer (production)

## Cloud & DevOps
- **Hosting:** DigitalOcean Droplets
- **Storage:** AWS S3
- **CDN:** CloudFlare (if applicable)
- **CI/CD:** GitHub Actions / GitLab CI

## Development Tools
- **IDE:** VSCode with extensions
- **Version Control:** Git + GitHub/GitLab
- **API Testing:** Postman / Thunder Client
- **Database GUI:** DBeaver / pgAdmin

## Key Libraries
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "prisma": "5.x",
    "@aws-sdk/client-s3": "latest",
    "zod": "latest",
    "nodemailer": "latest"
  }
}
```

## Version Compatibility Matrix
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js   | 20 LTS  | Required |
| Next.js   | 14.x    | App Router |
| Prisma    | 5.x     | Latest stable |
```

### Template: Coding Standards

```markdown
# Coding Standards

## File Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── [dynamic]/         # Dynamic routes
├── components/            
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
└── services/              # Business logic
```

## Naming Conventions

### Files
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Types: PascalCase (`User.types.ts`)
- APIs: kebab-case (`user-profile.ts`)

### Variables & Functions
```typescript
// Variables: camelCase
const userName = "John";
const isActive = true;

// Functions: camelCase
function getUserById(id: string) { }
const handleSubmit = () => { };

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_BASE_URL = process.env.API_URL;

// Types/Interfaces: PascalCase
interface User { }
type UserResponse = { };
```

## Code Style

### TypeScript
- **Always use TypeScript** - ไม่ใช้ `.js` ในโปรเจคใหม่
- **Strict mode enabled** - `"strict": true` in tsconfig.json
- **Explicit return types** สำหรับ functions ที่สำคัญ
- **Interface over Type** เว้นแต่ต้องใช้ union/intersection

### React Components
```typescript
// ✅ Good: Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ Avoid: Any types, no props interface
export function Button(props: any) { }
```

### API Routes
```typescript
// ✅ Good: Structured error handling
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = requestSchema.parse(body);
    
    // Business logic here
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Error Handling
- ใช้ try-catch สำหรับ async operations
- Return structured error responses
- Log errors ด้วย appropriate level
- ไม่ expose sensitive information ใน error messages

## Comments & Documentation
```typescript
// ✅ Good: JSDoc for complex functions
/**
 * Uploads file to S3 bucket with progress tracking
 * @param file - File to upload
 * @param bucket - Target S3 bucket name
 * @param onProgress - Optional progress callback
 * @returns Upload result with file URL
 */
async function uploadToS3(
  file: File, 
  bucket: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> { }

// ✅ Good: Inline comments for complex logic
// Calculate discount based on user tier and purchase amount
const discount = userTier === 'premium' 
  ? amount * 0.15  // 15% for premium
  : amount * 0.05; // 5% for regular

// ❌ Avoid: Obvious comments
const total = price + tax; // Add price and tax
```

## Git Commit Messages
```
Format: <type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat(auth): implement JWT token refresh
fix(api): resolve user profile update error
docs(readme): update installation steps
refactor(database): optimize query performance
```
```

---

## การสร้างและใช้งาน Skills

### Template: Skill File Structure

```markdown
# Skill Name: [ชื่อ Skill]

## Purpose
[อธิบายจุดประสงค์ของ skill นี้ 1-2 ประโยค]

## When to Use
- [สถานการณ์ที่ 1]
- [สถานการณ์ที่ 2]
- [สถานการณ์ที่ 3]

## Prerequisites
- [สิ่งที่ต้องมีก่อนเริ่มงาน]
- [Dependencies ที่ต้องติดตั้ง]
- [Configuration ที่ต้องตั้งค่า]

## Step-by-Step Process

### Step 1: [ชื่อขั้นตอน]
[รายละเอียดขั้นตอน]

```[language]
// Code example
```

**Expected Output:** [ผลลัพธ์ที่คาดหวัง]
**Common Issues:** [ปัญหาที่อาจเจอและวิธีแก้]

### Step 2: [ชื่อขั้นตอน]
[รายละเอียดขั้นตอน]

### Step 3: [ชื่อขั้นตอน]
[รายละเอียดขั้นตอน]

## Code Template
[Template โค้ดที่สามารถ copy-paste ได้]

## Testing Checklist
- [ ] [สิ่งที่ต้อง test ข้อที่ 1]
- [ ] [สิ่งที่ต้อง test ข้อที่ 2]
- [ ] [สิ่งที่ต้อง test ข้อที่ 3]

## Best Practices
1. [Best practice ข้อที่ 1]
2. [Best practice ข้อที่ 2]
3. [Best practice ข้อที่ 3]

## Common Pitfalls
- ❌ [สิ่งที่ไม่ควรทำ] → ✅ [ควรทำอย่างไร]
- ❌ [สิ่งที่ไม่ควรทำ] → ✅ [ควรทำอย่างไร]

## Related Skills
- [Skill ที่เกี่ยวข้อง 1]
- [Skill ที่เกี่ยวข้อง 2]

## References
- [Documentation link]
- [Tutorial link]
- [Internal wiki link]
```

### ตัวอย่าง: Next.js API Creation Skill

```markdown
# Skill Name: Creating Next.js API Endpoints

## Purpose
สร้าง API endpoint ใน Next.js App Router ที่มีการจัดการ validation, error handling, และ database operations อย่างถูกต้องตามมาตรฐานองค์กร

## When to Use
- สร้าง API endpoint ใหม่สำหรับ CRUD operations
- เพิ่ม business logic endpoint
- Integrate กับ external services
- สร้าง webhook handlers

## Prerequisites
- โปรเจคใช้ Next.js 14+ App Router
- ติดตั้ง Prisma และตั้งค่า database connection แล้ว
- ติดตั้ง Zod สำหรับ validation
- มี environment variables ที่จำเป็น

## Step-by-Step Process

### Step 1: สร้างโครงสร้างไฟล์

สร้างไฟล์ใน `src/app/api/[version]/[resource]/route.ts`

```bash
# Example: User management API
mkdir -p src/app/api/v1/users
touch src/app/api/v1/users/route.ts
```

**Best Practice:** ใช้ API versioning (`/v1/`, `/v2/`) เพื่อรองรับการเปลี่ยนแปลงในอนาคต

### Step 2: กำหนด Request/Response Schema

```typescript
// src/app/api/v1/users/schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['user', 'admin', 'manager']).default('user'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number').optional(),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### Step 3: สร้าง API Route Handler

```typescript
// src/app/api/v1/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from './schema';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET - List users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createUserSchema.parse(body);

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### Step 4: สร้าง Dynamic Route (สำหรับ GET/PUT/DELETE by ID)

```typescript
// src/app/api/v1/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateUserSchema } from '../schema';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
```

## Testing Checklist
- [ ] GET list endpoint ทำงานถูกต้อง (pagination, filtering)
- [ ] POST endpoint สร้างข้อมูลใหม่ได้
- [ ] Validation errors return 400 status
- [ ] Duplicate check ทำงานถูกต้อง (409 status)
- [ ] GET by ID return 404 เมื่อไม่พบข้อมูล
- [ ] PUT endpoint update ข้อมูลได้
- [ ] DELETE endpoint ลบข้อมูลได้
- [ ] Error responses มี consistent format
- [ ] Database transactions rollback เมื่อเกิด error

## Best Practices
1. **Always validate input** - ใช้ Zod schema สำหรับทุก endpoint
2. **Consistent response format** - ใช้ `{ success, data?, error? }` เสมอ
3. **Proper HTTP status codes** - 200, 201, 400, 404, 409, 500
4. **Error logging** - Log errors ด้วย console.error พร้อม context
5. **Pagination** - เพิ่ม pagination สำหรับ list endpoints
6. **API versioning** - ใช้ `/v1/`, `/v2/` prefix
7. **Type safety** - Export types จาก schema เพื่อใช้ใน frontend

## Common Pitfalls
- ❌ ลืม validate input → ✅ ใช้ Zod schema validation เสมอ
- ❌ Return different response formats → ✅ ใช้ consistent format
- ❌ ไม่มี error handling → ✅ Wrap ทุก operation ด้วย try-catch
- ❌ Expose sensitive data in errors → ✅ Return generic messages
- ❌ ไม่ check duplicates → ✅ Validate uniqueness ก่อน create
- ❌ Missing await → ✅ ใช้ await กับทุก async operation
- ❌ Hard-code values → ✅ ใช้ environment variables

## Related Skills
- database-operations.md - Prisma best practices
- authentication-flow.md - Securing API endpoints
- s3-file-management.md - Handling file uploads in APIs

## References
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Documentation](https://zod.dev/)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
```

---

## Workflow การพัฒนาระบบ

### Phase 1: Planning (ก่อนเริ่มเขียนโค้ด)

#### 1.1 Review Context Files
```bash
# ตรวจสอบว่ามี context ครบถ้วนหรือไม่
ls -la .claude/context/
cat .claude/context/01-architecture.md
cat .claude/context/02-tech-stack.md
```

#### 1.2 ระบุ Skills ที่จะใช้
```
สำหรับ Feature นี้ต้องใช้:
- api-creation.md (สร้าง endpoints)
- database-operations.md (เพิ่ม table ใหม่)
- s3-file-management.md (upload documents)
```

#### 1.3 เตรียม Prompt Template
```
Task: [อธิบายงานที่ต้องทำ]
Context: ใช้ .claude/context/01-architecture.md และ 02-tech-stack.md
Skills: ใช้ api-creation.md และ database-operations.md
Requirements:
  - [Requirement 1]
  - [Requirement 2]
Output: [สิ่งที่ต้องการให้ Claude สร้าง]
```

### Phase 2: Development with Claude Code

#### 2.1 เริ่ม Session

**Option 1: Command Line**
```bash
claude "Load context from .claude/context/
และ skills จาก .claude/skills/api-creation.md

Task: สร้าง API endpoint สำหรับ document management
- POST /api/v1/documents (upload to S3)
- GET /api/v1/documents (list with pagination)
- DELETE /api/v1/documents/[id]

Requirements:
- ใช้ Prisma สำหรับ database
- Upload files ไป S3 bucket: sena-documents
- Validate file types: PDF, DOC, DOCX only
- Max file size: 10MB
- Return file URL after upload

Please follow coding standards from 05-coding-standards.md"
```

**Option 2: ใน IDE (VSCode with Claude Code extension)**
```
1. Open Command Palette (Cmd+Shift+P)
2. Select "Claude Code: Start Session"
3. Paste prompt ข้างบน
```

#### 2.2 Iterative Development

```
# Round 1: สร้าง base structure
Claude → สร้าง API routes และ schemas

# Round 2: เพิ่ม business logic
User: "เพิ่ม permission check - เฉพาะ admin เท่านั้นที่ลบได้"
Claude → เพิ่ม authorization logic

# Round 3: Error handling
User: "เพิ่ม detailed error messages สำหรับแต่ละ error case"
Claude → Improve error handling

# Round 4: Testing
User: "สร้าง test cases สำหรับ API endpoints เหล่านี้"
Claude → Generate test files
```

#### 2.3 Code Review Checklist

หลังจาก Claude สร้างโค้ดเสร็จ ตรวจสอบ:

- [ ] ตรงตาม requirements ทั้งหมด
- [ ] Follow coding standards
- [ ] มี proper error handling
- [ ] มี input validation
- [ ] มี TypeScript types
- [ ] มี comments สำหรับ complex logic
- [ ] ไม่มี hardcoded values
- [ ] ใช้ environment variables ถูกต้อง
- [ ] มี proper logging
- [ ] Security considerations ครบถ้วน

### Phase 3: Testing & Refinement

#### 3.1 Manual Testing
```bash
# Start dev server
npm run dev

# Test APIs with curl or Postman
curl -X POST http://localhost:3000/api/v1/documents \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test.pdf"
```

#### 3.2 Automated Testing
```bash
# Run tests generated by Claude
npm test

# Check coverage
npm run test:coverage
```

#### 3.3 Refinement Loop
```
หาก testing พบปัญหา:
1. บันทึก issue ที่พบ
2. Prompt Claude: "พบ bug: [อธิบายปัญหา]. กรุณาแก้ไข"
3. Claude → แก้ไขโค้ด
4. Test ใหม่อีกครั้ง
5. Repeat จนกว่าจะผ่านทุก test cases
```

### Phase 4: Documentation & Deployment

#### 4.1 Generate Documentation
```
Prompt: "สร้าง API documentation สำหรับ endpoints ทั้งหมด
ในรูปแบบ OpenAPI/Swagger หรือ Markdown"
```

#### 4.2 Update Context Files (ถ้าจำเป็น)
```bash
# ถ้ามีการเปลี่ยนแปลง architecture หรือ tech stack
# Update context files
vim .claude/context/01-architecture.md

# Commit changes
git add .claude/
git commit -m "docs: update architecture after adding document management"
```

#### 4.3 Create/Update Skill Files
```bash
# ถ้า develop วิธีใหม่ที่ดี → สร้าง skill file ใหม่
# เพื่อใช้ในครั้งหน้า
vim .claude/skills/s3-document-upload.md

# Commit
git add .claude/skills/s3-document-upload.md
git commit -m "docs: add S3 document upload skill"
```

#### 4.4 Deploy
```bash
# ตาม deployment process ของโปรเจค
git push origin main
# CI/CD จะ deploy automatically
```

---

## Best Practices และ Guidelines

### 1. การเขียน Context Files

#### ✅ Do's
- **เขียนชัดเจน กระชับ** - ใช้ bullet points และ tables
- **Update เมื่อมีการเปลี่ยนแปลง** - รักษาให้ตรงกับความเป็นจริง
- **ใช้ภาษาเดียว consistently** - ไทยหรืออังกฤษ (แนะนำอังกฤษ)
- **เพิ่ม examples** - Code snippets, diagrams
- **Link to external docs** - เชื่อมกับ docs อื่นๆ ที่เกี่ยวข้อง

#### ❌ Don'ts
- **ไม่ใส่ข้อมูลที่ล้าสมัย** - ตรวจสอบความถูกต้องเสมอ
- **ไม่ copy-paste ทั้งหมดจาก docs** - สรุปเฉพาะที่จำเป็น
- **ไม่ hardcode secrets** - ใช้ env variable names แทน
- **ไม่ทำให้ยาวเกินไป** - แยกเป็นหลายไฟล์
- **ไม่ละเลยการ version control** - Commit ทุกครั้งที่แก้ไข

### 2. การเขียน Skill Files

#### ✅ Do's
- **Step-by-step มีลำดับชัดเจน** - 1, 2, 3...
- **มี code examples** - ทุก step ควรมี code snippet
- **อธิบาย "ทำไม"** - ไม่ใช่แค่ "ทำอย่างไร"
- **ใส่ troubleshooting tips** - Common issues และวิธีแก้
- **Update จาก lessons learned** - เพิ่มจาก real experience

#### ❌ Don'ts
- **ไม่ assume ความรู้** - อธิบายทุกขั้นตอนอย่างละเอียด
- **ไม่ใช้ jargon มากเกินไป** - หรืออธิบายเมื่อใช้
- **ไม่ skip prerequisites** - ระบุสิ่งที่ต้องมีก่อน
- **ไม่ลืม test cases** - ต้องบอกวิธี verify ว่าสำเร็จ

### 3. การใช้งาน Claude Code

#### ✅ Do's
- **Load context ก่อนเสมอ** - อย่าเริ่มโดยไม่มี context
- **ระบุ output ที่ชัดเจน** - บอกว่าต้องการอะไร
- **Iterate in small steps** - แบ่งงานใหญ่เป็นงานเล็กๆ
- **Review ทุกครั้ง** - ไม่ใช้โค้ดที่ Claude สร้างโดยไม่ตรวจสอบ
- **Ask for explanation** - ถ้าไม่เข้าใจ ให้ Claude อธิบาย

#### ❌ Don'ts
- **ไม่ assume Claude รู้ทุกอย่าง** - ให้ context เสมอ
- **ไม่ใช้โค้ดโดยไม่เข้าใจ** - อาจมี security issues
- **ไม่ skip testing** - Test ก่อน deploy เสมอ
- **ไม่ลืม update docs** - Documentation ต้อง sync กับโค้ด

### 4. Security Best Practices

#### Sensitive Information
```markdown
❌ ไม่ควรเขียนใน Context Files:
- API keys, tokens, passwords
- Database connection strings ที่มี credentials
- Private keys, certificates
- Customer data, PII

✅ ควรเขียนใน Context Files:
- Environment variable names
- Configuration structure
- API endpoint patterns
- Architecture diagrams (without credentials)
```

#### Example: Safe Context
```markdown
## Database Connection

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string
  Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- `DATABASE_SSL` - Enable SSL (true/false)

**Example .env structure:**
```
DATABASE_URL=postgresql://localhost:5432/mydb
DATABASE_SSL=false
```

❌ **Never commit:**
- Real credentials
- Production connection strings
- API keys
```

### 5. Maintenance & Updates

#### Weekly Tasks
- [ ] Review และ update context files ถ้ามีการเปลี่ยนแปลง
- [ ] เพิ่ม skills ใหม่จาก lessons learned
- [ ] ทดสอบ existing skills ว่ายังใช้ได้
- [ ] Cleanup skills ที่ไม่ได้ใช้แล้ว

#### Monthly Tasks
- [ ] Full review ของทุก context files
- [ ] Update tech stack versions
- [ ] Review และ improve existing skills
- [ ] รวบรวม feedback จากทีม

#### Quarterly Tasks
- [ ] Architecture review
- [ ] Evaluate new tools/technologies
- [ ] Team training session
- [ ] Update templates และ standards

---

## มาตรฐานการตั้งชื่อและจัดเก็บ

### Context Files Naming Convention

```
Format: [Number]-[category].md

Examples:
01-architecture.md
02-tech-stack.md
03-database-schema.md
04-api-structure.md
05-coding-standards.md
06-security-requirements.md
07-business-rules.md
08-deployment-process.md
09-third-party-integrations.md
10-monitoring-logging.md
```

**หลักการ:**
- เรียงลำดับตามความสำคัญ (01-10)
- ใช้ kebab-case สำหรับชื่อไฟล์
- ชื่อต้องสื่อความหมายชัดเจน
- ไม่เกิน 3 คำ

### Skill Files Naming Convention

```
Format: [action]-[subject].md

Examples:
api-creation.md
database-migration.md
s3-file-upload.md
email-notification.md
user-authentication.md
payment-processing.md
report-generation.md
error-handling.md
```

**หลักการ:**
- ขึ้นต้นด้วย verb (action)
- ตามด้วย noun (subject)
- ใช้ kebab-case
- Specific มากกว่า generic

### Directory Organization by Project Type

#### Single Application
```
project/
└── .claude/
    ├── context/
    ├── skills/
    └── templates/
```

#### Monorepo
```
monorepo/
├── .claude/                    # Shared context
│   ├── context/
│   │   ├── 01-monorepo-structure.md
│   │   └── 02-shared-standards.md
│   └── skills/
│       └── monorepo-management.md
│
├── apps/
│   ├── web/
│   │   └── .claude/           # App-specific context
│   │       ├── context/
│   │       └── skills/
│   └── api/
│       └── .claude/
│           ├── context/
│           └── skills/
│
└── packages/
    └── shared/
        └── .claude/
            └── skills/
```

#### Multi-Project Organization
```
company/
├── common/
│   └── .claude/               # Company-wide standards
│       ├── context/
│       │   ├── company-coding-standards.md
│       │   ├── security-policies.md
│       │   └── deployment-guidelines.md
│       └── skills/
│           ├── company-api-patterns.md
│           └── company-database-standards.md
│
├── project-a/
│   └── .claude/               # Project-specific
│       ├── context/
│       └── skills/
│
└── project-b/
    └── .claude/
        ├── context/
        └── skills/
```

**Strategy:**
1. **Shared context** - ใส่ใน root level
2. **Project-specific** - ใส่ใน project directory
3. **Symlink common files** - หรือใช้ git submodule สำหรับ shared context

---

## Checklist และ Templates

### Setup Checklist

#### Initial Project Setup
```markdown
## Phase 1: Directory Structure
- [ ] สร้าง .claude directory
- [ ] สร้าง .claude/context directory
- [ ] สร้าง .claude/skills directory
- [ ] สร้าง .claude/templates directory
- [ ] สร้าง .claude/README.md

## Phase 2: Core Context Files
- [ ] 01-architecture.md (ระบบโดยรวม)
- [ ] 02-tech-stack.md (เทคโนโลยี)
- [ ] 03-database-schema.md (ฐานข้อมูล)
- [ ] 05-coding-standards.md (มาตรฐานโค้ด)

## Phase 3: Essential Skills
- [ ] api-creation.md (สร้าง API)
- [ ] database-operations.md (จัดการ DB)
- [ ] deployment-process.md (Deploy)

## Phase 4: Version Control
- [ ] เพิ่ม .claude/ เข้า git
- [ ] สร้าง .gitignore สำหรับ sensitive files
- [ ] Commit initial setup
- [ ] Push to remote repository

## Phase 5: Team Onboarding
- [ ] สร้าง documentation สำหรับทีม
- [ ] Training session การใช้ Claude Code
- [ ] Setup Claude Code ในเครื่องแต่ละคน
- [ ] Review process และ guidelines
```

### Development Task Checklist

```markdown
## ก่อนเริ่มพัฒนา
- [ ] Review requirements
- [ ] ระบุ context files ที่ต้องใช้
- [ ] ระบุ skills ที่ต้องใช้
- [ ] เตรียม prompt template
- [ ] Setup development environment

## ระหว่างพัฒนา
- [ ] Load context และ skills
- [ ] สั่งงาน Claude ด้วย clear prompt
- [ ] Review โค้ดที่ Claude สร้าง
- [ ] Test แต่ละ feature
- [ ] Fix issues ที่พบ
- [ ] Iterate จนได้ตามต้องการ

## หลังพัฒนาเสร็จ
- [ ] Run full test suite
- [ ] Code review (self หรือ peer)
- [ ] Update documentation
- [ ] Update context/skills ถ้าจำเป็น
- [ ] Commit และ push code
- [ ] Deploy to staging/production
- [ ] Verify deployment
- [ ] Update project tracker

## Post-Development
- [ ] Collect lessons learned
- [ ] Update skills จาก experience
- [ ] Share knowledge กับทีม
- [ ] Archive useful prompts
```

### Code Review Checklist

```markdown
## Functionality
- [ ] โค้ดทำงานตาม requirements
- [ ] Edge cases ได้รับการจัดการ
- [ ] Error handling ครบถ้วน
- [ ] Input validation ถูกต้อง

## Code Quality
- [ ] Follow coding standards
- [ ] TypeScript types ครบถ้วน
- [ ] ไม่มี any types
- [ ] Variable/function names สื่อความหมาย
- [ ] มี comments สำหรับ complex logic
- [ ] ไม่มี duplicated code

## Security
- [ ] ไม่มี hardcoded credentials
- [ ] Input sanitization ถูกต้อง
- [ ] Authentication/Authorization checks
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection (ถ้าจำเป็น)

## Performance
- [ ] Database queries optimized
- [ ] ไม่มี N+1 query problems
- [ ] มี proper indexing
- [ ] Async operations ใช้ถูกต้อง
- [ ] ไม่มี memory leaks

## Testing
- [ ] มี test cases
- [ ] Test coverage เพียงพอ
- [ ] Tests pass ทั้งหมด
- [ ] Manual testing ผ่าน

## Documentation
- [ ] API documentation update
- [ ] README update (ถ้าจำเป็น)
- [ ] Inline comments เพียงพอ
- [ ] Context/Skills update (ถ้ามี changes)
```

### Deployment Checklist

```markdown
## Pre-Deployment
- [ ] All tests pass
- [ ] Code review completed
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Backup current production (ถ้าจำเป็น)

## Deployment Steps
- [ ] Merge to main/master branch
- [ ] Tag release version
- [ ] Run database migrations
- [ ] Deploy application
- [ ] Verify deployment successful
- [ ] Check logs for errors

## Post-Deployment
- [ ] Smoke testing
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Notify stakeholders
- [ ] Update deployment log

## Rollback Plan (ถ้าเกิดปัญหา)
- [ ] Revert to previous version
- [ ] Rollback database migrations
- [ ] Verify system stability
- [ ] Post-mortem analysis
```

---

## ภาคผนวก

### Template Files

#### .claude/README.md Template

```markdown
# Claude Code Configuration

## Overview
This directory contains context and skill files for AI-assisted development using Claude Code.

## Structure
- `context/` - Project knowledge and architecture
- `skills/` - Step-by-step guides for common tasks
- `templates/` - Code templates for quick start

## Usage

### Basic Usage
```bash
claude "Load context from .claude/context/ and create [feature]"
```

### With Specific Skill
```bash
claude "Use skills from api-creation.md to build user management API"
```

## Maintenance
- Update context files when architecture changes
- Add new skills from lessons learned
- Review and improve existing documentation regularly

## Team Guidelines
1. Always load relevant context before starting
2. Follow coding standards in context files
3. Test thoroughly before committing
4. Update documentation after changes

## Support
- Technical Lead: [Name]
- Documentation: [Wiki Link]
- Issues: [Issue Tracker Link]
```

#### Prompt Template for Common Tasks

```markdown
# Standard Prompt Template

## API Development
```
Load context from:
- .claude/context/01-architecture.md
- .claude/context/02-tech-stack.md
- .claude/context/05-coding-standards.md

Use skill:
- .claude/skills/api-creation.md

Task: Create API endpoint for [feature]

Requirements:
- Method: [GET/POST/PUT/DELETE]
- Path: /api/v1/[resource]
- Input: [describe input]
- Output: [describe output]
- Validation: [validation rules]
- Authorization: [who can access]

Please follow all coding standards and include:
1. Input validation with Zod
2. Error handling
3. Database operations with Prisma
4. Proper TypeScript types
5. API documentation comments
```

## Database Task
```
Load context from:
- .claude/context/03-database-schema.md

Use skill:
- .claude/skills/database-operations.md

Task: [Add new table / Modify existing table / Create migration]

Requirements:
- Table name: [name]
- Fields: [list fields with types]
- Relations: [describe relationships]
- Indexes: [specify indexes]
- Constraints: [unique, foreign keys, etc.]

Generate:
1. Prisma schema update
2. Migration file
3. Updated types
```

## Frontend Component
```
Load context from:
- .claude/context/02-tech-stack.md
- .claude/context/05-coding-standards.md

Task: Create [component name] component

Requirements:
- Purpose: [what it does]
- Props: [list props with types]
- State: [local state needed]
- Features: [list features]
- Styling: [Tailwind classes]

Include:
1. TypeScript interface for props
2. Proper state management
3. Error handling
4. Loading states
5. Accessibility attributes
```
```

---

## เอกสารอ้างอิง

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zod Documentation](https://zod.dev/)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)

### Internal Resources
- Company Coding Standards: [Link]
- API Design Guidelines: [Link]
- Security Policies: [Link]
- Deployment Procedures: [Link]

---

## บันทึกการแก้ไข

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | [Name] | Initial creation |
| | | | |

---

## การติดต่อและสนับสนุน

**Digital Platform & Integration Team**
- Team Lead: [Name]
- Email: [Email]
- Slack: #digital-platform

**For Questions:**
1. Check this documentation first
2. Ask in #digital-platform channel
3. Create issue in project tracker
4. Schedule 1:1 with team lead

---

**หมายเหตุ:** เอกสารนี้เป็น living document ควร update เมื่อมีการเปลี่ยนแปลงหรือ lessons learned ใหม่ๆ
