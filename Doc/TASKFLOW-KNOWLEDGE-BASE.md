# TaskFlow Knowledge Base — Complete Project Reference
### สำหรับ AI Agent (Codex / Claude Code) ทำความเข้าใจ project ทั้งหมด
### Last Updated: 2026-05-06

---

## 1. Project Overview

| รายการ | รายละเอียด |
|-------|-----------|
| **ชื่อระบบ** | IT Project System (TaskFlow) |
| **วัตถุประสงค์** | ระบบบริหารจัดการ Project และ Task ภายในฝ่าย IT ของบริษัท SENA Development |
| **ผู้ใช้งาน** | ทีม IT ภายในบริษัท (~29 คน: 2 Admin, 6 Manager, 21 Member) |
| **สถานะ** | Production — Deploy บน Internal Server + กำลัง UAT รอบ 2 |
| **Production URL** | `http://172.22.22.11:4200/taskflow/` |
| **Repository** | Local Git on main branch |
| **เริ่มพัฒนา** | ประมาณ ม.ค. 2026 |
| **Phase ปัจจุบัน** | Phase 21 (กำลังเข้า Phase 22 — UAT Feedback Fix) |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + Vite + TypeScript | React 19.2, Vite 6.x |
| **UI Library** | Ant Design | 6.2.1 |
| **State Management** | Zustand | 5.0.10 |
| **Drag & Drop** | @dnd-kit/core + @hello-pangea/dnd | 6.3.1 / 18.0.1 |
| **Routing** | React Router DOM | 7.12.0 |
| **HTTP Client** | Axios | 1.13.2 |
| **Export** | xlsx + jspdf + jspdf-autotable + html2canvas | — |
| **Backend** | Express + TypeScript | Express 5.2.1 |
| **ORM** | Prisma Client | 5.10.2 |
| **Database** | PostgreSQL | 16 (Docker Alpine) |
| **Auth** | JWT (jsonwebtoken) + bcrypt | — |
| **File Upload** | Multer | 2.0.2 |
| **Scheduler** | node-cron | 4.2.1 |
| **Rate Limiting** | express-rate-limit | 8.2.1 |
| **Containerization** | Docker + Docker Compose | — |
| **Reverse Proxy (Prod)** | Nginx | 1.24.0 |

---

## 3. Architecture

### 3.1 Project Structure

```
YTY Project/
├── Doc/                              # Documentation
│   ├── PROJECT-PROGRESS.md           # สถานะปัจจุบัน (Phase 12-21)
│   ├── PROGRESS-ARCHIVE.md           # Phase 1-11 history
│   ├── CODE-SCHEMA.md                # Complete codebase map
│   ├── QUICK-REFERENCE.md            # Quick ref & commands
│   ├── UAT-FEEDBACK-29APR2026.md     # UAT feedback 71 issues
│   └── TASKFLOW-KNOWLEDGE-BASE.md    # ไฟล์นี้
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── pages/                    # Page components (แยก subdirectory ตาม feature)
│   │   │   ├── auth/                 # Login, Register, ForgotPassword, SetupPin
│   │   │   ├── dashboard/            # DashboardPage
│   │   │   ├── project/              # ProjectsPage, MyProjectsPage, InternalProjectsPage, ProjectDetailPage
│   │   │   ├── task/                 # MyTasksPage, CalendarPage, TimelinePage, TagTasksPage, TaskDetailModal
│   │   │   └── admin/               # ConfigurationPage, UserListPage, GroupsPage
│   │   ├── components/               # Reusable components
│   │   │   ├── layout/              # Sidebar, ProtectedRoute
│   │   │   ├── notification/        # NotificationPopover
│   │   │   ├── auth/                # PinInput
│   │   │   ├── task/                # SubTaskList
│   │   │   └── project/             # GanttChart
│   │   ├── services/                 # API clients (Axios)
│   │   ├── store/                    # Zustand state (authStore)
│   │   ├── types/                    # Centralized TypeScript types
│   │   ├── constants/                # Status/Priority config, colors
│   │   ├── hooks/                    # useCountUp
│   │   ├── utils/                    # Export Excel/PDF, error handling, kanban collision
│   │   └── styles/                   # Shared CSS
│   ├── Dockerfile                    # Multi-stage: development + production (Nginx)
│   └── package.json
│
├── backend/                          # Express Backend
│   ├── src/
│   │   ├── services/                 # Business logic (Source of Truth) — 11 files
│   │   ├── controllers/              # HTTP handlers
│   │   ├── routes/                   # API endpoint definitions
│   │   ├── middlewares/              # Auth, Error, Validation, RateLimiter
│   │   ├── constants/                # Enum types + validation helpers
│   │   ├── utils/                    # JWT, bcrypt, AppError, response helpers
│   │   ├── config/                   # ENV config, PrismaClient singleton
│   │   ├── jobs/                     # Cron jobs (due date reminder)
│   │   └── types/                    # Backend-specific types
│   ├── prisma/
│   │   └── schema.prisma             # Database schema (441 lines, 16 models)
│   ├── uploads/                      # File upload storage
│   ├── scripts/                      # Seed scripts, ETL scripts
│   ├── Dockerfile                    # Multi-stage: development + production
│   └── package.json
│
├── PIC/                              # รูปภาพ assets
│   └── SenaDlogo.png                 # SENA Development logo
│
├── docker-compose.yml                # Dev: 3 containers (db, backend, frontend)
├── docker-compose.prod.yml           # Prod: 3 containers with build
├── .env                              # Docker environment variables
├── CLAUDE.md                         # AI agent instructions
└── CLOUDFLARE-TUNNEL.md              # External testing guide
```

### 3.2 Backend Architecture Pattern

```
Request → Route → Middleware (Auth + Validation) → Controller → Service → Prisma → PostgreSQL
                                                                    ↓
                                                              Response ← { success, data/error }
```

**Development Order (สร้าง feature ใหม่):**
```
Backend:  schema.prisma → services/ → controllers/ → routes/
Frontend: services/ → types/ → components/ → pages/
```

### 3.3 Service Layer (Source of Truth)

| Service File | หน้าที่ | Models ที่ใช้ |
|-------------|---------|-------------|
| `auth.service.ts` | Login, Register, JWT, PIN, Password reset | User, RefreshToken |
| `project.service.ts` | Project CRUD, Members, Stats, Timeline, Reorder | Project, ProjectMember, Task, User |
| `task.service.ts` | Task CRUD, Status, Subtasks, Assignees, Tags, Convert | Task, TaskAssignee, TaskTag |
| `comment.service.ts` | Comment CRUD, Reply threading | Comment, Task |
| `dailyUpdate.service.ts` | Daily Update CRUD | DailyUpdate, Task |
| `notification.service.ts` | Notification CRUD, Read/Unread | Notification |
| `activityLog.service.ts` | Activity log queries | ActivityLog |
| `tag.service.ts` | Tag CRUD | Tag |
| `attachment.service.ts` | File upload/download | Attachment |
| `user.service.ts` | User management (Admin) | User |
| `group.service.ts` | Group CRUD, Members, Projects | Group, GroupMember, GroupProject |

---

## 4. Database Schema

### 4.1 Entity Relationship

```
User (29 users)
 ├── ProjectMember (N:M with Project)
 ├── TaskAssignee (N:M with Task)
 ├── Task (creator, assignee)
 ├── Comment (with reply threading + Attachments)
 ├── Notification
 ├── ActivityLog
 ├── StatusChangeLog
 ├── GroupMember (N:M with Group)
 └── RefreshToken

Project
 ├── ProjectMember → User
 ├── Task (1:N)
 ├── GroupProject → Group
 └── ActivityLog

Task
 ├── SubTasks (self-referential 1:N via parentTaskId)
 ├── TaskAssignee → User (N:M)
 ├── TaskTag → Tag (N:M)
 ├── Comment (1:N) → Attachment (1:N)
 ├── DailyUpdate (1:N)
 ├── StatusChangeLog (1:N)
 └── ActivityLog
```

### 4.2 Models (16 models)

| Model | Key Fields | หมายเหตุ |
|-------|------------|---------|
| **User** | email, password, name, role, pinHash?, loginAttempts, lockedUntil? | role: ADMIN/MANAGER/MEMBER |
| **RefreshToken** | token, userId, expiresAt | JWT refresh tokens |
| **Project** | name, status, projectType, projectCode?, category?, timeline(JSON), sortOrder, ownerId | projectType: PROJECT/INTERNAL |
| **ProjectMember** | projectId, userId, role | unique: projectId+userId |
| **Task** | title, status, priority, projectId, assigneeId?, createdById, parentTaskId?, dueDate?, startDate?, progress, sortOrder | parentTaskId = self-ref subtasks |
| **TaskAssignee** | taskId, userId | multi-assignee N:M |
| **Tag** | name (unique), color | — |
| **TaskTag** | taskId, tagId | N:M join |
| **DailyUpdate** | taskId, date, progress, status, notes? | — |
| **Comment** | taskId, userId, content, parentCommentId? | threaded replies |
| **Attachment** | commentId, filename, path, mimetype, size | files in comments |
| **Notification** | userId, type, title, message, isRead, projectId?, taskId? | 7 types |
| **ActivityLog** | userId, action, entityType, entityId, metadata?, projectId?, taskId? | 6 action types |
| **StatusChangeLog** | taskId, userId, fromStatus, toStatus, note (mandatory) | บังคับใส่ comment เมื่อเปลี่ยน status |
| **Group** | name, type, color | USER_GROUP/PROJECT_GROUP |
| **GroupMember / GroupProject** | groupId + userId/projectId | N:M joins |

### 4.3 Enum Values

| Type | Values |
|------|--------|
| **UserRole** | `ADMIN`, `MANAGER`, `MEMBER` |
| **ProjectType** | `PROJECT`, `INTERNAL` |
| **ProjectStatus** | `ACTIVE`, `DELAY`, `COMPLETED`, `HOLD`, `CANCELLED`, `POSTPONE`, `ARCHIVED` |
| **TaskStatus** | `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`, `HOLD`, `CANCELLED` |
| **Priority** | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |

### 4.4 Database Config

```
DB Name:      taskflow
User/Pass:    taskflow / taskflow123
Port:         5432
Sync:         npx prisma db push (ห้ามใช้ migrate — มี SQLite artifacts)
```

---

## 5. API Endpoints (81 total)

| Group | Count | Base Path | Key Operations |
|-------|-------|-----------|---------------|
| Auth | 13 | `/api/v1/auth` | login, register, refresh, logout, forgot/reset password/pin |
| Projects | 12 | `/api/v1/projects` | CRUD, timeline, reorder, members |
| Tasks | 13 | `/api/v1/projects/:projectId/tasks`, `/api/v1/tasks` | CRUD, status, subtasks, convert, my-tasks, by-tag |
| Daily Updates | 6 | `/api/v1/tasks/:taskId/updates` | CRUD, date range |
| Comments | 6 | `/api/v1/tasks/:taskId/comments` | CRUD, reply threading |
| Notifications | 8 | `/api/v1/notifications` | CRUD, read/unread, count |
| Activity Logs | 4 | `/api/v1/activities` | recent, by project/task/user |
| Groups | 9 | `/api/v1/groups` | CRUD, members, projects |
| Uploads | 3 | `/api/v1/comments/:commentId/attachments` | upload, list, delete |
| Users (Admin) | 4 | `/api/v1/users` | list, update, reset password |
| Tags | 4 | `/api/v1/tags` | CRUD |

**Response Format:**
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

---

## 6. Frontend Pages

| Route | Page | Lines | Description |
|-------|------|-------|-------------|
| `/login` | `auth/LoginPage.tsx` | ~200 | Email/password + Remember Me |
| `/dashboard` | `dashboard/DashboardPage.tsx` | 691 | Stats, recent projects, activity, search |
| `/projects` | `project/ProjectsPage.tsx` | 1,019 | All projects (card/list/board/table) |
| `/my-projects` | `project/MyProjectsPage.tsx` | 384 | My projects (card/list) |
| `/internal-projects` | `project/InternalProjectsPage.tsx` | 440 | Internal projects |
| `/projects/:id` | `project/ProjectDetailPage.tsx` | 1,227 | Detail + Kanban + Members + Gantt tabs |
| `/my-tasks` | `task/MyTasksPage.tsx` | 985 | Personal tasks Kanban + DnD |
| `/calendar` | `task/CalendarPage.tsx` | 416 | Calendar view |
| `/timeline` | `task/TimelinePage.tsx` | 522 | Annual plan (12 months x categories) |
| `/tags/:tagId` | `task/TagTasksPage.tsx` | 530 | Tasks by tag |
| `/configuration` | `admin/ConfigurationPage.tsx` | 77 | Admin settings |
| `/configuration/users` | `admin/UserListPage.tsx` | 313 | User management |

**Key Modal:** `TaskDetailModal.tsx` (1,136 lines) — Task detail/edit with status, assignees, dates, tags, comments, daily updates, subtasks, status change log

**Key Component:** `GanttChart.tsx` (709 lines) — Gantt chart with drag/resize, hover activity preview

---

## 7. Authentication & Role System

### Auth Flow
```
Login → JWT access token (15min) + refresh token (7d) → localStorage + Zustand
Auto refresh via Axios 401 interceptor → if fail → redirect /login
```

### Role System (3 ระดับ)

| Role | จำนวน | สิทธิ์หลัก |
|------|-------|-----------|
| **ADMIN** | 2 คน | เห็นทุกอย่าง, จัดการ users, CRUD ทุก project/task |
| **MANAGER** | 6 คน | เห็น/จัดการ project ที่เป็น member, สร้าง project/task ได้ |
| **MEMBER** | 21 คน | เห็นเฉพาะ task ที่ assign ตัวเอง |

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| `adinuna@sena.co.th` | 123456 | ADMIN (protected) |
| `monchiant@sena.co.th` | 123456 | ADMIN (protected) |
| `tharab@sena.co.th` | 123456 | MANAGER |
| `nattapongm@sena.co.th` | 123456 | MANAGER |
| `chanonk@sena.co.th` | 123456 | MEMBER |

---

## 8. SENA Design System

| Element | Value |
|---------|-------|
| **Primary** | `#32BCAD` (Teal/Mint) |
| **Secondary** | `#2E7D9B` (Deep Blue) |
| **Warning** | `#E8A838` (Amber) |
| **Danger** | `#D94F4F` (Red) |
| **Neutral** | `#77787B` (Gray) |
| **Logo** | `PIC/SenaDlogo.png` |

### Status Colors

```
Task:    TODO=#77787B  IN_PROGRESS=#32BCAD  DONE=#2E7D9B  HOLD=#E8A838  CANCELLED=#77787B
Project: ACTIVE=#32BCAD  DELAY=#D94F4F  COMPLETED=#2E7D9B  HOLD=#E8A838  CANCELLED=#77787B
Priority: URGENT=#D94F4F  HIGH=#E8A838  MEDIUM=#E8A838  LOW=#32BCAD
```

---

## 9. Development Environment

### Docker (แนะนำ)
```bash
docker-compose up -d
# taskflow-db       → localhost:5432
# taskflow-backend  → localhost:3002
# taskflow-frontend → localhost:5173
# Health: curl http://localhost:3002/api/v1/health
```

### Local
```bash
cd backend && npm run dev   # :3000
cd frontend && npm run dev  # :5173
```

### Gotchas
- node_modules เป็น named volumes → เพิ่ม package ต้อง `docker volume rm` + rebuild
- `VITE_API_URL` เป็น build-time → ต้อง rebuild เมื่อเปลี่ยน
- ใช้ `prisma db push` เท่านั้น (ห้าม migrate)

---

## 10. Production

| รายการ | ค่า |
|-------|-----|
| **Server** | Ubuntu 24.04 LTS, IP: 172.22.22.11 |
| **URL** | `http://172.22.22.11:4200/taskflow/` |
| **SSH** | `ssh admindigital@172.22.22.11` |
| **Path** | `/home/admindigital/taskflow` |
| **Deploy** | `git pull origin main && docker compose -f docker-compose.prod.yml up -d --build` |

---

## 11. Development History (Phase 1-21)

| Phase | Date | Highlights |
|-------|------|-----------|
| 1-3 | ม.ค. 2026 | Foundation: Design, React+Express+Prisma, Auth, Dashboard |
| 4-7 | — | Core CRUD: Projects, Tasks, Updates, Comments, Notifications |
| 8-9 | — | Role visibility, First deploy (Vercel), Data import (77 users, 25 projects) |
| 10-11 | 2026-02-08~12 | User Feedback Round 1 (18 items), Sub-tasks, Export, Manual test 68/68 |
| 12 | 2026-02-14 | Codebase Refactoring: singleton, constants, types, AppError |
| 13 | 2026-02-15 | Annual Plan Timeline: 5 new fields, 12-month bars, 5 categories |
| 14 | 2026-02-15 | Multi-Assignee, Status Gradient, Clickable links, Configuration page |
| 15 | 2026-02-21 | Tag System, Convert Task↔Subtask, Chat Comments with reply + @mention |
| 16 | 2026-02-25 | Desktop Responsive, Cloudflare Tunnel |
| 17 | 2026-02-26 | Production Deployment (internal server, Nginx, Docker) |
| 18 | 2026-02-26 | Tag Enhancement, ETL Scripts, Smart Timeline |
| **19** | **2026-04-06** | **V2 Refactor Sprint P0-3 (biggest): Role 3 levels, My Projects, List View, Multi-filter, Gantt, Global Search, Bulk Action, DB Indexing, Rate Limiting** |
| 20 | 2026-04-07 | SENA Design System, Internal Projects, File attachment fix |
| 21 | 2026-04-07 | Remember Me login |
| **22** | **Pending** | **UAT Feedback Round 2 — 71 issues (see Doc/UAT-FEEDBACK-29APR2026.md)** |

---

## 12. Current UAT Feedback (Phase 22)

**71 issues** from UAT review on 29 Apr 2026:

| Category | Count | Priority |
|----------|-------|----------|
| Bugs (ระบบพัง) | 10 | Critical |
| Permission (เห็นข้อมูลผิดตาม Role) | 12 | Critical |
| UX/Layout | 15 | High |
| UI/Label (cosmetic) | 18 | Medium |
| New Features | 9 | Low |
| Skipped | 7 | — |

**Top Critical:**
1. Permission ทุกหน้ายังไม่ filter ตาม Role
2. Daily Update API error "Failed to add update"
3. File attachment broken (no preview, no download)
4. Gantt View missing/broken
5. Export buttons missing

**Full details:** `Doc/UAT-FEEDBACK-29APR2026.md`

---

## 13. Key Business Logic Locations

| Logic | File |
|-------|------|
| JWT generation | `backend/src/utils/auth.ts` |
| Account lockout (5 attempts → 15min) | `backend/src/services/auth.service.ts` |
| Task status change + mandatory comment | `backend/src/services/task.service.ts` |
| Due date reminder (daily 9AM cron) | `backend/src/jobs/dueDateReminder.job.ts` |
| Token refresh (Axios interceptor) | `frontend/src/services/api.ts` |
| Notification polling (30s) | `frontend/src/components/notification/NotificationPopover.tsx` |
| Kanban DnD collision | `frontend/src/utils/kanbanCollision.ts` |
| Excel/PDF export | `frontend/src/utils/exportExcel.ts`, `exportPDF.ts` |

---

## 14. Coding Standards

| Convention | Rule |
|-----------|------|
| Files/Components | PascalCase: `DashboardPage.tsx` |
| Functions | camelCase: `getMyTasks()` |
| Constants | UPPER_SNAKE: `STATUS_CONFIG` |
| TypeScript | strict mode, ห้าม `any`, unused params use `_` |
| Git commit | `<type>(<scope>): <subject>` (feat/fix/docs/refactor/test/chore) |
| DB sync | `prisma db push` only |

---

## 15. Known Technical Debt

| Issue | Impact | Priority |
|-------|--------|----------|
| Prisma 5.10.2 (7.x available) | Missing new features | Low |
| SQLite artifacts in migration history | Must use `db push` | Low |
| STATUS_CONFIG has only 5 of 7 statuses | IN_REVIEW, BLOCKED missing from UI | Medium |
| OVERDUE not in schema | Must compute from dueDate | Medium |
| Permission logic scattered per page | No centralized utility | High |
| 3 different status color sets | Potential inconsistency | Medium |

---

## 16. Glossary

| Term | Meaning |
|------|---------|
| **TaskFlow** | System internal codename |
| **IT Project System** | Official user-facing name |
| **SENA Development** | Company owner (เสนาดีเวลลอปเม้นท์) |
| **ผบห.** | ผู้บริหาร (executive) |
| **Head Team** | หัวหน้าทีม = MANAGER role |
| **Internal Project** | งานภายในทีม ไม่ report ผู้บริหาร |
| **UAT** | User Acceptance Test |

---

> **สร้างเพื่อให้ AI Agent (Codex / Claude Code) เข้าใจ project ทั้งหมดได้ทันที**
> **อัปเดตล่าสุด:** 2026-05-06
