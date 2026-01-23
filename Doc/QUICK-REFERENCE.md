# Quick Reference - Task Management System

**สำหรับ AI Agent ที่มาทำงานต่อ**

---

## 🚀 Quick Start (ใน 5 นาที)

### 1. อ่านเอกสารหลัก
```
Doc/PROJECT-PROGRESS.md  ← เริ่มที่นี่!
```

### 2. เข้าใจสถานะปัจจุบัน
- ✅ Frontend: **เสร็จสมบูรณ์ 100%**
- ✅ Backend: **เสร็จสมบูรณ์ 100%** (Auth APIs)
- ⏳ Integration: **ยังไม่เริ่ม 0%**

### 3. รัน Project

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

**Backend:**
```bash
cd backend
npm install
npm run dev
# http://localhost:3000
```

### 4. ทดสอบ API
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}'
```

---

## 📁 โครงสร้างโปรเจค

```
YTY Project/
├── Doc/                    # 📄 เอกสารทั้งหมด
│   ├── PROJECT-PROGRESS.md          ⭐ อ่านก่อน!
│   ├── QUICK-REFERENCE.md           📋 เอกสารนี้
│   ├── Task-Management-System-Design.md
│   ├── API-Specification.md
│   ├── Development-Workflow.md
│   ├── Quick-Start-Guide.md
│   └── Static-PIN-Login-Guide.md
│
├── Design/                 # 🎨 UI Mockups
│   ├── UI-Mockups/
│   │   ├── 01-dashboard-v2.png
│   │   ├── 02-login-page-pin.png
│   │   ├── 03-task-detail.png
│   │   ├── 04-project-list.png
│   │   ├── 05-analytics-dashboard.png
│   │   └── 06-setup-pin.png
│   └── README.md
│
├── frontend/               # ⚛️ React App (เสร็จแล้ว)
│   ├── src/
│   │   ├── components/    # PinInput, ProtectedRoute
│   │   ├── pages/         # Login, Dashboard, SetupPin
│   │   ├── services/      # API client, Auth service
│   │   ├── store/         # Zustand auth store
│   │   └── App.tsx        # Router
│   └── package.json
│
└── backend/                # 🚀 Express API (เสร็จแล้ว)
    ├── src/
    │   ├── config/        # Environment, Database
    │   ├── controllers/   # Auth handlers
    │   ├── services/      # Business logic
    │   ├── routes/        # API endpoints
    │   ├── middlewares/   # Auth, Error, RateLimit
    │   ├── utils/         # JWT, bcrypt helpers
    │   └── index.ts       # Entry point
    ├── prisma/
    │   ├── schema.prisma  # Database schema
    │   └── migrations/    # DB migrations
    └── package.json
```

---

## 🎯 ทำอะไรต่อ?

### Option 1: Test Integration (แนะนำ)
```bash
# 1. รัน Backend
cd backend && npm run dev

# 2. รัน Frontend (terminal ใหม่)
cd frontend && npm run dev

# 3. ทดสอบ login flow
# - ไปที่ http://localhost:5173/login
# - Register user ผ่าน API ก่อน
# - ทดสอบ login
```

### Option 2: เพิ่ม Backend APIs
```bash
# สร้าง CRUD APIs สำหรับ:
# - Projects (backend/src/controllers/project.controller.ts)
# - Tasks (backend/src/controllers/task.controller.ts)

# อ่าน API Spec:
# Doc/API-Specification.md
```

### Option 3: เพิ่มหน้า Frontend
```bash
# สร้างหน้าใหม่ใน frontend/src/pages/
# - ProjectsListPage.tsx
# - TaskDetailPage.tsx
# - AnalyticsPage.tsx
```

---

## 📖 เอกสารสำคัญ

| ไฟล์ | จุดประสงค์ |
|------|-----------
| `PROJECT-PROGRESS.md` | ⭐ สถานะโปรเจค + แนวทางทำต่อ |
| `Task-Management-System-Design.md` | System architecture + Database |
| `API-Specification.md` | API endpoints ทั้งหมด |
| `Static-PIN-Login-Guide.md` | วิธีทำ PIN authentication |
| `Development-Workflow.md` | Git workflow + Standards |

---

## 💻 Tech Stack

**Frontend (เสร็จแล้ว):**
- Vite + React + TypeScript
- Ant Design 6.x
- Zustand + React Router + Axios

**Backend (เสร็จแล้ว):**
- Node.js + Express 5.x + TypeScript
- Prisma 5.10.2 + SQLite (dev)
- JWT + bcrypt

---

## ✅ Features ที่มี

### Frontend
- ✅ Login (Email + PIN)
- ✅ Setup PIN
- ✅ Dashboard
- ✅ Project Selector
- ✅ Task Board
- ✅ Protected Routes
- ✅ Auth State Management

### Backend
- ✅ User Registration
- ✅ Email/Password Login
- ✅ PIN Login
- ✅ PIN Setup/Change/Reset
- ✅ JWT Token Refresh
- ✅ Logout
- ✅ Health Check

---

## ❌ Features ที่ยังไม่มี

- ✅ Frontend-Backend Integration (เสร็จแล้ว)
- ✅ Project CRUD APIs (เสร็จแล้ว - 2026-01-22)
- ⏳ Task CRUD APIs
- ⏳ Projects List (เชื่อมกับ real API)
- ⏳ Task Detail (full)
- ⏳ Analytics (full)
- ⏳ Notifications
- ⏳ File upload

---

## 🔑 Key Files

**Backend:**
- `backend/src/index.ts` - Express entry point
- `backend/src/services/auth.service.ts` - Auth logic
- `backend/src/services/project.service.ts` - Project CRUD logic (เพิ่ม)
- `backend/src/controllers/project.controller.ts` - Project handlers (เพิ่ม)
- `backend/prisma/schema.prisma` - DB schema

**Frontend:**
- `frontend/src/App.tsx` - Router
- `frontend/src/store/authStore.ts` - Auth state
- `frontend/src/pages/DashboardPage.tsx` - Main page

**Docs:**
- `Doc/PROJECT-PROGRESS.md` - อ่านก่อน!

---

## 🛠️ Database Commands

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev

# Open Database GUI
npx prisma studio

# Reset Database
npx prisma migrate reset
```

---

## 🔧 Bug Fixes ล่าสุด (2026-01-22)

| ปัญหา | การแก้ไข |
|-------|----------|
| SQLite ไม่รองรับ Enum/Json | เปลี่ยนเป็น String |
| TypeScript unused params | เพิ่ม `_` prefix |
| JWT SignOptions type | Cast type ให้ถูกต้อง |

---

## 🧪 Project CRUD APIs (2026-01-22) ✅

**Endpoints:**
- `GET /api/v1/projects` - ดึงรายการ projects
- `GET /api/v1/projects/:id` - ดึง project ตาม ID
- `GET /api/v1/projects/:id/stats` - ดึงสถิติ project
- `POST /api/v1/projects` - สร้าง project ใหม่
- `PUT /api/v1/projects/:id` - อัปเดต project
- `DELETE /api/v1/projects/:id` - ลบ project

**ไฟล์ที่สร้าง:**
- `backend/src/services/project.service.ts`
- `backend/src/controllers/project.controller.ts`
- `backend/src/routes/project.routes.ts`

**ทดสอบ:**
```bash
# Login และดึง token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"endtoend@test.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# สร้าง project
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"My Project","color":"#1890ff"}'

# ดึงรายการ projects
curl -X GET "http://localhost:3000/api/v1/projects" \
  -H "Authorization: Bearer $TOKEN"
```

## 🆘 Help

**ติดปัญหา?**
1. อ่าน `Doc/PROJECT-PROGRESS.md`
2. ดู `Doc/Task-Management-System-Design.md`
3. เช็ค code ใน `backend/src/` หรือ `frontend/src/`

**ต้องการทำต่อ?**
1. Task CRUD APIs (ถัดไป - อ่าน PROJECT-PROGRESS.md)
2. Frontend Integration (เชื่อม Dashboard กับ real APIs)
3. ทำตาม checklist ใน `PROJECT-PROGRESS.md`

---

**Last Updated:** 2026-01-22 16:00
**Status:** Project APIs Complete, Ready for Task APIs Development
