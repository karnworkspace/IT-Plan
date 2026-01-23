# Quick Start Guide - Task Management System

**สำหรับ:** Developers ที่เริ่มต้นพัฒนาระบบ
**Last Updated:** 2026-01-22

---

## 📚 เอกสารที่ควรอ่าน

1. **[PROJECT-PROGRESS.md](./PROJECT-PROGRESS.md)** ⭐ อ่านก่อน!
   - สถานะโปรเจคปัจจุบัน
   - สิ่งที่ทำเสร็จแล้ว / ยังไม่เสร็จ
   - แนวทางการทำต่อ

2. **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)**
   - Quick reference สำหรับ AI Agent
   - Commands ที่ใช้บ่อย

3. **[Task-Management-System-Design.md](./Task-Management-System-Design.md)**
   - System Flow, Data Flow, Architecture
   - Database Schema
   - Technology Stack

4. **[API-Specification.md](./API-Specification.md)**
   - API Endpoints
   - Request/Response Format
   - Error Handling

5. **[Development-Workflow.md](./Development-Workflow.md)**
   - Git Workflow
   - Testing Standards
   - Deployment Process

---

## 🚀 Setup Development Environment

### 1. Prerequisites
```bash
# ติดตั้ง Node.js 20+
node --version  # v20.x.x

# SQLite มาพร้อม macOS/Linux แล้ว
# สำหรับ production ใช้ PostgreSQL 15+
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Variables

**Backend `.env` (มีให้แล้ว):**
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (SQLite for dev)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-token-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security Configuration
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=900000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Frontend `.env` (สร้างจาก .env.example):**
```bash
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Setup Database
```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations (สร้าง database)
npx prisma migrate dev

# ดู database ผ่าน GUI
npx prisma studio
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs at http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

### 6. Verify Setup

**Test Backend:**
```bash
curl http://localhost:3000/api/v1/health
# {"success":true,"message":"TaskFlow API is running",...}
```

**Test Frontend:**
- เปิด http://localhost:5173/login

---

## 📁 Project Structure

```
task-management-system/
├── backend/
│   ├── src/
│   │   ├── config/           # Environment, Database config
│   │   ├── controllers/      # HTTP handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Auth, Error, RateLimit
│   │   ├── utils/            # JWT, bcrypt helpers
│   │   ├── types/            # TypeScript interfaces
│   │   └── index.ts          # Express entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # DB migrations
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API client
│   │   ├── store/            # Zustand state
│   │   └── App.tsx           # Router
│   ├── .env.example
│   └── package.json
│
└── Doc/
    ├── PROJECT-PROGRESS.md   # ⭐ Start here
    ├── QUICK-REFERENCE.md
    ├── Quick-Start-Guide.md  # This file
    └── ...
```

---

## 🧪 Testing APIs

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login with Email
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Setup PIN (requires auth token)
```bash
curl -X POST http://localhost:3000/api/v1/auth/setup-pin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "pin": "246813"
  }'
```

### Login with PIN
```bash
curl -X POST http://localhost:3000/api/v1/auth/login-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "pin": "246813"
  }'
```

### Create Project (requires auth token)
```bash
# 1. ดึง access token จาก login ก่อน
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# 2. สร้าง project
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "color": "#1890ff"
  }'
```

### List All Projects
```bash
curl -X GET "http://localhost:3000/api/v1/projects" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Project by ID
```bash
curl -X GET "http://localhost:3000/api/v1/projects/PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Update Project
```bash
curl -X PUT "http://localhost:3000/api/v1/projects/PROJECT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Updated description",
    "status": "ACTIVE"
  }'
```

### Delete Project
```bash
curl -X DELETE "http://localhost:3000/api/v1/projects/PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Project Statistics
```bash
curl -X GET "http://localhost:3000/api/v1/projects/PROJECT_ID/stats" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Common Commands

### Database
```bash
cd backend

# Generate client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name add_new_feature

# Reset database (delete all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio
```

### Development
```bash
# Backend
cd backend
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Run production build

# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Quality
```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🎯 Your First Task

### 1. ทำความเข้าใจระบบ
- [ ] อ่าน `Doc/PROJECT-PROGRESS.md`
- [ ] ดู Database Schema ใน `backend/prisma/schema.prisma`
- [ ] ทดลองใช้ API ผ่าน curl

### 2. Setup Local Environment
- [ ] Clone repository
- [ ] Install dependencies (npm install)
- [ ] Setup database (prisma migrate dev)
- [ ] Run development servers

### 3. Test Integration
- [ ] Register user ผ่าน API
- [ ] ทดสอบ login ผ่าน Frontend
- [ ] ทดสอบ Setup PIN

### 4. พัฒนาต่อ
```bash
# สร้าง branch ใหม่
git checkout -b feature/my-feature

# แก้ไข code
# ...

# Test
npm test

# Commit
git add .
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature
```

---

## 📖 Learning Resources

### Backend
- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)

### Frontend
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🐛 Troubleshooting

### Prisma Client Not Found
```bash
cd backend
npx prisma generate
```

### Database Connection Error
```bash
# Check .env file
cat backend/.env | grep DATABASE_URL

# Reset database
cd backend
npx prisma migrate reset
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit

# Common fixes:
# - unused params: add _ prefix (e.g., _req)
# - type errors: check type definitions
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 💡 Tips

1. **อ่าน PROJECT-PROGRESS.md ก่อน** - เข้าใจสถานะโปรเจค
2. **ใช้ Prisma Studio** - ดู/แก้ไขข้อมูลใน database ง่าย ๆ
3. **Test API ด้วย curl** - ก่อนเชื่อมต่อ Frontend
4. **Commit บ่อย ๆ** - แต่ละ commit ควรมีความหมาย
5. **ถามเมื่อสงสัย** - อย่าติดปัญหานาน > 30 นาที

---

## ✅ Checklist สำหรับ Developer ใหม่

### Day 1
- [ ] Setup development environment
- [ ] อ่าน PROJECT-PROGRESS.md
- [ ] Run ระบบ local ได้
- [ ] ทดสอบ API endpoints

### Week 1
- [ ] ทำความเข้าใจ codebase structure
- [ ] Test Frontend-Backend integration
- [ ] Fix bug เล็ก ๆ 1 อัน

### Week 2
- [ ] Implement feature เล็ก ๆ 1 feature
- [ ] เขียน tests
- [ ] Code review

---

**Last Updated:** 2026-01-22
**Status:** Frontend + Backend Complete, Ready for Integration
**Questions?** ดู Doc/PROJECT-PROGRESS.md
