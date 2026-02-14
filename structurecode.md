# Structure Code - YTY Project (TaskFlow)

> Single source of truth for code organization, imports, and conventions.
> Last Updated: 2026-02-14 (Post-Refactoring)

---

## Data Flow

```
Frontend (React)
  -> services/*.ts          (Axios API calls)
  -> Backend API (Express)
    -> routes/*.routes.ts   (URL + middleware mapping)
    -> controllers/*.ts     (parse request, call service, send response)
    -> services/*.ts        (business logic, Prisma queries)
    -> Prisma ORM
      -> PostgreSQL (Neon)
```

---

## Backend Structure

```
backend/src/
├── app.ts                              # Express app setup, middleware registration
├── index.ts                            # Server entry point
│
├── config/
│   ├── database.ts                     # PrismaClient singleton (import from here!)
│   └── index.ts                        # Env config (PORT, JWT, CORS, DB, Security)
│
├── constants/
│   └── index.ts                        # Status/Priority/Role enums + validation helpers
│
├── controllers/
│   ├── auth.controller.ts              # Login, register, refresh, PIN auth
│   ├── project.controller.ts           # Project CRUD, member management
│   ├── task.controller.ts              # Task CRUD, subtasks, status updates
│   ├── comment.controller.ts           # Comment CRUD
│   ├── dailyUpdate.controller.ts       # Daily update management
│   ├── notification.controller.ts      # Notification retrieval
│   ├── activityLog.controller.ts       # Activity log retrieval
│   ├── group.controller.ts             # Group management
│   └── upload.controller.ts            # File upload
│
├── services/                           # Business logic (Source of Truth)
│   ├── auth.service.ts                 # Auth, JWT, PIN, password reset
│   ├── project.service.ts              # Projects, members, RBAC
│   ├── task.service.ts                 # Tasks, subtasks, dependencies
│   ├── comment.service.ts              # Comments, permissions
│   ├── dailyUpdate.service.ts          # Daily updates
│   ├── notification.service.ts         # Notifications, real-time
│   ├── activityLog.service.ts          # Activity logging
│   ├── group.service.ts                # Groups, user/project membership
│   └── attachment.service.ts           # File attachments
│
├── routes/
│   ├── index.ts                        # Main router (combines all routes)
│   ├── auth.routes.ts                  # /auth/*
│   ├── project.routes.ts               # /projects/*
│   ├── task.routes.ts                  # /tasks/*
│   ├── comment.routes.ts               # /comments/*
│   ├── dailyUpdate.routes.ts           # /updates/*
│   ├── notification.routes.ts          # /notifications/*
│   ├── activityLog.routes.ts           # /activities/*
│   ├── group.routes.ts                 # /groups/*
│   └── upload.routes.ts                # /upload/*
│
├── middlewares/
│   ├── auth.middleware.ts              # JWT verification
│   ├── error.middleware.ts             # Global error handler (AppError-aware)
│   ├── rateLimiter.middleware.ts       # Rate limiting
│   └── validate.middleware.ts          # UUID param validation
│
├── utils/
│   ├── AppError.ts                     # Custom error class (statusCode, factory helpers)
│   ├── auth.ts                         # JWT sign/verify, bcrypt helpers
│   └── response.ts                     # sendSuccess(), sendError(), pagination
│
├── types/
│   └── index.ts                        # AuthRequest, LoginRequest, ApiResponse
│
└── jobs/
    ├── dueDateReminder.job.ts          # Due date reminder scheduler
    └── index.ts                        # Job scheduler init
```

### Backend Import Rules

| What | Import From | NOT From |
|------|------------|----------|
| PrismaClient | `import prisma from '../config/database'` | ~~`new PrismaClient()`~~ |
| Status/Priority enums | `import { TASK_STATUSES, PRIORITIES } from '../constants'` | ~~inline arrays~~ |
| Error throwing | `import { AppError, notFound } from '../utils/AppError'` | ~~`throw new Error()`~~ |
| UUID validation | `import { validateUUID } from '../middlewares/validate.middleware'` | ~~manual regex~~ |
| Response helpers | `import { sendSuccess, sendError } from '../utils/response'` | ~~`res.json()` direct~~ |

### Backend Error Handling Pattern

```typescript
// In services: throw AppError
throw new AppError('Task not found', 404);
throw notFound('Project');
throw forbidden('Only project owner can do this');

// In controllers: pass to next()
catch (error) { next(error); }

// error.middleware.ts handles: AppError -> statusCode, Prisma P2002 -> 409, others -> 500
```

---

## Frontend Structure

```
frontend/src/
├── App.tsx                             # Main app + Router
├── main.tsx                            # Entry point (imports shared.css)
├── index.css                           # Global base styles
│
├── types/
│   └── index.ts                        # All entity types (User, Task, Project, etc.)
│
├── constants/
│   ├── index.ts                        # STATUS_CONFIG, PRIORITY_CONFIG, label mappings
│   └── statusIcons.tsx                 # Status icon components (React)
│
├── services/                           # API client layer
│   ├── api.ts                          # Axios instance, interceptors, auth token
│   ├── authService.ts                  # Auth API (login, register, PIN, reset)
│   ├── projectService.ts               # Project API + input types
│   ├── taskService.ts                  # Task API + input types
│   ├── commentService.ts               # Comment API + input types
│   ├── dailyUpdateService.ts           # Daily update API + input types
│   ├── notificationService.ts          # Notification API + input types
│   ├── groupService.ts                 # Group API
│   └── activityLogService.ts           # Activity log API
│
├── store/
│   └── authStore.ts                    # Zustand store (user, tokens, auth actions)
│
├── components/
│   ├── ProtectedRoute.tsx              # Auth route guard
│   ├── Sidebar.tsx                     # Navigation sidebar
│   ├── PinInput.tsx                    # 6-digit PIN input
│   ├── NotificationPopover.tsx         # Notification dropdown
│   ├── GanttChart.tsx                  # Gantt chart visualization
│   └── SubTaskList.tsx                 # Subtask display
│
├── pages/
│   ├── LoginPage.tsx                   # Email/password + PIN login
│   ├── RegisterPage.tsx                # User registration
│   ├── SetupPinPage.tsx                # First-time PIN setup
│   ├── ForgotPasswordPage.tsx          # Password recovery
│   ├── ForgotPinPage.tsx               # PIN recovery
│   ├── DashboardPage.tsx               # Main dashboard
│   ├── ProjectsPage.tsx                # Project list (grid/board/list views)
│   ├── ProjectDetailPage.tsx           # Project detail + task management
│   ├── MyTasksPage.tsx                 # User's task list (kanban + table)
│   ├── TaskDetailModal.tsx             # Task detail modal
│   ├── GroupsPage.tsx                  # Group management
│   ├── CalendarPage.tsx                # Calendar view
│   └── TimelinePage.tsx                # Timeline/Gantt view
│
├── utils/
│   ├── getErrorMessage.ts              # Type-safe error message extraction
│   ├── exportExcel.ts                  # Excel export (Projects, Tasks)
│   └── exportPDF.ts                    # PDF export (Projects, Tasks)
│
├── styles/
│   └── shared.css                      # Shared stat card CSS (used by all pages)
│
└── layouts/                            # Layout components
```

### Frontend Import Rules

| What | Import From | NOT From |
|------|------------|----------|
| Entity types (User, Task, etc.) | `import type { Task } from '../types'` | ~~inline interface~~ |
| Status/Priority config | `import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants'` | ~~local const~~ |
| Status icons | `import { STATUS_ICONS } from '../constants/statusIcons'` | ~~inline icons~~ |
| Error messages | `import { getErrorMessage } from '../utils/getErrorMessage'` | ~~`(error as any).message`~~ |
| API calls | `import { taskService } from '../services/taskService'` | |

### Frontend Type Architecture

```
types/index.ts (Entity types - shared across all files)
  ├── User, Task, Project, Comment, Notification, DailyUpdate, Group, etc.
  ├── TaskStatus, Priority, ProjectStatus (union types)
  ├── UserRef, ProjectRef, TaskRef (lightweight references)
  ├── ProjectMember
  ├── TasksResponse, ProjectsResponse, etc. (paginated)
  └── TaskStats, ProjectStats

services/*.ts (Input types - request-specific, kept in service files)
  ├── CreateTaskInput, UpdateTaskInput
  ├── CreateProjectInput, UpdateProjectInput
  ├── CreateCommentInput, UpdateCommentInput
  └── etc.
```

### Frontend Constants Architecture

```
constants/index.ts
  ├── STATUS_CONFIG        (Task status: color, label, dotColor, badgeColor, tagColor)
  ├── PRIORITY_CONFIG      (Priority: color, bg, label)
  ├── STATUS_COLUMN_ORDER  (Kanban column order)
  ├── GANTT_STATUS_COLORS  (Chart colors for status)
  ├── GANTT_PRIORITY_COLORS (Chart colors for priority)
  ├── PROJECT_STATUS_LABELS (Status -> Thai/English label)
  ├── TASK_STATUS_LABELS   (Task status labels)
  ├── PRIORITY_LABELS      (Priority labels)
  └── PROJECT_COLORS       (Available project color palette)

constants/statusIcons.tsx
  └── STATUS_ICONS         (Status -> React icon component)
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files/Components | PascalCase | `UserProfile.tsx` |
| Functions/Variables | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE`, `STATUS_CONFIG` |
| CSS classes | kebab-case | `stat-card`, `project-detail` |
| API routes | kebab-case | `/api/v1/daily-updates` |
| DB columns | camelCase (Prisma) | `createdAt`, `projectId` |

## API Response Format

```typescript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: 'Error message' }

// Paginated
{ success: true, data: { items: [...], pagination: { page, pageSize, total, totalPages } } }
```

## Shared CSS Architecture

```
styles/shared.css (loaded globally via main.tsx)
  ├── .stats-row          (layout row for stat cards)
  ├── .stat-card          (base card styles)
  ├── .stat-total         (white/default)
  ├── .stat-active        (yellow)
  ├── .stat-todo          (yellow)
  ├── .stat-inprogress    (blue)
  ├── .stat-delay         (red)
  ├── .stat-completed     (green)
  ├── .stat-done          (green)
  ├── .stat-hold          (orange, dark text)
  └── .stat-cancelled     (dark, white text)
```

---

## Key Files Quick Reference

| Need to... | Go to... |
|-----------|---------|
| Add new entity type | `frontend/src/types/index.ts` |
| Add new status/priority | `frontend/src/constants/index.ts` + `backend/src/constants/index.ts` |
| Add new API endpoint | `backend/src/routes/` + `controllers/` + `services/` |
| Add new frontend page | `frontend/src/pages/` + register in `App.tsx` |
| Change database schema | `backend/prisma/schema.prisma` |
| Add stat card variant | `frontend/src/styles/shared.css` |
| Add error type | `backend/src/utils/AppError.ts` |
