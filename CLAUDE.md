# CLAUDE.md - YTY Project

---

## ⚠️ CRITICAL: ขั้นตอนบังคับก่อนเริ่มงาน

### 📖 ลำดับการอ่านไฟล์ (ต้องทำทุกครั้ง!)

```
ขั้นตอนที่ 1: อ่านเอกสาร (ตามลำดับ)
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣  Doc/PROJECT-PROGRESS.md    ← อ่านก่อนเสมอ!              │
│     • สถานะโปรเจคปัจจุบัน                                    │
│     • สิ่งที่ทำเสร็จแล้ว / ยังไม่เสร็จ                         │
│     • Bug fixes ล่าสุด                                      │
│     • แนวทางการทำต่อ (Recommended Next Actions)             │
│                                                             │
│ 2️⃣  Doc/QUICK-REFERENCE.md     ← Quick reference            │
│     • Commands ที่ใช้บ่อย                                    │
│     • โครงสร้างไฟล์                                         │
│     • Tech Stack                                            │
│                                                             │
│ 3️⃣  Doc/Quick-Start-Guide.md   ← ถ้าต้อง setup/run          │
│     • วิธีติดตั้ง                                            │
│     • วิธี run development servers                          │
│     • วิธีทดสอบ APIs                                        │
└─────────────────────────────────────────────────────────────┘

ขั้นตอนที่ 2: ตรวจสอบ Code (ถ้าจำเป็น)
┌─────────────────────────────────────────────────────────────┐
│ • backend/src/     ← Backend code                           │
│ • frontend/src/    ← Frontend code                          │
│ • backend/prisma/schema.prisma  ← Database schema           │
└─────────────────────────────────────────────────────────────┘
```

**⛔ ห้ามเริ่มงานก่อนอ่าน PROJECT-PROGRESS.md**

---

## 📝 การบันทึกความคืบหน้า (เมื่อผู้ใช้สั่ง)

เมื่อผู้ใช้สั่ง "บันทึกความคืบหน้า" หรือ "update progress" ต้องอัปเดตไฟล์เหล่านี้:

```
ลำดับการอัปเดต:
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣  Doc/PROJECT-PROGRESS.md    ← อัปเดตเสมอ! (หลัก)         │
│     • เพิ่ม/แก้ไขสถานะ tasks                                 │
│     • เพิ่ม bug fixes ที่ทำ                                  │
│     • อัปเดต completion percentage                          │
│     • อัปเดต Last Updated timestamp                         │
│                                                             │
│ 2️⃣  Doc/QUICK-REFERENCE.md     ← อัปเดตถ้าเกี่ยวข้อง        │
│     • สถานะ features                                        │
│     • commands ใหม่                                         │
│                                                             │
│ 3️⃣  Doc/Quick-Start-Guide.md   ← อัปเดตถ้าเกี่ยวข้อง        │
│     • วิธี setup ที่เปลี่ยน                                   │
│     • dependencies ใหม่                                      │
│                                                             │
│ 4️⃣  CLAUDE.md (ไฟล์นี้)         ← อัปเดตถ้าจำเป็น           │
│     • สถานะโปรเจคใน table                                   │
│     • workflow ที่เปลี่ยน                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## รูปแบบการสนทนา

### ภาษาหลัก: ไทย
- ใช้ภาษาไทยที่กระชับ ตรงประเด็น
- หลีกเลี่ยงคำฟุ่มเฟือย
- ศัพท์เทคนิคใช้ภาษาอังกฤษได้ตามความเหมาะสม
- ตอบสั้น ๆ ก่อน ขยายรายละเอียดเมื่อจำเป็น

### รูปแบบการตอบ
```
[สรุปสิ่งที่ทำ 1-2 ประโยค]
[รายละเอียดเพิ่มเติมถ้าจำเป็น]
[ขั้นตอนถัดไป (ถ้ามี)]
```

---

## สถานะโปรเจคปัจจุบัน (Last Updated: 2026-01-27)

| Component | Status | Progress |
|-----------|--------|----------|
| Frontend | ✅ Complete | 100% |
| Backend | ✅ Complete | 100% |
| API Testing | ✅ Passed | 100% |
| Integration | ✅ Complete | 100% |
| **Deployment (UAT)** | **✅ Live** | **100%** |
| **Overall** | **✅ Production Ready** | **100%** |

### 🌐 Live URLs (UAT)
- **Frontend:** https://frontend-beta-seven-60.vercel.app
- **Backend API:** https://backend-five-iota-42.vercel.app
- **Database:** Vercel Postgres (Neon) - `taskflow-db`

### 📊 Production Data
- **Users:** 77 (รวม SENA staff + test accounts)
- **Projects:** 25 projects
- **Tasks:** 68 tasks  
- **Members:** 38 project members

**ดูรายละเอียดเพิ่มเติม:** `Doc/PROJECT-PROGRESS.md`

---

## โครงสร้างโปรเจค (Project Structure)

### โครงสร้างหลัก

```
YTY Project/
├── 📄 CLAUDE.md                    # คู่มือสำหรับ AI/Developer
├── 📁 Doc/                         # เอกสารทั้งหมด
│   ├── PROJECT-PROGRESS.md         # ⭐ สถานะโปรเจค (อ่านก่อนเสมอ!)
│   ├── QUICK-REFERENCE.md          # 📋 Quick reference
│   ├── Quick-Start-Guide.md        # 🚀 Setup guide
│   ├── API-Specification.md        # API endpoints
│   ├── Task-Management-System-Design.md  # System design
│   ├── Development-Workflow.md     # Git workflow
│   ├── TESTING-GUIDE.md            # Testing guide
│   └── Static-PIN-Login-Guide.md   # PIN auth guide
│
├── 📁 Design/                      # UI/UX
│   └── UI-Mockups/                 # Mockups ล่าสุด (7 ไฟล์)
│       ├── 01-dashboard-v2.png
│       ├── 02-login-page-pin.png
│       ├── 03-task-detail.png
│       └── ...
│
├── 📁 backend/                     # 🚀 Express API (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   ├── services/               # Business logic (Source of Truth)
│   │   ├── routes/                 # API routes
│   │   ├── middlewares/            # Auth, Error handling, Rate limit
│   │   ├── utils/                  # Helper functions (JWT, bcrypt)
│   │   ├── config/                 # Environment, Database config
│   │   └── index.ts                # Entry point
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/             # DB migrations
│   ├── scripts/                    # Data import/export scripts
│   │   ├── export-data.js
│   │   ├── import-data.ts
│   │   └── import-users.ts
│   ├── .env.production             # Production env vars
│   ├── vercel.json                 # Vercel deployment config
│   └── package.json
│
├── 📁 frontend/                    # ⚛️ React App (TypeScript + Vite)
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── PinInput.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   ├── pages/                  # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TaskDetailPage.tsx
│   │   │   └── ...
│   │   ├── services/               # API clients
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── ...
│   │   ├── store/                  # Zustand state management
│   │   │   └── authStore.ts
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Helper functions
│   │   ├── layouts/                # Layout components
│   │   ├── types/                  # TypeScript types
│   │   └── App.tsx                 # Main app + Router
│   ├── public/                     # Static assets
│   ├── .env.production             # Production env vars
│   ├── vercel.json                 # Vercel deployment config
│   └── package.json
│
├── 📁 tests/                       # Test suites (Jest + Playwright)
│   ├── api/                        # API tests (51 tests ✅)
│   │   ├── auth.test.ts
│   │   ├── projects.test.ts
│   │   ├── tasks.test.ts
│   │   ├── notifications.test.ts
│   │   └── updates-comments.test.ts
│   ├── e2e/                        # E2E tests (14 tests ✅)
│   │   ├── auth.spec.ts
│   │   └── tasks.spec.ts
│   ├── setup/                      # Test setup
│   └── package.json
│
├── 📁 .claude/                     # 🤖 Claude context files
│   ├── context/                    # Context documents
│   │   ├── 01-architecture.md
│   │   ├── 02-tech-stack.md
│   │   ├── 03-database-schema.md
│   │   └── 05-coding-standards.md
│   ├── skills/                     # Custom skills
│   └── templates/                  # Templates
│
└── 📁 archive/                     # 🗃️ ไฟล์เก่า (ไม่แตะ!)
    ├── old-docs/                   # เอกสารเก่า (4 ไฟล์)
    ├── old-data/                   # CSV, Excel, JSON เก่า (9 ไฟล์)
    └── old-designs/                # UI mockups เก่า (2 ไฟล์)
```

### Key Directories

| Folder | Purpose | Notes |
|--------|---------|-------|
| `Doc/` | เอกสารทั้งหมด | อ่าน PROJECT-PROGRESS.md ก่อนเสมอ |
| `backend/src/services/` | Business logic | Source of Truth |
| `frontend/src/pages/` | UI Pages | Presentation layer |
| `tests/` | Test suites | 65/65 tests ✅ |
| `archive/` | ไฟล์เก่า | **ห้ามแก้ไข/commit** |

---

## Quick Start

### รัน Backend
```bash
cd backend
npm install
npm run dev
# http://localhost:3000
```

### รัน Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### ทดสอบ API
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Workflow การพัฒนา (Development Workflow)

### 🔄 Complete Development Cycle

```
1. Preparation → 2. Development → 3. Testing → 4. Documentation → 5. Commit → 6. Deploy
```

---

### **ขั้นตอนที่ 1: เตรียมงาน (Preparation)**

```bash
# 1.1 อ่านเอกสารก่อนเริ่มงาน (บังคับ!)
📖 Doc/PROJECT-PROGRESS.md      # สถานะปัจจุบัน
📖 Doc/QUICK-REFERENCE.md       # Quick ref
📖 Doc/API-Specification.md     # ถ้าทำ API

# 1.2 ตรวจสอบ Git status
git status
git pull origin main

# 1.3 สร้าง branch ใหม่ (ถ้าเป็นงานใหญ่)
git checkout -b feature/new-feature-name
```

---

### **ขั้นตอนที่ 2: พัฒนา Code (Development)**

#### **Backend Development**

```bash
cd backend

# เพิ่ม/แก้ไข files ตามลำดับ:
1. prisma/schema.prisma          # ถ้าต้องแก้ database
2. src/services/*.service.ts     # Business logic (เขียนก่อน!)
3. src/controllers/*.controller.ts  # Request handlers
4. src/routes/*.routes.ts        # API routes
5. src/index.ts                  # Register routes

# Run migrations (ถ้าแก้ schema)
npx prisma migrate dev --name describe_change
npx prisma generate

# Test API
npm run dev
# Test ด้วย curl/Postman
```

**Example: เพิ่ม Comment Feature**
```bash
# 1. Business logic
vim src/services/comment.service.ts
# - createComment(), getCommentsByTask(), updateComment(), deleteComment()

# 2. Controller
vim src/controllers/comment.controller.ts
# - handleCreate(), handleGetByTask(), handleUpdate(), handleDelete()

# 3. Routes
vim src/routes/comment.routes.ts
# - POST /comments, GET /comments/task/:taskId, PUT /comments/:id, DELETE /comments/:id

# 4. Register routes
vim src/index.ts
# - app.use('/api/v1/comments', commentRoutes)
```

#### **Frontend Development**

```bash
cd frontend

# เพิ่ม/แก้ไข files ตามลำดับ:
1. src/services/*.service.ts     # API client (เขียนก่อน!)
2. src/store/*.ts                # State management (ถ้าต้องการ)
3. src/components/*.tsx          # Reusable components
4. src/pages/*.tsx               # Pages

# Run dev server
npm run dev
# Test ที่ http://localhost:5173
```

**Example: เพิ่ม CommentList Component**
```bash
# 1. API service
vim src/services/comment.service.ts
# - getCommentsByTask(), createComment(), updateComment(), deleteComment()

# 2. Component
vim src/components/CommentList.tsx
# - Display comments, Add comment form

# 3. Integrate to page
vim src/pages/TaskDetailPage.tsx
# - Import CommentList, Pass taskId prop
```

---

### **ขั้นตอนที่ 3: Testing**

```bash
# 3.1 Manual Testing
# - Test functionality ใน browser/API
# - ตรวจสอบ error handling
# - ทดสอบ edge cases

# 3.2 Automated Testing (ถ้ามี)
cd tests
npm test                         # Run all tests
npm run test:api                 # API tests only
npm run test:e2e                 # E2E tests only
```

---

### **ขั้นตอนที่ 4: Documentation (สำคัญมาก!)**

```bash
# 4.1 อัปเดตเอกสาร (ทุกครั้ง!)
✏️ Doc/PROJECT-PROGRESS.md      # อัปเดตสถานะ (บังคับ!)
   - เพิ่ม task ที่ทำเสร็จ
   - อัปเดต completion %
   - เพิ่ม bug fixes (ถ้ามี)
   - อัปเดต Last Updated

✏️ Doc/QUICK-REFERENCE.md       # ถ้าเพิ่ม features/commands
✏️ Doc/API-Specification.md     # ถ้าเพิ่ม/แก้ API
✏️ CLAUDE.md                    # ถ้าเปลี่ยน workflow หลัก
```

---

### **ขั้นตอนที่ 5: Git Commit**

```bash
# 5.1 Review changes
git status
git diff

# 5.2 Stage files (เลือกไฟล์ที่เกี่ยวข้อง)
git add backend/src/services/comment.service.ts
git add backend/src/controllers/comment.controller.ts
git add frontend/src/components/CommentList.tsx
git add Doc/PROJECT-PROGRESS.md
# หรือ git add . (ระวังไฟล์ sensitive!)

# 5.3 Commit (ใช้ format ที่กำหนด)
git commit -m "feat(comments): เพิ่ม Task Comment feature

- Backend: Comment CRUD APIs
- Frontend: CommentList component
- อัปเดต PROJECT-PROGRESS.md

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

Types:
- feat: feature ใหม่
- fix: แก้ bug
- docs: แก้เอกสาร
- refactor: ปรับโครงสร้าง
- test: เพิ่ม tests
- chore: งานทั่วไป
```

---

### **ขั้นตอนที่ 6: Push & Deploy**

```bash
# 6.1 Push to remote
git push origin main
# หรือ git push origin feature/branch-name

# 6.2 Auto Deploy (ถ้า push to main)
# Vercel จะ auto deploy:
# - Frontend: https://frontend-beta-seven-60.vercel.app
# - Backend: https://backend-five-iota-42.vercel.app

# 6.3 ตรวจสอบ deployment
# - เช็คที่ Vercel dashboard
# - ทดสอบ production URLs
```

---

### **📋 Development Checklist**

#### ✅ ก่อนเริ่มงาน
- [ ] อ่าน `Doc/PROJECT-PROGRESS.md`
- [ ] `git pull origin main`
- [ ] เข้าใจ requirements ชัดเจน

#### ✅ ระหว่างพัฒนา
- [ ] เขียน business logic ก่อน (services)
- [ ] เขียน controller/routes
- [ ] Test API/UI manually
- [ ] Handle errors ครบถ้วน

#### ✅ ก่อน Commit
- [ ] โค้ดทำงานถูกต้อง
- [ ] Tests ผ่าน (ถ้ามี)
- [ ] ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี sensitive data
- [ ] **อัปเดต Doc/PROJECT-PROGRESS.md**

#### ✅ หลัง Deploy
- [ ] ตรวจสอบ production URLs
- [ ] ทดสอบ features บน production
- [ ] Monitor logs (ถ้ามี errors)

---

## Development Context & AI Agent Principles (สำคัญมาก)

### 1. Developer Persona
- **Role:** Expert Full Stack Developer & Teacher.
- **Tone:** Professional, Concise, Helpful, Proactive but Careful.
- **Language:** **Thai (ไทย)** as primary language. Use English for technical terms.

### 2. Development Philosophy
1.  **Data Integrity First:** Always verify database state (Roles, IDs, Relationships) before implementing UI. Use scripts (`scripts/*.ts`) to check/fix data.
2.  **Role-Based Access Control (RBAC):** This system relies heavily on Roles (ADMIN vs MEMBER) and User IDs. Always check permissions logic (`getMyTasks`, `ProjectMember`).
3.  **User-Centric Design:** Aesthetic matters. UI must be "Premium", "Dynamic", and "Responsive". Use `Ant Design` correctly.
4.  **Verification:** Never assume typical behavior. Always "Verify" logic with scripts or Logs.

### 3. Protocol for Code Changes
- **Ask Before Action:** Always explain what significant changes you plan to do and ask for confirmation (unless it's a minor fix requested explicitly).
- **Scripts over Manual Check:** When verifying DB data, write a `ts-node script` instead of asking user to check DB manually.
- **Update Documentation:** Always update `Doc/PROJECT-PROGRESS.md` after completing a Phase.

### 4. Contextual Awareness Strategy
- **File Hierarchy:**
  - `Doc/` contains the Truth.
  - `backend/src/services` logic is the Source of Truth for Business Logic.
  - `frontend/src/` is the presentation layer.
- **Active Memory:** Keep track of "Active User" IDs (e.g., CHIAN, OHM, KARN) and their roles as they are critical to current testing context.

---

## Coding Standards

### Naming Conventions
| ประเภท | รูปแบบ | ตัวอย่าง |
|--------|--------|----------|
| Files/Components | PascalCase | `UserProfile.tsx` |
| Functions/Variables | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE` |
| APIs | kebab-case | `user-profile.ts` |

### TypeScript
- ใช้ strict mode
- กำหนด types ชัดเจน
- หลีกเลี่ยง `any`
- Unused params ใช้ `_` prefix (เช่น `_req`, `_next`)

### API Response Format
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: 'message', details?: [...] }
```

---

## Git Conventions

### Commit Messages
```
<type>(<scope>): <subject>

Types:
- feat: feature ใหม่
- fix: แก้ bug
- docs: แก้ docs
- refactor: ปรับโครงสร้าง
- test: เพิ่ม tests
- chore: งานทั่วไป
```

### ตัวอย่าง
```
feat(auth): เพิ่มระบบ login
fix(api): แก้ปัญหา timeout
docs(readme): อัปเดตวิธีติดตั้ง
```

---

## Quick Commands

### Development
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Database
```bash
cd backend
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate client
npx prisma studio         # Open DB GUI
```

### Git
```bash
git status
git add .
git commit -m "feat(scope): message"
git push
```

---

## Best Practices

### Do's
- ✅ อ่าน PROJECT-PROGRESS.md ก่อนเริ่มงาน
- ✅ Validate input ทุกครั้ง
- ✅ ใช้ environment variables
- ✅ Handle errors ครบ
- ✅ Update docs หลังทำงานเสร็จ

### Don'ts
- ❌ เริ่มงานโดยไม่อ่าน progress
- ❌ Hardcode credentials
- ❌ Skip testing
- ❌ Commit sensitive data

---

## Security

### ห้ามใส่ใน repository
- API keys, tokens
- Passwords
- Connection strings ที่มี credentials
- Private keys

### Environment Variables
```bash
# .env.example (commit ได้)
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=your-secret-here

# .env (ห้าม commit)
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=actual-secret-key
```

---

## การขอความช่วยเหลือ

เมื่อต้องการให้ Claude ช่วย:

### งานที่ชัดเจน
```
สร้าง API endpoint สำหรับ user management
- GET /users - list
- POST /users - create
- PUT /users/:id - update
```

### งานที่ต้อง explore
```
ช่วยวิเคราะห์โครงสร้าง codebase นี้
แนะนำวิธีปรับปรุง performance
```

### งานแก้ bug
```
พบปัญหา: [อธิบายปัญหา]
Error: [error message]
ไฟล์ที่เกี่ยวข้อง: [ชื่อไฟล์]
```

---

## Checklists

### ✅ ก่อนเริ่มงาน (บังคับ!)
- [ ] 1️⃣ อ่าน `Doc/PROJECT-PROGRESS.md`
- [ ] 2️⃣ อ่าน `Doc/QUICK-REFERENCE.md`
- [ ] 3️⃣ อ่าน `Doc/Quick-Start-Guide.md` (ถ้าต้อง setup)
- [ ] เข้าใจสถานะปัจจุบัน
- [ ] รู้ว่าต้องทำอะไรต่อ

### ✅ ก่อน Commit
- [ ] โค้ดทำงานถูกต้อง
- [ ] Tests ผ่าน
- [ ] ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี sensitive data

### ✅ เมื่อบันทึกความคืบหน้า (ตามลำดับ)
- [ ] 1️⃣ อัปเดต `Doc/PROJECT-PROGRESS.md` (บังคับ)
- [ ] 2️⃣ อัปเดต `Doc/QUICK-REFERENCE.md` (ถ้าเกี่ยวข้อง)
- [ ] 3️⃣ อัปเดต `Doc/Quick-Start-Guide.md` (ถ้าเกี่ยวข้อง)
- [ ] 4️⃣ อัปเดต `CLAUDE.md` (ถ้าจำเป็น)

---

---

**Note:** ไฟล์นี้เป็น living document - อัปเดตเมื่อมีการเปลี่ยนแปลง
**Last Updated:** 2026-02-02 (เพิ่ม: Project Structure รายละเอียด + Complete Development Workflow)
