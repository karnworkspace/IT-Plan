# Quick Reference - Task Management System (YTY Project)

**Last Updated:** 2026-02-25
**Status:** ✅ Production Ready | Docker Dev Environment

---

## Quick Start

### Docker (แนะนำ)
```bash
docker-compose up -d
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
# Adminer:  http://localhost:8081
```

### Local Dev
```bash
cd backend && npm run dev   # http://localhost:3000
cd frontend && npm run dev  # http://localhost:5173
```

### Test Accounts
- `tharab@sena.co.th` / `123456` (ADMIN)
- `ohm@sena.co.th` / `123456` (MEMBER)
- `karn@sena.co.th` / `123456` (MEMBER)

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18 + Vite + TypeScript + Ant Design 6.x + Zustand |
| Backend | Express 5.x + TypeScript + Prisma 5.10.2 |
| Database | PostgreSQL 16 (Docker, port 5432, DB: `taskflow`) |
| Auth | JWT (access 15min, refresh 7day) + bcrypt |

---

## Project Structure

```
YTY Project/
├── Doc/                          # Documentation
│   ├── PROJECT-PROGRESS.md       ← อ่านก่อน!
│   ├── QUICK-REFERENCE.md        ← ไฟล์นี้
│   └── PROGRESS-ARCHIVE.md       ← Phase 1-11 history
│
├── frontend/src/
│   ├── pages/                    # Page components
│   │   ├── DashboardPage.tsx     # Dashboard + activity feed
│   │   ├── TimelinePage.tsx      # Annual Plan (Projects menu)
│   │   ├── ProjectDetailPage.tsx # Project detail + task board
│   │   ├── MyTasksPage.tsx       # Personal task board
│   │   ├── CalendarPage.tsx      # Calendar view
│   │   ├── ConfigurationPage.tsx # Admin: user management
│   │   └── LoginPage.tsx         # Email/password login
│   ├── components/               # Reusable (Sidebar, TaskDetailModal, etc.)
│   ├── services/                 # API clients (axios)
│   ├── store/                    # Zustand state management
│   ├── types/                    # Centralized TypeScript types
│   ├── constants/                # Status config, colors, icons
│   └── utils/                    # Export Excel/PDF, error handling
│
├── backend/src/
│   ├── services/                 # Business logic (Source of Truth)
│   ├── controllers/              # HTTP handlers
│   ├── routes/                   # API endpoints
│   ├── middlewares/              # Auth, Error, Validation
│   ├── constants/                # Status/Priority/Role enums
│   ├── utils/                    # JWT, bcrypt, AppError, response
│   └── config/                   # Environment, PrismaClient singleton
│
├── docker-compose.yml            # Docker orchestration
├── .env                          # Docker env vars (root)
└── CLOUDFLARE-TUNNEL.md          # External testing guide (gitignored)
```

---

## Database Commands

```bash
cd backend
npx prisma db push        # Sync schema (ใช้แทน migrate)
npx prisma generate       # Generate client
npx prisma studio         # DB GUI (port 5555)
```

> ⚠️ ใช้ `prisma db push` เท่านั้น — migration history มี SQLite artifacts

---

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — สมัครสมาชิก
- `POST /api/v1/auth/login` — Login (email/password)
- `POST /api/v1/auth/refresh` — Refresh token
- `POST /api/v1/auth/logout` — Logout

### Projects
- `GET /api/v1/projects` — รายการ projects
- `GET /api/v1/projects/timeline` — Annual Plan Timeline data
- `GET /api/v1/projects/:id` — Project detail
- `GET /api/v1/projects/:id/stats` — Project statistics
- `POST /api/v1/projects` — สร้าง project
- `PUT /api/v1/projects/:id` — แก้ไข project
- `DELETE /api/v1/projects/:id` — ลบ project

### Tasks
- `GET /api/v1/tasks?projectId=` — Tasks by project
- `POST /api/v1/tasks` — สร้าง task (รองรับ `assigneeIds[]`, `tagIds[]`)
- `PUT /api/v1/tasks/:id` — แก้ไข task
- `DELETE /api/v1/tasks/:id` — ลบ task
- `PATCH /api/v1/tasks/:id/convert-to-subtask` — แปลงเป็น subtask
- `PATCH /api/v1/tasks/:id/convert-to-task` — แปลงเป็น task

### Tags
- `GET /api/v1/tags` — รายการ tags
- `POST /api/v1/tags` — สร้าง tag
- `PUT /api/v1/tags/:id` — แก้ไข tag
- `DELETE /api/v1/tags/:id` — ลบ tag

### Comments
- `GET /api/v1/comments?taskId=` — Comments ของ task
- `POST /api/v1/comments` — เพิ่ม comment (รองรับ reply: `parentCommentId`)
- `DELETE /api/v1/comments/:id` — ลบ comment

### Users (ADMIN)
- `GET /api/v1/users` — รายการ users
- `PUT /api/v1/users/:id/role` — เปลี่ยน role
- `POST /api/v1/users/:id/reset-password` — Reset password

---

## Features Summary

### Core Features
- ✅ Email/Password Login + JWT Auth
- ✅ Dashboard + Activity Feed + Quick Access
- ✅ Projects Kanban (5 statuses, status gradient colors)
- ✅ Task Board (TODO/IN_PROGRESS/IN_REVIEW/DONE/BLOCKED)
- ✅ Task Detail Modal (full CRUD)
- ✅ My Tasks (personal task board)
- ✅ Calendar View
- ✅ Annual Plan Timeline (12-month bars, 5 categories, Q1-Q4)

### Advanced Features
- ✅ Multiple Assignees (many-to-many)
- ✅ Sub-tasks (multi-level, convert task↔subtask)
- ✅ Tag System (CRUD, filter, badges on cards)
- ✅ Chat-style Comments (reply threading, @mention)
- ✅ Image Attachments in Comments
- ✅ Export Excel + PDF
- ✅ ADMIN Configuration (user management, role, reset password)
- ✅ ADMIN bypass (CRUD all projects/tasks)

### UX/UI
- ✅ Desktop Responsive (media queries 768px/1100px/1200px)
- ✅ Sidebar shrink at narrow width
- ✅ Horizontal scroll for boards/tables
- ✅ Cloudflare Quick Tunnel support (external testing)

---

## External Testing (Cloudflare Tunnel)

ดูคู่มือเต็มที่ `CLOUDFLARE-TUNNEL.md` (root project)

```bash
# เปิด tunnel (2 terminals)
cloudflared tunnel --url http://localhost:3001  # Backend
cloudflared tunnel --url http://localhost:5173  # Frontend
# ส่ง URL ให้ Claude แก้ config → rebuild Docker
```

---

## Docker Gotchas
- `frontend_node_modules` / `backend_node_modules` เป็น named volume
- เพิ่ม package ใหม่ต้อง `docker volume rm <volume>` แล้ว rebuild
- Root `.env` ใช้สำหรับ Docker (ไม่ใช่ `backend/.env`)
- `VITE_API_URL` เป็น build-time variable → ต้อง rebuild frontend เมื่อเปลี่ยน
