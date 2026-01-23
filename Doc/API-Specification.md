# API Specification - Task Management System

**Version:** 1.0  
**Base URL:** `https://api.taskmanagement.com/v1`  
**Authentication:** Bearer Token (JWT)

---

## Authentication

### POST /auth/login
เข้าสู่ระบบ

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "pm"
    }
  }
}
```

---

## Projects

### GET /projects
ดึงรายการโปรเจคทั้งหมด

**Query Parameters:**
- `status` (optional): active, completed, on_hold, cancelled
- `owner_id` (optional): UUID
- `page` (optional): default 1
- `limit` (optional): default 20

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "SENA 360 Revamp",
        "description": "...",
        "status": "active",
        "start_date": "2026-01-01",
        "end_date": "2026-12-31",
        "owner": {
          "id": "uuid",
          "name": "KARN"
        },
        "stats": {
          "total_tasks": 50,
          "completed_tasks": 20,
          "progress": 40
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

### POST /projects
สร้างโปรเจคใหม่

**Request:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "owner_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Project",
    "status": "active",
    "created_at": "2026-01-22T10:00:00Z"
  }
}
```

---

## Tasks

### GET /projects/:projectId/tasks
ดึงรายการ tasks ในโปรเจค

**Query Parameters:**
- `status` (optional): todo, in_progress, review, done, blocked
- `assigned_to` (optional): UUID
- `priority` (optional): low, medium, high, urgent
- `due_date_from` (optional): YYYY-MM-DD
- `due_date_to` (optional): YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Design Database Schema",
        "description": "...",
        "status": "in_progress",
        "priority": "high",
        "assigned_to": {
          "id": "uuid",
          "name": "John Doe"
        },
        "due_date": "2026-01-25",
        "progress": 60,
        "created_at": "2026-01-20T10:00:00Z"
      }
    ]
  }
}
```

### POST /projects/:projectId/tasks
สร้าง task ใหม่

**Request:**
```json
{
  "title": "Implement API",
  "description": "Create REST API endpoints",
  "assigned_to": "uuid",
  "priority": "high",
  "start_date": "2026-01-22",
  "due_date": "2026-01-30",
  "estimated_hours": 40
}
```

### PUT /tasks/:taskId
อัพเดท task

**Request:**
```json
{
  "status": "in_progress",
  "progress": 50,
  "actual_hours": 20
}
```

### POST /tasks/:taskId/updates
เพิ่ม daily update

**Request:**
```json
{
  "status": "in_progress",
  "progress": 70,
  "notes": "Completed API design, started implementation",
  "hours_spent": 5,
  "blockers": "Waiting for database schema approval"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "task_id": "uuid",
    "progress": 70,
    "update_date": "2026-01-22",
    "created_at": "2026-01-22T16:30:00Z"
  }
}
```

---

## Notifications

### GET /notifications
ดึงการแจ้งเตือนของผู้ใช้

**Query Parameters:**
- `read` (optional): true/false
- `type` (optional): due_soon, overdue, status_change, assignment
- `limit` (optional): default 50

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "due_soon",
        "title": "Task due in 2 days",
        "message": "Design Database Schema is due on 2026-01-25",
        "task": {
          "id": "uuid",
          "title": "Design Database Schema"
        },
        "read_at": null,
        "created_at": "2026-01-23T09:00:00Z"
      }
    ]
  }
}
```

### PUT /notifications/:id/read
ทำเครื่องหมายว่าอ่านแล้ว

---

## Analytics

### GET /analytics/projects/:projectId
ดึงสถิติโปรเจค

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_tasks": 50,
      "completed_tasks": 20,
      "in_progress_tasks": 25,
      "blocked_tasks": 5,
      "on_time_completion_rate": 85,
      "average_task_duration": 3.5
    },
    "timeline": {
      "start_date": "2026-01-01",
      "end_date": "2026-12-31",
      "current_progress": 40,
      "projected_completion": "2026-11-15"
    },
    "team_performance": [
      {
        "user": {
          "id": "uuid",
          "name": "John Doe"
        },
        "assigned_tasks": 10,
        "completed_tasks": 7,
        "completion_rate": 70
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "due_date",
      "message": "Due date must be after start date"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Limit:** 100 requests per minute per user
- **Header:** `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Webhooks (Future)

### POST /webhooks
รับ webhook events

**Events:**
- `task.created`
- `task.updated`
- `task.completed`
- `task.overdue`
- `project.completed`
