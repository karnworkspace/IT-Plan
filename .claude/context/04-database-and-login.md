# Database & Login — Complete Context

> **Purpose:** ให้ AI agent ทุก session เข้าใจ Database setup + Login flow ตรงกัน เพื่อป้องกันปัญหาซ้ำ

---

## 1. Database Setup (Local Development)

### Docker PostgreSQL Container

```
Container:  taskflow-db
Image:      postgres:16-alpine
User:       taskflow
Password:   taskflow123
Database:   taskflow                  ← ชื่อ DB จริงที่ใช้งาน
Port:       5432 (host) → 5432 (container)
Volume:     postgres_data (persistent)
```

### Connection String (backend/.env)

```env
DATABASE_URL="postgresql://taskflow:taskflow123@localhost:5432/taskflow?schema=public"
```

### ข้อควรระวัง (CRITICAL)

| ปัญหาที่เคยเกิด | สาเหตุ | วิธีแก้ |
|-----------------|--------|---------|
| DB name ไม่ตรง | `docker-compose.yml` default เป็น `taskflow_dev` แต่ DB จริงชื่อ `taskflow` | ใช้ `taskflow` ใน `.env` เสมอ |
| Backend เชื่อมต่อ DB ไม่ได้ | `.env` ชี้ผิด DB name | ตรวจ `DATABASE_URL` ใน `backend/.env` |
| Prisma migrate deploy ล้มเหลว (P3019) | Migration history ไม่ตรง (เคยใช้ SQLite) | ใช้ `prisma db push` แทน `prisma migrate deploy` |

### Database Commands

```bash
# ตรวจสอบ Docker container
docker ps | grep taskflow

# เช็ค DB name จริง
docker exec taskflow-db psql -U taskflow -c "\l"

# Sync schema (ไม่ใช้ migrate)
cd backend && npx prisma db push

# เปิด DB GUI
cd backend && npx prisma studio

# Generate Prisma Client (หลังแก้ schema)
cd backend && npx prisma generate
```

---

## 2. Backend Server

### Configuration

```
Port:       3000
Entry:      backend/src/index.ts
Config:     backend/src/config/index.ts (reads from .env)
Database:   backend/src/config/database.ts (PrismaClient singleton)
```

### Environment Variables (backend/.env)

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://taskflow:taskflow123@localhost:5432/taskflow?schema=public"
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=900000
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### การรัน Backend

```bash
cd backend
npm run dev                     # ใช้ ts-node-dev (hot reload)
# หรือ
npx tsx src/index.ts            # ใช้ tsx (ถ้า ts-node-dev มีปัญหา)
```

### ข้อควรระวัง — Zombie Process

```
ปัญหา:  Backend process เก่าค้างอยู่บน port 3000 (zombie ts-node-dev)
อาการ:  แก้ .env แล้วไม่มีผล / login ได้บ้างไม่ได้บ้าง
วิธีตรวจ: lsof -i :3000
วิธีแก้:  kill -9 <PID>   แล้ว start ใหม่
สำคัญ:  ถ้าแก้ .env ต้อง restart backend ทุกครั้ง (env ถูกอ่านตอน start เท่านั้น)
```

---

## 3. Frontend Server

### Configuration

```
Port:       5173
Entry:      frontend/src/App.tsx
API Client: frontend/src/services/api.ts (axios instance)
Auth Store: frontend/src/store/authStore.ts (Zustand)
```

### Environment Variables (frontend/.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### ข้อสำคัญ

- **Vite อ่าน .env ตอน start เท่านั้น** — แก้ `.env` แล้วต้อง restart `npm run dev`
- API base URL ต้องลงท้ายด้วย `/api/v1`
- Frontend port 5173 ต้องอยู่ใน backend CORS_ORIGIN

---

## 4. Login Flow (End-to-End)

### Login with Email/Password

```
[User] → [LoginPage.tsx]
  → authStore.loginWithEmail(email, password)
    → authService.loginWithEmail({ email, password })
      → POST /api/v1/auth/login  { email, password }
        → AuthController.login()
          → AuthService.login(email, password)
            1. prisma.user.findUnique({ where: { email } })
            2. Check account lockout (lockedUntil)
            3. comparePassword(password, user.password)  ← bcrypt
            4. Reset loginAttempts, update lastLoginAt
            5. generateAccessToken({ id, email, role })  ← JWT
            6. generateRefreshToken({ id })
            7. Store refreshToken in DB (refresh_tokens table)
            8. Return: { user, accessToken, refreshToken }
      ← Response: { success: true, data: { user, accessToken, refreshToken } }
    ← authStore saves to localStorage + state
  → Navigate to /dashboard
```

### Login with PIN

```
Same flow but:
  → POST /api/v1/auth/login-pin  { email, pin }
  → comparePin(pin, user.pinHash)  ← bcrypt
  → PIN ต้อง setup ก่อน (user.pinHash ต้องไม่เป็น null)
```

### Token Refresh

```
[API Request] → 401 Unauthorized
  → Axios interceptor catches
    → POST /api/v1/auth/refresh { refreshToken }
    → Get new accessToken
    → Retry original request
  → If refresh fails → redirect to /login
```

### Account Lockout

```
- MAX_LOGIN_ATTEMPTS = 5
- ACCOUNT_LOCKOUT_DURATION = 900000ms (15 นาที)
- ผิด 5 ครั้ง → lock account → ต้องรอ 15 นาที
```

---

## 5. Test Accounts (Production Data)

### ผู้ใช้หลักสำหรับทดสอบ

| Name | Email | Password | Role | Notes |
|------|-------|----------|------|-------|
| ธรา (THARAB) | tharab@sena.co.th | 123456 | ADMIN | ใช้ทดสอบหลัก |
| เจียร (CHIAN) | chian@sena.co.th | 123456 | ADMIN | |
| โอม (OHM) | ohm@sena.co.th | 123456 | MEMBER | |
| กาญ (KARN) | karn@sena.co.th | 123456 | MEMBER | |

### ข้อควรระวัง

- **Email ต้องพิมพ์ถูก** — เช่น `tharab` ไม่ใช่ `trarab`
- Password ทุกคนคือ `123456`
- DB มี users ทั้งหมด 77 คน (SENA staff + test accounts)

---

## 6. Troubleshooting Checklist

### Login ไม่ได้ — ตรวจตามลำดับนี้

```
Step 1: ตรวจ Docker DB ทำงานอยู่
  $ docker ps | grep taskflow-db
  → ถ้าไม่มี: docker-compose up -d db

Step 2: ตรวจ Backend ทำงานอยู่
  $ lsof -i :3000
  → ถ้าไม่มี: cd backend && npm run dev
  → ถ้ามีแต่เป็น zombie: kill -9 <PID> แล้ว start ใหม่

Step 3: ตรวจ DATABASE_URL ตรง
  $ cat backend/.env | grep DATABASE_URL
  → ต้องเป็น: postgresql://taskflow:taskflow123@localhost:5432/taskflow?schema=public
  → ห้ามเป็น: taskflow_dev (ชื่อ DB ผิด)

Step 4: ทดสอบ API ตรง
  $ curl http://localhost:3000/api/v1/health
  → ต้องได้: { "success": true, "message": "TaskFlow API is running" }

Step 5: ทดสอบ Login ตรง
  $ curl -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"tharab@sena.co.th","password":"123456"}'
  → ต้องได้: { "success": true, "data": { "user": { "name": "ธรา" }, ... } }

Step 6: ตรวจ Frontend .env
  $ cat frontend/.env
  → ต้องเป็น: VITE_API_URL=http://localhost:3000/api/v1
  → ถ้าแก้แล้วต้อง restart npm run dev

Step 7: ตรวจ CORS
  → Backend CORS_ORIGIN ต้องมี http://localhost:5173
```

### Prisma ปัญหา

```
P3019 (migration mismatch):
  → ใช้ `npx prisma db push` แทน `npx prisma migrate deploy`
  → เพราะ migration history มี SQLite history ค้างอยู่

Schema ไม่ sync:
  → cd backend && npx prisma db push
  → แล้ว npx prisma generate
```

### Port ถูกใช้อยู่แล้ว

```bash
# ตรวจว่า port ถูกใช้โดย process อะไร
lsof -i :3000
lsof -i :5173

# Kill zombie process
kill -9 <PID>
```

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                    │
│                    http://localhost:5173                      │
│                                                              │
│  LoginPage.tsx → authStore (Zustand) → authService           │
│        ↓              ↓                    ↓                 │
│  PinInput.tsx    localStorage         api.ts (axios)         │
│                  ├─ accessToken        baseURL: :3000/api/v1 │
│                  └─ refreshToken       + Bearer token header │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express + TypeScript)               │
│                  http://localhost:3000                        │
│                                                              │
│  app.ts → routes/index.ts → auth.routes.ts                   │
│                                  ↓                           │
│                        auth.controller.ts                    │
│                                  ↓                           │
│                         auth.service.ts                      │
│                          ├─ bcrypt (password/PIN hash)       │
│                          ├─ JWT (access + refresh tokens)    │
│                          └─ Prisma (DB queries)              │
│                                                              │
│  Middleware:                                                  │
│  ├─ CORS (origin: localhost:5173,5174)                       │
│  ├─ Rate Limiter (auth endpoints)                            │
│  ├─ Auth Middleware (JWT verify → req.user)                   │
│  └─ Error Handler                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │ Prisma ORM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL (Docker Container)                    │
│              taskflow-db:5432                                 │
│                                                              │
│  Database: taskflow                                          │
│  User:     taskflow                                          │
│  Password: taskflow123                                       │
│                                                              │
│  Tables:                                                     │
│  ├─ users (77 records) ← email+bcrypt password+PIN           │
│  ├─ refresh_tokens ← JWT refresh tokens                      │
│  ├─ projects (25 records)                                    │
│  ├─ project_members (38 records)                             │
│  ├─ tasks (68 records)                                       │
│  ├─ comments, daily_updates, notifications                   │
│  ├─ activity_logs, attachments                               │
│  └─ groups, group_members, group_projects                    │
│                                                              │
│  Volume: postgres_data (persistent across restarts)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Key Files Reference

| File | Purpose |
|------|---------|
| `backend/.env` | Database URL, JWT secrets, CORS origins |
| `backend/src/config/index.ts` | Reads .env → config object |
| `backend/src/config/database.ts` | PrismaClient singleton |
| `backend/src/services/auth.service.ts` | Login/Register/PIN business logic |
| `backend/src/controllers/auth.controller.ts` | Request handlers |
| `backend/src/routes/auth.routes.ts` | Auth API endpoints |
| `backend/src/middlewares/auth.middleware.ts` | JWT verify middleware |
| `backend/src/utils/auth.ts` | bcrypt + JWT helpers |
| `backend/prisma/schema.prisma` | Database schema (source of truth) |
| `frontend/.env` | API base URL |
| `frontend/src/services/api.ts` | Axios instance + interceptors |
| `frontend/src/services/authService.ts` | Auth API client |
| `frontend/src/store/authStore.ts` | Auth state (Zustand) |
| `docker-compose.yml` | Docker services definition |

---

## 9. สิ่งที่ AI Agent ต้องทำเสมอก่อนแก้ปัญหา Login

1. **ตรวจ Docker** — `docker ps` ดูว่า `taskflow-db` ทำงานอยู่
2. **ตรวจ .env** — อ่าน `backend/.env` ดูว่า `DATABASE_URL` ชี้ไปที่ `taskflow` (ไม่ใช่ `taskflow_dev`)
3. **ตรวจ zombie process** — `lsof -i :3000` ดูว่าไม่มี process เก่าค้าง
4. **ตรวจ frontend .env** — อ่าน `frontend/.env` ดูว่า `VITE_API_URL` ชี้ `localhost:3000`
5. **ทดสอบ health check** — `curl localhost:3000/api/v1/health` ก่อนทำอย่างอื่น
6. **ห้ามเปลี่ยน .env โดยไม่บอก user** — ทุกการแก้ .env ต้องแจ้งก่อน
7. **ห้ามแก้ DATABASE_URL ชี้ไป production** — local dev ใช้ localhost เท่านั้น
