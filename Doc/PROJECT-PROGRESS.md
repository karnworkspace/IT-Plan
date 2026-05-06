# Project Progress - Task Management System

**Last Updated:** 2026-05-06
**Status:** ✅ Production — Deployed on Internal Server
**Phase 1-11 Archive:** `Doc/PROGRESS-ARCHIVE.md`

---

## Current Status

| Component | Status |
|-----------|--------|
| Frontend (React + Vite + Ant Design) | ✅ 100% |
| Backend (Express + Prisma + PostgreSQL) | ✅ 100% |
| Tests (64/64 API + 65/65 Integration) | ✅ 100% |
| User Feedback (18/18 items) | ✅ 100% |
| Manual Test (68/68 passed) | ✅ 100% |
| User Acceptance Test (Cloudflare Tunnel) | ✅ Done |
| Codebase Refactoring | ✅ 100% |
| Annual Plan Timeline | ✅ 100% |
| Desktop Responsive | ✅ 100% |
| Production Deployment (Internal Server) | ✅ Done |
| V2 Refactor — Sprint P0-3 | ✅ 100% |
| SENA Design System | ✅ 100% |
| Internal Projects + My Tasks Fix | ✅ 100% |
| Remember Me Login | ✅ 100% |

### Dev Environment
- **Docker (แนะนำ):** `docker-compose up -d`
  - Frontend: http://localhost:5173
  - Backend: http://localhost:3001
  - Database: PostgreSQL 16 (port 5432)
  - DB Name: `taskflow`
- **Local:** Frontend :5173 / Backend :3000
- **External Testing:** Cloudflare Quick Tunnel (ดู `CLOUDFLARE-TUNNEL.md`)
- **Production:** `http://172.22.22.11:4200/taskflow/` (Ubuntu 24.04 Internal Server)

---

## Phase 12: Codebase Refactoring ✅ (2026-02-14)

**Backend:**
1. PrismaClient Singleton — 10 files → import from `config/database.ts`
2. Centralized Constants — `constants/index.ts` (Status/Priority/Role enums)
3. UUID Validation Middleware — `validate.middleware.ts`
4. AppError + Error Standardization — `utils/AppError.ts`

**Frontend:**
5. Centralized Types — `types/index.ts` (User, Task, Project, Comment, etc.)
6. Centralized Constants — `constants/index.ts` + `constants/statusIcons.tsx`
7. Fix TypeScript `any` — ลดจาก ~35 → 4 จุด
8. Shared CSS — `styles/shared.css`

---

## Phase 13: Annual Plan Timeline Redesign ✅ (2026-02-15)

**Database:** เพิ่ม 5 fields ใน Project model:
- `projectCode` String?, `category` String?, `businessOwner` String?
- `sortOrder` Int, `timeline` Json? (monthly plan: `{ "2026": { "1": "planned", ... } }`)

**Backend:** `GET /api/v1/projects/timeline`
- `project.service.ts` → `getTimelineData()`
- Route `/timeline` placed before `/:id` (avoid UUID validation conflict)

**Frontend:** Complete rewrite TimelinePage
- Table: NO | PROJECT ID | NAME | IT TEAM | % PROGRESS | TIMELINE (Q1-Q4)
- 5 categories: CONSTRUCTION_OPERATION, SALES_MARKETING, CORPORATE, PRODUCT, CUSTOMER_SERVICE
- 12-month bars: Red=Planned, Green=Completed, Orange=Delayed
- Current month highlight, expandable tasks, category filter
- Seeded 25 projects via `scripts/seed-timeline.ts`

---

## Phase 14: UX Improvements + Multi-Assignee (2026-02-15)

**Backend:**
1. ADMIN bypass — project.service + task.service: ADMIN สามารถ CRUD project/task ทุกตัวได้โดยไม่ต้องเป็นสมาชิก
2. Multiple Assignees — เพิ่ม `TaskAssignee` model (many-to-many), `createTask`/`updateTask` รับ `assigneeIds[]`
3. Task controller — รองรับทั้ง `assigneeId` (backward compat) และ `assigneeIds` (new)

**Frontend:**
4. Multiple Assignees UI:
   - `TaskDetailModal` — แก้ไข/แสดง assignees หลายคน (multi-select + Tags)
   - `ProjectDetailPage` board view — task cards แสดง assignees หลายคน
   - `taskService.ts` + `types/index.ts` — เพิ่ม `taskAssignees` ใน Task type

5. Project Status Gradient:
   - `constants/index.ts` — เพิ่ม `PROJECT_STATUS_GRADIENT` config (5 statuses × 5 colors)
   - `ProjectDetailPage` — header borderTop + timeline cards + stat cards ใช้สีตาม status

6. Timeline Page — Clickable Links:
   - คลิกชื่อ Project → navigate ไปหน้า `/projects/:id`
   - คลิกชื่อ Task → เปิด `TaskDetailModal` (ดู/แก้ไขได้)
   - เพิ่ม CSS class `ap-clickable` (hover สีฟ้า + underline)

7. Projects Page (Kanban) — เพิ่ม Dropdown Menu:
   - Board view cards มีปุ่ม `⋮` → Edit Project / Delete Project

8. My Tasks Page (Kanban) — Clickable + Editable:
   - คลิก task card → เปิด `TaskDetailModal` (แทน navigate ไป project)
   - เพิ่มปุ่ม `⋮` → View/Edit / Delete Task

9. Configuration & User Management (ADMIN only):
   - `/configuration` page — sidebar menu (ADMIN only)
   - `/configuration/users` — User list + Edit role + Reset password
   - Role permissions table (ADMIN/OWNER/MEMBER/USER)
   - Disable PIN Login (email/password only)

10. Login Page — ปรับ UI:
    - ลบ PIN login → email/password only
    - เพิ่ม "Forgot Password?" link
    - เพิ่มข้อความติดต่อ IT support

---

## Phase 15: P5-3 — Tag System + Convert + Timeline Tags + Chat Comments (2026-02-21)

**Phase A: Tag System**
1. Prisma Schema — เพิ่ม `Tag` + `TaskTag` models (many-to-many)
2. Backend — Tag CRUD service/controller/routes (`GET/POST/PUT/DELETE /tags`)
3. Task Service — รองรับ `tagIds` ใน create/update + filter by tagId
4. Project Service — `getTimelineData()` include tags
5. Frontend — `tagService.ts`, Tag/TaskTag types, TaskDetailModal tag section
6. Board/List view — tag badges บน task cards

**Phase B: Convert Task↔Subtask**
7. Backend — `convertToSubtask(taskId, parentTaskId)` + `convertToTask(taskId)` with validation
8. Routes — `PATCH /tasks/:id/convert-to-subtask`, `PATCH /tasks/:id/convert-to-task`
9. TaskDetailModal — Convert button + parent task selection modal
10. SubTaskList — Convert to Task button

**Phase C: Timeline-centric Tag Filter**
11. TimelinePage — Tag filter dropdown + tag badges in task rows

**Phase D: Chat-style Comments**
12. Prisma — Comment model เพิ่ม `parentCommentId` + self-referential relation
13. Comment Service — reply support (top-level + nested replies)
14. TaskDetailModal — Chat bubble UI (left/right alignment, reply threading)
15. @Mention autocomplete — Ant Design `<Mentions>` component

---

## Phase 16: Desktop Responsive + Cloudflare Tunnel (2026-02-25)

**Desktop Responsive (ปรับ CSS ให้ใช้งานได้ดีเมื่อ browser ไม่ maximize):**
1. `TimelinePage.css` — ลด column widths + @media 1200px
2. `DashboardPage.css` — @media 1200px padding
3. `MyTasksPage.css` — overflow-x: auto + min-width per column
4. `ProjectDetailPage.css` — overflow-x: auto + min-width per column
5. `CalendarPage.css` — flex-wrap + @media 1200px/768px
6. `Sidebar.css` — @media 1100px shrink sidebar 260→200px

**Cloudflare Quick Tunnel:**
- รองรับ external testing ผ่าน `cloudflared tunnel`
- คู่มือ: `CLOUDFLARE-TUNNEL.md` (gitignored)

---

## Phase 17: Production Deployment — Internal Server ✅ (2026-02-26)

**Server:** Ubuntu 24.04 LTS | Docker 28.5.1 | Nginx 1.24.0 | IP: 172.22.22.11

**Deployment:**
1. Multi-stage Docker build (frontend: Vite→Nginx, backend: TypeScript→Node)
2. `docker-compose.prod.yml` — 3 containers (postgres, backend, frontend)
3. Nginx config — `/taskflow/` base path + API proxy to backend container
4. Vite `base: '/taskflow/'` + React Router `basename`
5. URL: `http://172.22.22.11:4200/taskflow/`

**Deploy workflow:** `git pull origin main` → `docker compose -f docker-compose.prod.yml up -d --build`

---

## Phase 18: Tag Enhancement + ETL + Bugfix ✅ (2026-02-26)

1. **Inline Tag Creation** — สร้าง tag ได้ตรงใน TaskDetailModal
2. **Tag Popover** — hover tag badge แสดงรายละเอียด
3. **Smart Timeline Bars** — ปรับ bar ตาม time period อัตโนมัติ
4. **Tag Tasks Page** — คลิก tag badge → Kanban view แสดง tasks ทั้งหมดที่มี tag นั้น
5. **Timeline Fix** — word-wrap ชื่อ project ยาว + nowrap columns
6. **ETL Scripts** — import JO Excel → 3 projects (CMS, AMS, SF) + JSON seed script
7. **Production Seed** — JS seed script สำหรับ production container

---

## Phase 19: V2 Refactor — Sprint P0-3 ✅ (2026-04-06)

**Sprint P0: Role & Status Foundation**
1. **Role 3 ระดับ** — ADMIN / MANAGER / MEMBER พร้อม permission matrix
2. **Mandatory Status Comment** — บังคับใส่ comment เมื่อเปลี่ยน status
3. **Cancel Logic** — task cancellation workflow
4. **Project Type** — เพิ่ม type classification

**Sprint 1: UI/UX Quick Wins**
5. **Layout Restructure** — ปรับโครงสร้าง layout
6. **UI/UX Batch Improvements** — batch 1-2 quick wins

**Sprint 2: Feature Expansion**
7. **My Projects Page** — หน้ารวม projects ของตัวเอง
8. **List View** — เพิ่ม view mode แบบ list
9. **Multi-filter** — filter หลายเงื่อนไขพร้อมกัน
10. **Subtask Enhancements** — ปรับปรุง subtask (แสดงทั้ง view/edit mode)
11. **Hold Logic** — task hold/resume workflow
12. **Calendar Filter** — กรอง calendar ตามเงื่อนไข
13. **File Attachment 20MB** — รองรับไฟล์แนบสูงสุด 20MB
14. **Activity Log** — บันทึก activity history
15. **Permissions** — fine-grained permission control
16. **Tag CRUD UI** — จัดการ tags ผ่าน UI
17. **Dashboard Chart** — กราฟสถิติใน dashboard
18. **Global Search** — ค้นหาข้ามหน้า
19. **Bulk Action** — เลือกทำหลาย tasks พร้อมกัน
20. **Category** — จัดหมวดหมู่ project

**Sprint 3: Performance & Advanced**
21. **Gantt Chart** — drag & drop gantt view
22. **Responsive** — ปรับ responsive layout
23. **DB Indexing** — เพิ่ม database indexes
24. **Rate Limiting** — API rate limiter
25. **Backup Scripts** — database backup automation

**Bugfixes:**
- Timeline bar colors by time period + project status badge
- Sidebar collapse button bigger + visible
- Time remaining "Delay จาก Plan X วัน" in red

**Frontend Refactor:**
- Reorganize pages/components into feature-based subfolders

---

## Phase 20: SENA Design System + Internal Projects ✅ (2026-04-07)

1. **SENA Development Design System** — apply CI brand ทั้ง app (colors, typography, spacing)
2. **Timeline Page Polish** — SENA branded, status-colored badges, hover effects
3. **SENA Design Polish** — fix My Tasks logic + UI refinement
4. **Internal Projects Page** — หน้าแสดง internal projects + member modal cleanup
5. **PDF/Excel/Video Attachments** — แสดง file card แทน "No Image"
6. **TypeScript Fixes** — resolve 5 TS errors blocking production build
7. **CalendarPage Cleanup** — remove unused vars

---

## Phase 21: Login UX ✅ (2026-04-07)

1. **Remember Me** — save email to localStorage, auto-fill on next login

---

## Phase 22: UAT Feedback Fix — Sprint A ✅ (2026-05-06)

**Source:** `Doc/UAT-FEEDBACK-29APR2026.md` (71 issues from UAT 29 Apr 2026)

**A0 — Baseline Check:** builds pass, Docker healthy, port 3002 confirmed

**A1 — Role Visibility Foundation** (#3,#13,#17,#18,#24,#25,#34,#38):
- Backend service-layer role filtering ทุก endpoint:
  - getAllProjects: ADMIN=all, MANAGER/MEMBER=member projects only
  - getAllTasks: membership gate + MEMBER=assigned only
  - getMyTasks: ADMIN=all, MANAGER=member project tasks, MEMBER=assigned
  - getTaskById: ADMIN=any, MANAGER=member project, MEMBER=assigned
  - getProjectById: membership gate, no task count leak
  - getProjectStats + getTaskStats: membership gate + MEMBER assigned-only
  - getRecentActivities: scoped to member projects

**A2 — Member UI Permission Controls** (#32, partial #70):
- Hide Edit/Delete Project, Add/Remove Member, Delete Task for MEMBER
- Backend mutation permissions verified (reject MEMBER at service layer)

**A3 — Daily Update & Attachments** (#44,#47 partial,#48,#49):
- Fix "Failed to add update": progress/status now optional (default from task)
- Upload total size limit: 20MB per request (backend + frontend validation)
- ADMIN bypass + taskAssignees permission for create/update/delete daily update
- #47 partial: Daily Update attachment deferred (needs schema change)

**A4 — Export & Navigation** (#27,#31,#14,#15):
- Export Excel + PDF restored in My Projects
- Dashboard stat cards → /my-projects
- Back button → navigate(-1)
- Team Members card: display only (no wrong navigation)

**A5 — Gantt Critical Bugs** (#61,#63,#64):
- destroyInactiveTabPane: prevent DndContext interference
- All tasks shown (createdAt fallback for dateless tasks)
- Status filter applies to Gantt via filteredTasks
- Consistent date fallback helper (getTaskStartDate/getTaskEndDate)

**A6 — Small UI Fixes** (#1,#2,#16,#30):
- Title "IT Project System" (already correct)
- Forgot Password hidden (already done)
- Status dots circular (already correct)
- COMPLETED color standardized to #2E7D9B across 7 hardcoded locations

## Phase 22: UAT Feedback Fix — Sprint B ✅ (2026-05-06)

**B1/B2/B3 — Dashboard + Sidebar** (#6,#7,#8,#11):
- Dashboard overflow fix: max-width + overflow-x:hidden
- My Active Tasks row clickable (title + entire row)
- Sidebar toggle button: SENA teal visible style

**B4 — My Tasks List View** (#37 verified, #39 verified, #36 verified, #40):
- List View + sorting + multi-filter already existed (verified)
- Backend getMyTasks: added taskAssignees + _count.subTasks + subTasks statuses
- Subtask count: done/total ratio on Kanban cards (ClickUp-style)
- Assignees column sorter added

**B7 — Daily Updates Placement** (#43):
- Moved Daily Updates section after Description (before Sub-tasks)

**B8 — Subtask Enhancement** (#51 verified, #52 verified, #55):
- Start/Due Date + Assignee in add form (verified existing)
- Inline title editing: double-click to edit, save on Enter/blur

**B9 — Gantt Improvements** (#62, #59 verified):
- Sticky columns: Task Name + Duration frozen on horizontal scroll
- Hover activity preview already existed (verified)

**B10 — Project Detail Stat Cards** (#33):
- Clickable stat cards: filter + scroll to task section
- Board View filters via boardTasksByStatus
- Accessibility: role="button", tabIndex, keyboard Enter
- Fixed || → ?? for stat values (0 no longer replaced by fallback)

**B11 — My Projects Sort** (#29):
- All list view columns sortable
- Default sort by Status (Active → Delay → Hold → Completed → Cancelled)

**B12 — Task Card Assignee** (#35 verified):
- Assignee display already existed in card footer (verified)

**B13 — Hold/Cancelled Progress** (#42):
- resolveProgressForStatus() helper: DONE=100, HOLD/CANCELLED=preserve, others=default
- Applied to both updateTask and updateTaskStatus endpoints
- SubTaskList: delegate progress to backend

## Phase 22: Hardening — H1 Authz ✅ (2026-05-06)

**H1 — Secondary Endpoint Authz Hardening:**
- canAccessTask(userId, taskId) shared helper: ADMIN=any, MANAGER=project member, MEMBER=assigned only
- Gated 9 endpoints: comments (list/create), daily updates (list/range/getById), subtasks, status logs, attachments (upload/read)
- Upload: cleanup orphan files on unauthorized access
- updateTask: checks taskAssignees N:M (was assigneeId only)
- canAccessTask aligned with A1: MEMBER = assigned only (no creator fallback for reads)

**H2 — API Pagination Param Consistency:**
- All paginated controllers accept both `pageSize` and `limit` (limit takes precedence)
- Fixed 5 endpoints: projects, my-projects, project tasks, my-tasks, tasks-by-tag
- Impact: Dashboard/ProjectDetail now receive correct number of items (was silently capped to defaults)

## Phase 22: UAT Feedback Fix — Sprint C ✅ (2026-05-06)

**C1-C8 — Labels + Branding:**
- #1(v) Title "IT Project System", #4 Login SENA logo, #5(v) "Dashboard", #9(v) "IT Overall"
- #10 Dashboard stat cards neutral (removed colored borders)
- #12(v) "View My Projects", #13 Member subtitle "Project Overall", #19(v) Infrastructure category

**C9-C14 — Colors + Page Titles + Form:**
- #20/#28/#57(v) Status bar colors use PROJECT_STATUS_GRADIENT, #21(v) progress text bold+black
- #22(v) My Projects menu, #23 document.title added to all 17 pages
- #26(v) "Project Status :" label, #45/#46(v) Daily Update form notes-only + "Update" button

**C16-C20 — Subtask + Calendar Polish:**
- #50(v) Subtask status color badge, #53(v) No tags in subtask
- #54 "Move to task" tooltip/message, #65(v) Calendar stat boxes removed
- #66(v) Calendar task bars colored by status

**C21 — Gantt Drag + Revision Log:**
- #58(v) Drag auto-updates dates via updateTask + activity log with user/timestamp/changes

---

## Known Issues

1. Prisma 5.10.2 (7.x available but needs migration)
2. #47 Daily Update attachment — partial (needs schema change for per-update attachments)
3. ~~Secondary endpoints authz~~ ✅ Done (H1)
4. ~~pageSize vs limit param mismatch~~ ✅ Done (H2)
5. No automated test suite in active repo
6. Manager UI: some buttons visible but backend may 403 (project member role not checked in UI)
7. STATUS_PROGRESS constant has stale HOLD:0/CANCELLED:0 (bypassed by helper, no functional impact)

---

## Recommended Next Actions

### Sprint D (UAT Feedback — Remaining)
- #68 Email notification (Zimbra) — skipped, needs SMTP config
- #71 Responsive Tablet/iPad — deferred
- #60 Gantt in MyTasksPage — skipped per plan

### Optional / Future
- ~~Production deployment (GitHub → Server)~~ ✅ Done
- Real-time notifications (WebSocket)
- Email notifications
- WCAG AA accessibility audit
- Caching strategies
- Authz hardening for secondary endpoints
