# CLAUDE.md - YTY Project

## ก่อนเริ่มงาน (บังคับ)

1. อ่าน `Doc/PROJECT-PROGRESS.md` ← สถานะปัจจุบัน + Phase ล่าสุด
2. อ่าน `Doc/QUICK-REFERENCE.md` ← Quick ref, commands, features
3. Phase 1-11 archive อยู่ที่ `Doc/PROGRESS-ARCHIVE.md` (อ่านเมื่อต้องการเท่านั้น)

## การบันทึกความคืบหน้า

เมื่อผู้ใช้สั่ง "update progress":
1. อัปเดต `Doc/PROJECT-PROGRESS.md` (บังคับ)
2. อัปเดต `Doc/QUICK-REFERENCE.md` (ถ้าเกี่ยวข้อง)

## รูปแบบการสนทนา

- **ภาษาหลัก:** ไทย กระชับ ตรงประเด็น
- ศัพท์เทคนิคใช้ภาษาอังกฤษได้
- ตอบสั้นก่อน ขยายเมื่อจำเป็น

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18 + Vite + TypeScript + Ant Design 6.x + Zustand |
| Backend | Express 5.x + TypeScript + Prisma 5.10.2 |
| Database | PostgreSQL 16 (Docker) |
| Auth | JWT (access 15min, refresh 7day) + bcrypt + PIN |

## Quick Start

```bash
# Docker (แนะนำ)
docker-compose up -d
# Frontend: http://localhost:5173 | Backend: http://localhost:3001

# Local
cd backend && npm run dev   # http://localhost:3000
cd frontend && npm run dev  # http://localhost:5173

# Database
cd backend
npx prisma db push       # Sync schema (ใช้แทน migrate)
npx prisma generate      # Generate client
npx prisma studio        # DB GUI
```

## Test Accounts
- `tharab@sena.co.th` / `123456` (ADMIN)
- `ohm@sena.co.th` / `123456` (MEMBER)

---

## Architecture

```
backend/src/
├── services/        ← Business logic (Source of Truth)
├── controllers/     ← HTTP handlers
├── routes/          ← API endpoints
├── middlewares/      ← Auth, Error, Validation
├── constants/       ← Status/Priority/Role enums
├── utils/           ← JWT, bcrypt, AppError, response
└── config/          ← Environment, PrismaClient singleton

frontend/src/
├── pages/           ← Page components (UI)
├── components/      ← Reusable components
├── services/        ← API clients
├── store/           ← Zustand state
├── types/           ← Centralized TypeScript types
├── constants/       ← Status config, colors, icons
├── styles/          ← shared.css (stat cards)
└── utils/           ← Export Excel/PDF, error handling
```

## Development Order

Backend: `schema.prisma` → `services/` → `controllers/` → `routes/`
Frontend: `services/` → `components/` → `pages/`

---

## Coding Standards

- **Naming:** PascalCase (files/components), camelCase (functions), UPPER_SNAKE (constants)
- **TypeScript:** strict mode, avoid `any`, unused params use `_` prefix
- **API Response:** `{ success: true, data: {...} }` or `{ success: false, error: 'message' }`
- **DB Schema sync:** Use `prisma db push` NOT `prisma migrate deploy`

## Git Conventions

```
<type>(<scope>): <subject>
Types: feat, fix, docs, refactor, test, chore
```

## Best Practices

- อ่าน PROJECT-PROGRESS.md ก่อนเริ่มงาน
- Validate input, Handle errors, Use env vars
- ห้าม commit: API keys, passwords, .env files
- อัปเดต docs หลังทำงานเสร็จ
- `backend/src/services/` = Source of Truth for business logic

## AI Agent Principles

- **ภาษา:** ไทย + English technical terms
- **Ask Before Action:** อธิบาย significant changes ก่อนทำ
- **Scripts over Manual:** ใช้ ts-node scripts ตรวจ DB data
- **Doc/` = Truth**, `services/` = Business Logic Truth

---

**Last Updated:** 2026-02-15
