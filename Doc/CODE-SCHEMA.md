# CODE-SCHEMA.md — YTY TaskFlow Codebase Map

> AI Agent: อ่านไฟล์นี้เพื่อเข้าใจ codebase ทั้งหมดโดยไม่ต้องไล่อ่านทีละไฟล์
> Last Updated: 2026-04-06

---

## 1. DATABASE SCHEMA (Prisma Models & Relations)

```
┌──────────────┐     1:N     ┌────────────────┐
│     User     │────────────▶│  RefreshToken   │
│  (users)     │             └────────────────┘
│              │
│  id (uuid)   │──┐  1:N     ┌────────────────┐
│  email       │  ├────────▶│ ProjectMember   │◀──── Project (N:1)
│  password    │  │          └────────────────┘
│  name        │  │
│  role        │  │  1:N     ┌────────────────┐
│  pinHash?    │  ├────────▶│  GroupMember    │◀──── Group (N:1)
│  loginAttempts│  │          └────────────────┘
│  lockedUntil? │  │
│  lastLoginAt? │  │  1:N     ┌────────────────┐
│              │  ├────────▶│ TaskAssignee   │◀──── Task (N:1)
│              │  │          └────────────────┘
│              │  │
│              │  │  1:N     ┌────────────────┐
│              │  ├────────▶│   Comment      │◀──── Task (N:1)
│              │  │          │  parentComment?│◀──── self-ref (replies)
│              │  │          │  attachments[] │────▶ Attachment (1:N)
│              │  │          └────────────────┘
│              │  │
│              │  ├────────▶ Notification (1:N) ◀── Project? + Task?
│              │  ├────────▶ ActivityLog  (1:N) ◀── Project? + Task?
│              │  ├────────▶ Task[creator] (1:N)
│              │  └────────▶ Task[assignee](1:N)
└──────────────┘

┌──────────────┐     1:N     ┌────────────────┐
│   Project    │────────────▶│     Task       │
│  (projects)  │             │  (tasks)       │
│              │             │                │
│  id, name    │             │  id, title     │
│  description │             │  description   │
│  color, icon │             │  status        │  ← TODO|IN_PROGRESS|IN_REVIEW|DONE|BLOCKED|HOLD|CANCELLED
│  status      │             │  priority      │  ← LOW|MEDIUM|HIGH|URGENT
│  start/endDate│            │  projectId     │
│  projectCode │             │  assigneeId?   │
│  category    │             │  createdById   │
│  businessOwner│            │  parentTaskId? │──── self-ref (subtasks)
│  sortOrder   │             │  dueDate?      │
│  timeline    │ (JSON)      │  startDate?    │
│  ownerId     │             │  progress 0-100│
│              │             │  sortOrder     │
│  members[]   │             │                │
│  groupProjects[]│          │  taskAssignees[]│
└──────────────┘             │  taskTags[]    │──── TaskTag ──── Tag
                             │  comments[]    │
                             │  dailyUpdates[]│──── DailyUpdate
                             │  subTasks[]    │
                             └────────────────┘

┌──────────────┐     N:M (via GroupMember/GroupProject)
│    Group     │
│  (groups)    │
│  id, name    │
│  type        │  ← USER_GROUP | PROJECT_GROUP
│  color       │
│  members[]   │──── GroupMember ──── User
│  projects[]  │──── GroupProject ─── Project
└──────────────┘

┌──────────────┐
│     Tag      │
│  (tags)      │
│  id, name    │
│  color       │
│  taskTags[]  │──── TaskTag ──── Task
└──────────────┘
```

### Enum Values (Source of Truth)

| Type | Values |
|------|--------|
| **UserRole** | `ADMIN`, `MEMBER` |
| **TaskStatus** | `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`, `HOLD`, `CANCELLED` |
| **Priority** | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| **ProjectStatus** | `ACTIVE`, `DELAY`, `COMPLETED`, `HOLD`, `CANCELLED`, `POSTPONE`, `ARCHIVED` |
| **MemberRole** | `OWNER`, `ADMIN`, `MEMBER` |
| **GroupType** | `USER_GROUP`, `PROJECT_GROUP` |
| **NotificationType** | `TASK_ASSIGNED`, `TASK_DUE_SOON`, `TASK_OVERDUE`, `TASK_COMPLETED`, `COMMENT_ADDED`, `PROJECT_INVITE`, `DAILY_REMINDER` |
| **ActivityAction** | `CREATED`, `UPDATED`, `DELETED`, `ASSIGNED`, `COMPLETED`, `COMMENTED` |

---

## 2. BACKEND ARCHITECTURE

### File → Responsibility Map

```
backend/src/
├── index.ts                 ← Server entry (Express listen)
├── app.ts                   ← Express app setup (middleware, routes, error handler)
├── config/
│   ├── index.ts             ← ENV config: port, JWT secrets, CORS, bcrypt rounds
│   └── database.ts          ← PrismaClient singleton
├── constants/
│   └── index.ts             ← Enum types + validation helpers (isValidTaskStatus, etc.)
├── middlewares/
│   ├── auth.middleware.ts    ← authenticate (JWT verify) + requireAdmin
│   ├── error.middleware.ts   ← errorHandler + notFoundHandler
│   ├── validate.middleware.ts← validateUUID(paramNames)
│   └── rateLimiter.middleware.ts ← authLimiter, apiLimiter (currently no-op)
├── utils/
│   ├── AppError.ts          ← Custom error class (notFound, forbidden, unauthorized, badRequest)
│   ├── auth.ts              ← hashPassword, comparePassword, hashPin, comparePin, generateToken, verifyToken
│   └── response.ts          ← sendSuccess, sendError, calculatePagination
├── jobs/
│   ├── index.ts             ← startAllJobs()
│   └── dueDateReminder.job.ts ← Daily 9AM: find due/overdue tasks → create notifications
├── routes/                  ← Route definitions (see API Endpoints below)
├── controllers/             ← HTTP handlers (parse req → call service → send response)
├── services/                ← Business logic (Source of Truth)
└── types/
    └── index.ts             ← Backend-specific types
```

### Service Cross-Dependencies

```
auth.service        → (none)
project.service     → (none)
task.service        → notificationService, activityLogService
comment.service     → (none)
notification.service→ (none)
activityLog.service → (none)
group.service       → (none)
tag.service         → (none)
attachment.service  → (none)
user.service        → (none)
dailyUpdate.service → (none)

dueDateReminder.job → notificationService (creates TASK_DUE_SOON / TASK_OVERDUE)
```

### Service → Prisma Model Map

| Service | Read Models | Write Models |
|---------|-------------|--------------|
| auth | User, RefreshToken | User, RefreshToken |
| project | Project, ProjectMember, Task, User | Project, ProjectMember |
| task | Task, TaskAssignee, TaskTag, Project, User | Task, TaskAssignee, TaskTag |
| comment | Comment, Task | Comment |
| notification | Notification | Notification |
| activityLog | ActivityLog | ActivityLog |
| group | Group, GroupMember, GroupProject | Group, GroupMember, GroupProject |
| tag | Tag | Tag |
| attachment | Attachment | Attachment |
| user | User | User |
| dailyUpdate | DailyUpdate, Task | DailyUpdate |

---

## 3. API ENDPOINTS (81 total)

### Auth (`/api/v1/auth`) — 13 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| POST | `/register` | register | rateLimited |
| POST | `/login` | login | rateLimited |
| POST | `/login-pin` | loginWithPin | rateLimited |
| POST | `/setup-pin` | setupPin | JWT |
| POST | `/change-pin` | changePin | JWT |
| POST | `/reset-pin` | resetPin | JWT |
| POST | `/forgot-password` | forgotPassword | rateLimited |
| POST | `/reset-password` | resetPassword | rateLimited |
| POST | `/forgot-pin` | forgotPin | rateLimited |
| POST | `/reset-pin-token` | resetPinWithToken | rateLimited |
| POST | `/refresh` | refreshToken | none |
| POST | `/logout` | logout | none |
| GET | `/me` | getCurrentUser | JWT |

### Projects (`/api/v1/projects`) — 12 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/timeline` | getTimeline | JWT |
| PATCH | `/reorder` | reorderProjects | JWT |
| GET | `/` | getProjects | JWT |
| POST | `/` | createProject | JWT |
| GET | `/:id/stats` | getProjectStats | JWT+UUID |
| GET | `/:id` | getProject | JWT+UUID |
| PUT | `/:id` | updateProject | JWT+UUID |
| DELETE | `/:id` | deleteProject | JWT+UUID |
| GET | `/:id/members` | getProjectMembers | JWT+UUID |
| POST | `/:id/members` | addProjectMember | JWT+UUID |
| PUT | `/:id/members/:memberId` | updateProjectMemberRole | JWT+UUID |
| DELETE | `/:id/members/:memberId` | removeProjectMember | JWT+UUID |

### Tasks — 13 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/projects/:projectId/tasks` | getTasks | JWT+UUID |
| GET | `/projects/:projectId/tasks/stats` | getTaskStats | JWT+UUID |
| POST | `/projects/:projectId/tasks` | createTask | JWT+UUID |
| GET | `/my-tasks` | getMyTasks | JWT |
| PATCH | `/tasks/reorder` | reorderTasks | JWT |
| GET | `/tasks/by-tag/:tagId` | getTasksByTag | JWT+UUID |
| GET | `/tasks/:id` | getTask | JWT+UUID |
| GET | `/tasks/:id/subtasks` | getSubTasks | JWT+UUID |
| PUT | `/tasks/:id` | updateTask | JWT+UUID |
| DELETE | `/tasks/:id` | deleteTask | JWT+UUID |
| PATCH | `/tasks/:id/status` | updateTaskStatus | JWT+UUID |
| PATCH | `/tasks/:id/convert-to-subtask` | convertToSubtask | JWT+UUID |
| PATCH | `/tasks/:id/convert-to-task` | convertToTask | JWT+UUID |

### Daily Updates — 6 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/tasks/:taskId/updates` | getTaskUpdates | JWT+UUID |
| GET | `/tasks/:taskId/updates/range` | getUpdatesByDateRange | JWT+UUID |
| POST | `/tasks/:taskId/updates` | createDailyUpdate | JWT+UUID |
| GET | `/updates/:id` | getDailyUpdate | JWT+UUID |
| PUT | `/updates/:id` | updateDailyUpdate | JWT+UUID |
| DELETE | `/updates/:id` | deleteDailyUpdate | JWT+UUID |

### Comments — 6 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/tasks/:taskId/comments` | getTaskComments | JWT+UUID |
| POST | `/tasks/:taskId/comments` | createComment | JWT+UUID |
| GET | `/comments/:id` | getComment | JWT+UUID |
| PUT | `/comments/:id` | updateComment | JWT+UUID |
| DELETE | `/comments/:id` | deleteComment | JWT+UUID |
| GET | `/user/comments` | getUserComments | JWT |

### Notifications — 8 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/notifications` | getUserNotifications | JWT |
| GET | `/notifications/unread/count` | getUnreadCount | JWT |
| POST | `/notifications` | createNotification | JWT |
| GET | `/notifications/:id` | getNotification | JWT+UUID |
| PUT | `/notifications/:id/read` | markAsRead | JWT+UUID |
| DELETE | `/notifications/:id` | deleteNotification | JWT+UUID |
| PUT | `/notifications/read-all` | markAllAsRead | JWT |
| DELETE | `/notifications/old` | clearOldNotifications | JWT |

### Activity Logs — 4 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/activities/recent` | getRecentActivities | JWT |
| GET | `/projects/:projectId/activities` | getProjectActivities | JWT |
| GET | `/tasks/:taskId/activities` | getTaskActivities | JWT |
| GET | `/users/:userId/activities` | getUserActivities | JWT |

### Groups (`/api/v1/groups`) — 9 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/` | getGroups | JWT |
| GET | `/:id` | getGroup | JWT+UUID |
| POST | `/` | createGroup | JWT |
| PUT | `/:id` | updateGroup | JWT+UUID |
| DELETE | `/:id` | deleteGroup | JWT+UUID |
| POST | `/:id/members` | addGroupMember | JWT+UUID |
| DELETE | `/:id/members/:userId` | removeGroupMember | JWT+UUID |
| POST | `/:id/projects` | addGroupProject | JWT+UUID |
| DELETE | `/:id/projects/:projectId` | removeGroupProject | JWT+UUID |

### Uploads — 3 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| POST | `/comments/:commentId/attachments` | uploadCommentImages | JWT+multer(5) |
| GET | `/comments/:commentId/attachments` | getCommentAttachments | JWT |
| DELETE | `/attachments/:id` | deleteAttachment | JWT |

### Users (`/api/v1/users`) — 4 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/list` | getUsersList | JWT |
| GET | `/` | getUsers | JWT+Admin |
| PUT | `/:id` | updateUser | JWT+Admin |
| POST | `/:id/reset-password` | resetUserPassword | JWT+Admin |

### Tags — 4 endpoints
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/tags` | getAllTags | JWT |
| POST | `/tags` | createTag | JWT |
| PUT | `/tags/:id` | updateTag | JWT |
| DELETE | `/tags/:id` | deleteTag | JWT |

---

## 4. FRONTEND ARCHITECTURE

### File → Responsibility Map

```
frontend/src/
├── App.tsx              ← Router + Routes + ConfigProvider
├── main.tsx             ← ReactDOM.createRoot entry
├── App.css              ← Global app styles
├── index.css            ← Base CSS reset
├── vite-env.d.ts        ← Vite type definitions
│
├── services/            ← API client layer
│   ├── api.ts           ← Axios instance (baseURL, interceptors, token refresh)
│   ├── authService.ts   ← login, register, PIN, password reset
│   ├── projectService.ts← CRUD projects + members + stats + reorder
│   ├── taskService.ts   ← CRUD tasks + status + subtasks + reorder + convert
│   ├── commentService.ts← CRUD comments + attachments
│   ├── notificationService.ts ← CRUD notifications + read/unread
│   ├── activityLogService.ts  ← get activities (project/task/user/recent)
│   ├── groupService.ts  ← CRUD groups + members + projects
│   ├── tagService.ts    ← CRUD tags
│   └── dailyUpdateService.ts ← CRUD daily updates + date range
│
├── store/
│   └── authStore.ts     ← Zustand: user, tokens, isAuthenticated, login/logout/setupPin
│
├── types/
│   └── index.ts         ← All TypeScript interfaces (User, Task, Project, Comment, etc.)
│
├── constants/
│   ├── index.ts         ← STATUS_CONFIG, PRIORITY_CONFIG, colors, labels
│   └── statusIcons.tsx  ← STATUS_ICONS mapping (status → Ant Design icon)
│
├── hooks/
│   └── useCountUp.ts    ← Animated counter hook (0 → target with easeOutQuart)
│
├── utils/
│   ├── getErrorMessage.ts ← Extract error message from Axios errors
│   ├── exportExcel.ts   ← Export tasks/projects to Excel
│   ├── exportPDF.ts     ← Export tasks/projects to PDF
│   └── kanbanCollision.ts ← DnD collision detection for Kanban boards
│
├── styles/
│   └── shared.css       ← Shared stat card styles
│
├── components/              ← Reusable components (แยกตาม feature)
│   ├── layout/
│   │   ├── Sidebar.tsx      ← Navigation menu (Dashboard, Projects, My Tasks, Calendar, Config)
│   │   └── ProtectedRoute.tsx ← Auth guard (redirect to /login if unauthenticated)
│   ├── notification/
│   │   └── NotificationPopover.tsx ← Bell icon + notification list (polls every 30s)
│   ├── auth/
│   │   └── PinInput.tsx     ← 6-digit PIN input (masked, auto-focus)
│   ├── task/
│   │   └── SubTaskList.tsx  ← Subtask CRUD within TaskDetailModal
│   └── project/
│       └── GanttChart.tsx   ← Gantt chart visualization (pure render, no API)
│
├── pages/                   ← Page components (แยกตาม feature)
│   ├── auth/                ← Authentication pages
│   │   ├── LoginPage.tsx         ← Email/password login form
│   │   ├── RegisterPage.tsx      ← Registration form
│   │   ├── ForgotPasswordPage.tsx← 3-step password reset flow
│   │   ├── ForgotPinPage.tsx     ← 3-step PIN reset flow
│   │   └── SetupPinPage.tsx      ← First-time PIN setup
│   ├── dashboard/
│   │   └── DashboardPage.tsx     ← Stats cards + recent projects + my tasks + activities
│   ├── project/
│   │   ├── ProjectsPage.tsx      ← Project list (card/list/board views) + CRUD + DnD reorder
│   │   └── ProjectDetailPage.tsx ← Project detail + task list + members + Gantt + DnD
│   ├── task/
│   │   ├── MyTasksPage.tsx       ← Kanban board of user's tasks + DnD
│   │   ├── CalendarPage.tsx      ← Calendar view of tasks by due date
│   │   ├── TimelinePage.tsx      ← Annual timeline/Gantt by project category
│   │   ├── TagTasksPage.tsx      ← Tasks filtered by tag (Kanban)
│   │   └── TaskDetailModal.tsx   ← Task detail/edit modal (comments, updates, subtasks, tags)
│   └── admin/
│       ├── ConfigurationPage.tsx ← Admin settings menu
│       ├── UserListPage.tsx      ← Admin: user management table
│       └── GroupsPage.tsx        ← Group CRUD + member/project management
│
└── assets/
    └── react.svg        ← React logo
```

### Route Map

| Path | Page | Auth | Description |
|------|------|------|-------------|
| `/login` | LoginPage | Public | Email/password login |
| `/register` | RegisterPage | Public | New user registration |
| `/setup-pin` | SetupPinPage | Public | First-time PIN setup |
| `/forgot-password` | ForgotPasswordPage | Public | Password reset flow |
| `/forgot-pin` | ForgotPinPage | Public | PIN reset flow |
| `/dashboard` | DashboardPage | Protected | Overview stats & recent activity |
| `/projects` | ProjectsPage | Protected | All projects list |
| `/projects/:projectId` | ProjectDetailPage | Protected | Project detail + tasks |
| `/my-tasks` | MyTasksPage | Protected | User's assigned tasks (Kanban) |
| `/calendar` | CalendarPage | Protected | Calendar view |
| `/timeline` | TimelinePage | Protected | Annual timeline |
| `/tags/:tagId` | TagTasksPage | Protected | Tasks by tag |
| `/configuration` | ConfigurationPage | Protected | Admin settings |
| `/configuration/users` | UserListPage | Protected | User management |
| `/` | → `/dashboard` | Redirect | Default redirect |
| `*` | → `/dashboard` | Redirect | 404 fallback |

---

## 5. DATA FLOW DIAGRAMS

### Authentication Flow
```
LoginPage → authStore.loginWithEmail() → authService.loginWithEmail()
  → POST /api/v1/auth/login
  → Backend: validate credentials → generate JWT + refresh token
  → Response: { accessToken, refreshToken, user }
  → Store: save to localStorage + Zustand state
  → Navigate to /dashboard

Token Refresh (auto):
  API call returns 401 → Axios interceptor
  → POST /api/v1/auth/refresh { refreshToken }
  → New accessToken → retry original request
  → If refresh fails → redirect to /login
```

### Task Lifecycle
```
Create:  ProjectDetailPage → taskService.createTask()
         → POST /api/v1/projects/:id/tasks
         → Backend: create Task + TaskAssignee + TaskTag
                    → notify assignees (TASK_ASSIGNED)
                    → log activity (CREATED)

Update:  TaskDetailModal → taskService.updateTask()
         → PUT /api/v1/tasks/:id
         → Backend: update Task + sync assignees + sync tags
                    → notify new assignees
                    → log activity (UPDATED)

Status:  Kanban DnD → taskService.updateTaskStatus()
         → PATCH /api/v1/tasks/:id/status
         → Backend: update status + progress
                    → if DONE → notify creator (TASK_COMPLETED)
                    → log activity (COMPLETED/UPDATED)

Delete:  TaskDetailModal → taskService.deleteTask()
         → DELETE /api/v1/tasks/:id
         → Backend: cascade delete (comments, updates, notifications)
                    → log activity (DELETED)
```

### Notification Flow
```
Sources:
  1. task.service   → TASK_ASSIGNED, TASK_COMPLETED
  2. dueDateJob     → TASK_DUE_SOON (daily 9AM, tasks due tomorrow)
                    → TASK_OVERDUE  (daily 9AM, past due tasks)

Consumption:
  NotificationPopover → polls getUnreadCount() every 30s
                      → getNotifications(limit:20) when opened
                      → markAsRead() on click → navigate to task/project
```

---

## 6. PAGE → SERVICE DEPENDENCY MAP

| Page | Services Used |
|------|---------------|
| **LoginPage** | authStore (loginWithEmail) |
| **RegisterPage** | authStore (register) |
| **ForgotPasswordPage** | authService (requestPasswordReset, resetPassword) |
| **ForgotPinPage** | authService (requestPinReset, resetPinWithToken) |
| **SetupPinPage** | authStore (setupPin) |
| **DashboardPage** | projectService, taskService, activityLogService |
| **ProjectsPage** | projectService (CRUD + stats + reorder) |
| **ProjectDetailPage** | projectService, taskService, api(/users/list) |
| **MyTasksPage** | taskService, projectService |
| **CalendarPage** | taskService |
| **TimelinePage** | api(/projects/timeline), tagService |
| **ConfigurationPage** | (none - static menu) |
| **UserListPage** | api(/users CRUD) |
| **GroupsPage** | groupService, projectService |
| **TagTasksPage** | taskService, api(/tags/:id) |
| **TaskDetailModal** | taskService, commentService, dailyUpdateService, projectService, tagService |

---

## 7. PERMISSION MATRIX

### Backend Authorization

| Operation | Who Can Do It |
|-----------|--------------|
| **Task CRUD** | assignee, creator, projectOwner, systemAdmin |
| **Task Status** | assignee, creator, projectOwner, systemAdmin |
| **Comment Edit** | comment author only |
| **Comment Delete** | author, taskCreator, projectOwner |
| **Project CRUD** | projectOwner, systemAdmin |
| **Project Members** | projectOwner, systemAdmin |
| **DailyUpdate** | assignee, taskCreator, projectOwner |
| **User Management** | systemAdmin only (requireAdmin middleware) |

### Protected Accounts
- `monchiant@sena.co.th` — cannot be edited
- `adinuna@sena.co.th` — cannot be edited

### Special Users (Task Visibility)
- `monchiant@sena.co.th`, `adinuna@sena.co.th` — see all tasks (admin override in getMyTasks)
- `team@sena.co.th` — shared task bucket
- `tharab@sena.co.th`, `nattapongm@sena.co.th` — team viewers

---

## 8. KEY BUSINESS LOGIC LOCATIONS

| Logic | File | Function |
|-------|------|----------|
| JWT token generation | `backend/src/utils/auth.ts` | generateAccessToken, generateRefreshToken |
| Password hashing | `backend/src/utils/auth.ts` | hashPassword, comparePassword |
| PIN validation rules | `backend/src/utils/auth.ts` | validatePin (6 digits, no sequential, no repeat) |
| Account lockout | `backend/src/services/auth.service.ts` | login (5 attempts → 15min lock) |
| Task auto-progress | `backend/src/constants/index.ts` | STATUS_PROGRESS mapping |
| Due date reminders | `backend/src/jobs/dueDateReminder.job.ts` | daily 9AM cron |
| Token refresh | `frontend/src/services/api.ts` | Axios 401 interceptor |
| Notification polling | `frontend/src/components/NotificationPopover.tsx` | setInterval 30s |
| Kanban DnD | `frontend/src/utils/kanbanCollision.ts` | collision detection |
| Excel/PDF export | `frontend/src/utils/exportExcel.ts`, `exportPDF.ts` | per-page export |

---

## 9. CONFIG & ENVIRONMENT

### Backend Config (`backend/src/config/index.ts`)
```
port           = PORT || 3000
nodeEnv        = NODE_ENV || 'development'
databaseUrl    = DATABASE_URL
accessSecret   = JWT_ACCESS_SECRET
refreshSecret  = JWT_REFRESH_SECRET
accessExpiry   = JWT_ACCESS_EXPIRY || '15m'
refreshExpiry  = JWT_REFRESH_EXPIRY || '7d'
bcryptRounds   = 10
maxLoginAttempts = 5
lockoutDuration = 15 min
corsOrigin     = CORS_ORIGIN (comma-separated)
```

### Frontend Config
```
VITE_API_URL   = API base URL (default: http://localhost:3000/api/v1)
BASE_URL       = Vite base path (for deployment subpath)
```

### Docker
```
docker-compose.yml      ← Dev: frontend(5173) + backend(3001) + postgres(5432)
docker-compose.prod.yml ← Prod: same but with production builds
DB: taskflow / taskflow123@localhost:5432/taskflow
```

---

## 10. SHARED CONSTANTS (Frontend ↔ Backend)

Frontend `constants/index.ts` and Backend `constants/index.ts` share same enum values.
Frontend `types/index.ts` mirrors Prisma model shapes for type safety.

### Status Display Config (Frontend)
```
TODO        → gray   (#6B7280)
IN_PROGRESS → blue   (#3B82F6)
DONE        → green  (#10B981)
HOLD        → orange (#F59E0B)
CANCELLED   → red/gray
```

### Priority Display Config (Frontend)
```
URGENT → red    (#DC2626)
HIGH   → orange (#EA580C)
MEDIUM → amber  (#D97706)
LOW    → green  (#16A34A)
```
