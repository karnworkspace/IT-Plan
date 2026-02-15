# System Architecture — TaskFlow (YTY Project)

## Overview

TaskFlow คือระบบ Task/Project Management สำหรับ SENA Development ใช้ภายในองค์กร
ออกแบบเป็น Full Stack Web App — React frontend + Express backend + PostgreSQL database
รันแบบ local development ด้วย Docker (DB) + npm (frontend/backend)

## Architecture Diagram

```
┌──────────────────────────────┐
│   Frontend (React + Vite)    │ :5173
│   Ant Design + Custom CSS    │
│   Zustand (State)            │
│   Axios (API Client)         │
└──────────┬───────────────────┘
           │ REST API (JSON)
           ▼
┌──────────────────────────────┐
│   Backend (Express + TS)     │ :3000
│   Prisma ORM                 │
│   JWT Auth + bcrypt          │
│   Rate Limiting + CORS       │
└──────────┬───────────────────┘
           │ Prisma Client
           ▼
┌──────────────────────────────┐
│   PostgreSQL 16 (Docker)     │ :5432
│   Container: taskflow-db     │
│   Database: taskflow         │
│   77 users, 25 projects      │
└──────────────────────────────┘
```

## Components

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Ant Design 5 + Custom CSS (Minimal UI V1 style)
- **State Management:** Zustand
- **HTTP Client:** Axios (with JWT interceptor + auto-refresh)
- **Drag & Drop:** @hello-pangea/dnd
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma (PostgreSQL)
- **Authentication:** JWT (access + refresh tokens) + bcrypt
- **Rate Limiting:** express-rate-limit
- **File Upload:** multer

### Database
- **Engine:** PostgreSQL 16 Alpine (Docker container)
- **Container Name:** taskflow-db
- **Database Name:** taskflow
- **Credentials:** taskflow / taskflow123
- **Port:** 5432
- **Schema Management:** Prisma (`prisma db push`)

### Infrastructure
- **Local Dev:** Docker (DB only) + npm (frontend/backend)
- **No Cloud Deployment** — local development only (Vercel removed)

## API Design

- **Base URL:** `http://localhost:3000/api/v1`
- **Auth:** Bearer JWT token in Authorization header
- **Response Format:** `{ success: boolean, data?: T, error?: string }`
- **Rate Limiting:** Auth endpoints have stricter limits

### API Routes
| Route | Description |
|-------|-------------|
| `/api/v1/auth/*` | Authentication (login, register, PIN, refresh) |
| `/api/v1/projects/*` | Project CRUD + members |
| `/api/v1/projects/:id/tasks/*` | Task CRUD |
| `/api/v1/projects/:id/tasks/:id/comments/*` | Comments |
| `/api/v1/projects/:id/tasks/:id/daily-updates/*` | Daily updates |
| `/api/v1/notifications/*` | User notifications |
| `/api/v1/groups/*` | Groups management |
| `/api/v1/upload/*` | File upload |

## Security

- **Authentication:** JWT (15m access + 7d refresh)
- **Password Hashing:** bcrypt (10 rounds)
- **PIN Authentication:** bcrypt hashed 6-digit PIN
- **Account Lockout:** 5 failed attempts → 15 min lockout
- **Authorization:** Role-based (ADMIN / MEMBER)
- **CORS:** Restricted to localhost:5173, localhost:5174

## Data Flow (Login)

1. User enters email + password on LoginPage
2. Frontend calls `POST /api/v1/auth/login`
3. Backend finds user by email, verifies bcrypt password
4. Generates JWT access token (15m) + refresh token (7d)
5. Stores refresh token in DB
6. Returns tokens + user info to frontend
7. Frontend stores tokens in localStorage + Zustand state
8. Subsequent API calls use Bearer token
9. On 401, interceptor tries refresh; if fails → redirect to /login

## File Structure (Key Paths)

```
backend/
├── .env                          ← DATABASE_URL, JWT secrets
├── src/
│   ├── config/
│   │   ├── index.ts              ← Config from env vars
│   │   └── database.ts           ← PrismaClient singleton
│   ├── services/                 ← Business Logic (Source of Truth)
│   ├── controllers/              ← Request handlers
│   ├── routes/                   ← API route definitions
│   ├── middlewares/              ← Auth, Error, Rate Limit
│   └── utils/                    ← JWT, bcrypt helpers
└── prisma/
    └── schema.prisma             ← Database schema

frontend/
├── .env                          ← VITE_API_URL
├── src/
│   ├── services/
│   │   ├── api.ts                ← Axios instance + interceptors
│   │   └── authService.ts        ← Auth API client
│   ├── store/
│   │   └── authStore.ts          ← Auth state (Zustand)
│   ├── pages/                    ← Page components
│   ├── components/               ← Reusable components
│   ├── hooks/                    ← Custom hooks
│   ├── constants/                ← Status/Priority configs
│   └── types/                    ← TypeScript types
```
