# Database Schema — TaskFlow

> **Source of Truth:** `backend/prisma/schema.prisma`
> **ORM:** Prisma (PostgreSQL)
> **Schema Sync:** `npx prisma db push` (ไม่ใช้ migrate เพราะ history ไม่สะอาด)

---

## Entity Relationship Diagram

```
[User] 1──* [RefreshToken]
[User] 1──* [Project] (owner)
[User] 1──* [ProjectMember]
[User] 1──* [Task] (assignee)
[User] 1──* [Task] (creator)
[User] 1──* [Comment]
[User] 1──* [Notification]
[User] 1──* [ActivityLog]
[User] 1──* [GroupMember]

[Project] 1──* [ProjectMember]
[Project] 1──* [Task]
[Project] 1──* [Notification]
[Project] 1──* [ActivityLog]
[Project] 1──* [GroupProject]

[Task] 1──* [Task] (sub-tasks, self-referencing)
[Task] 1──* [Comment]
[Task] 1──* [DailyUpdate]
[Task] 1──* [Notification]
[Task] 1──* [ActivityLog]

[Comment] 1──* [Attachment]

[Group] 1──* [GroupMember]
[Group] 1──* [GroupProject]
```

---

## Tables

### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, auto | User ID |
| email | String | UNIQUE | Login email |
| password | String | NOT NULL | bcrypt hashed password |
| name | String | NOT NULL | Display name |
| role | String | default "MEMBER" | "ADMIN" or "MEMBER" |
| pinHash | String? | nullable | bcrypt hashed 6-digit PIN |
| pinSetAt | DateTime? | nullable | When PIN was set |
| loginAttempts | Int | default 0 | Failed login counter |
| lockedUntil | DateTime? | nullable | Account lockout expiry |
| lastLoginAt | DateTime? | nullable | Last successful login |
| passwordResetToken | String? | nullable | SHA256 hashed reset token |
| passwordResetExpires | DateTime? | nullable | Token expiry |
| pinResetToken | String? | nullable | SHA256 hashed PIN reset token |
| pinResetExpires | DateTime? | nullable | Token expiry |
| createdAt | DateTime | auto | Created timestamp |
| updatedAt | DateTime | auto | Updated timestamp |

**Current data:** 77 users (SENA staff + test accounts)

### refresh_tokens
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Token ID |
| token | String | UNIQUE | JWT refresh token |
| userId | String | FK → users.id | Token owner |
| expiresAt | DateTime | | 7 days from creation |
| createdAt | DateTime | auto | Created timestamp |

### projects
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Project ID |
| name | String | NOT NULL | Project name |
| description | String? | nullable | Project description |
| color | String | default "#1890ff" | UI color |
| icon | String? | nullable | Icon identifier |
| status | String | default "ACTIVE" | ACTIVE, DELAY, COMPLETED, HOLD, CANCELLED, POSTPONE, ARCHIVED |
| startDate | DateTime? | nullable | Project start |
| endDate | DateTime? | nullable | Project end |
| ownerId | String | FK → users.id | Project owner |
| createdAt | DateTime | auto | |
| updatedAt | DateTime | auto | |

**Current data:** 25 projects

### project_members
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| projectId | String | FK → projects.id | |
| userId | String | FK → users.id | |
| role | String | default "MEMBER" | OWNER, ADMIN, MEMBER |
| joinedAt | DateTime | auto | |

**Unique constraint:** (projectId, userId) — one membership per user per project

### tasks
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| title | String | NOT NULL | Task title |
| description | String? | nullable | |
| status | String | default "TODO" | TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED, HOLD, CANCELLED |
| priority | String | default "MEDIUM" | LOW, MEDIUM, HIGH, URGENT |
| projectId | String | FK → projects.id | |
| assigneeId | String? | FK → users.id | Assigned user |
| createdById | String | FK → users.id | Creator |
| parentTaskId | String? | FK → tasks.id (self) | Parent for sub-tasks |
| dueDate | DateTime? | nullable | |
| startDate | DateTime? | nullable | |
| progress | Int | default 0, 0-100 | Task completion % |
| createdAt | DateTime | auto | |
| updatedAt | DateTime | auto | |

**Current data:** 68 tasks

### daily_updates
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PK |
| taskId | String | FK → tasks.id |
| date | DateTime | Update date |
| progress | Int | 0-100 |
| status | String | Task status at time of update |
| notes | String? | Update notes |

### comments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PK |
| taskId | String | FK → tasks.id |
| userId | String | FK → users.id |
| content | String | Comment text |
| createdAt/updatedAt | DateTime | Timestamps |

### attachments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PK |
| commentId | String | FK → comments.id |
| filename | String | Original filename |
| path | String | Server file path |
| mimetype | String | MIME type |
| size | Int | File size in bytes |

### notifications
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PK |
| userId | String | FK → users.id |
| type | String | TASK_ASSIGNED, TASK_DUE_SOON, etc. |
| title | String | Notification title |
| message | String | Notification body |
| isRead | Boolean | default false |
| projectId | String? | Related project |
| taskId | String? | Related task |

### activity_logs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PK |
| userId | String | FK → users.id |
| action | String | CREATED, UPDATED, DELETED, etc. |
| entityType | String | "task", "project", "comment" |
| entityId | String | ID of affected entity |
| metadata | String? | JSON string for additional data |
| projectId | String? | Related project |
| taskId | String? | Related task |

### groups / group_members / group_projects
| Table | Purpose |
|-------|---------|
| groups | User/Project groups (name, description, type, color) |
| group_members | Many-to-many: groups ↔ users |
| group_projects | Many-to-many: groups ↔ projects |

---

## Type Constants

```typescript
UserRole:           "ADMIN" | "MEMBER"
ProjectStatus:      "ACTIVE" | "DELAY" | "COMPLETED" | "HOLD" | "CANCELLED" | "POSTPONE" | "ARCHIVED"
ProjectMemberRole:  "OWNER" | "ADMIN" | "MEMBER"
TaskStatus:         "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "BLOCKED" | "HOLD" | "CANCELLED"
Priority:           "LOW" | "MEDIUM" | "HIGH" | "URGENT"
NotificationType:   "TASK_ASSIGNED" | "TASK_DUE_SOON" | "TASK_OVERDUE" | "TASK_COMPLETED" | "COMMENT_ADDED" | "PROJECT_INVITE" | "DAILY_REMINDER"
ActivityType:       "CREATED" | "UPDATED" | "DELETED" | "ASSIGNED" | "COMPLETED" | "COMMENTED"
GroupType:           "USER_GROUP" | "PROJECT_GROUP"
```

---

## Indexes

- `users.email` — UNIQUE (login lookup)
- `refresh_tokens.token` — UNIQUE
- `refresh_tokens.userId` — INDEX
- `projects.ownerId` — INDEX
- `project_members.(projectId, userId)` — UNIQUE + INDEX each
- `tasks.(projectId, assigneeId, createdById, status, dueDate, parentTaskId)` — INDEX each
- `daily_updates.(taskId, date)` — INDEX each
- `comments.(taskId, userId)` — INDEX each
- `notifications.(userId, isRead, createdAt)` — INDEX each
- `activity_logs.(userId, projectId, taskId, createdAt)` — INDEX each

---

## Notes

- ใช้ UUID เป็น primary key ทุก table
- ทุก table มี createdAt (auto)
- Cascade delete — ลบ parent → ลบ children (เช่น ลบ project → ลบ tasks, members ทั้งหมด)
- Tasks มี self-referencing (parentTaskId) สำหรับ sub-tasks
- Password/PIN ใช้ bcrypt hash — ไม่เก็บ plaintext
