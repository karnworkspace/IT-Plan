# TaskFlow Backend API

Backend API สำหรับระบบจัดการงาน TaskFlow พัฒนาด้วย Node.js, Express, TypeScript, Prisma และ PostgreSQL

## 📋 สารบัญ

- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า](#การตั้งค่า)
- [การรัน](#การรัน)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

## 🛠 เทคโนโลยีที่ใช้

- **Node.js** - JavaScript Runtime
- **Express** - Web Framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - ORM (Object-Relational Mapping)
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password/PIN Hashing

## 📦 การติดตั้ง

### ข้อกำหนดเบื้องต้น

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. คัดลอกไฟล์ environment variables:
```bash
cp .env.example .env
```

3. แก้ไขไฟล์ `.env` ตามความเหมาะสม (โดยเฉพาะ `DATABASE_URL`)

## ⚙️ การตั้งค่า

### Environment Variables

แก้ไขไฟล์ `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_db?schema=public"

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

### Database Setup

1. สร้าง PostgreSQL database:
```bash
createdb taskflow_db
```

2. รัน Prisma migrations:
```bash
npm run prisma:migrate
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. (Optional) เปิด Prisma Studio เพื่อดู database:
```bash
npm run prisma:studio
```

## 🚀 การรัน

### Development Mode

```bash
npm run dev
```

Server จะรันที่ `http://localhost:3000`

### Production Mode

1. Build TypeScript:
```bash
npm run build
```

2. Start server:
```bash
npm start
```

## 📡 API Endpoints

### Health Check

```
GET /api/v1/health
```

### Authentication

#### Register
```
POST /api/v1/auth/register
Body: { email, password, name }
```

#### Login (Email/Password)
```
POST /api/v1/auth/login
Body: { email, password }
```

#### Login (PIN)
```
POST /api/v1/auth/login-pin
Body: { email, pin }
```

#### Setup PIN
```
POST /api/v1/auth/setup-pin
Headers: Authorization: Bearer <access_token>
Body: { pin, confirmPin }
```

#### Change PIN
```
POST /api/v1/auth/change-pin
Headers: Authorization: Bearer <access_token>
Body: { currentPin, newPin, confirmNewPin }
```

#### Reset PIN
```
POST /api/v1/auth/reset-pin
Headers: Authorization: Bearer <access_token>
Body: { password }
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Body: { refreshToken }
```

#### Logout
```
POST /api/v1/auth/logout
Body: { refreshToken }
```

#### Get Current User
```
GET /api/v1/auth/me
Headers: Authorization: Bearer <access_token>
```

## 🗄 Database Schema

### User
- Authentication (Email/Password + PIN)
- Account Security (Login attempts, Account lockout)
- User roles (ADMIN, MEMBER)

### Project
- Project management
- Project members
- Project status

### Task
- Task details
- Task status (TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED)
- Priority levels
- Due dates

### DailyUpdate
- Daily progress tracking
- Status updates

### Notification
- Task notifications
- Due date reminders

### ActivityLog
- User activity tracking
- Audit trail

## 🔒 Security Features

- **Password Hashing**: Bcrypt with configurable rounds
- **PIN Validation**: 6-digit PIN with security rules
- **JWT Authentication**: Access + Refresh token strategy
- **Rate Limiting**: Prevent brute force attacks
- **Account Lockout**: Automatic lockout after failed attempts
- **CORS Protection**: Configurable origin whitelist

## 📝 Scripts

- `npm run dev` - รัน development server พร้อม hot reload
- `npm run build` - Build TypeScript เป็น JavaScript
- `npm start` - รัน production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - รัน database migrations
- `npm run prisma:studio` - เปิด Prisma Studio

## 📚 เอกสารเพิ่มเติม

- [API Specification](../Doc/API-Specification.md)
- [Static PIN Login Guide](../Doc/Static-PIN-Login-Guide.md)
- [Development Workflow](../Doc/Development-Workflow.md)
- [System Design](../Doc/Task-Management-System-Design.md)

## 🤝 Contributing

ดูรายละเอียดใน [Development Workflow](../Doc/Development-Workflow.md)

## 📄 License

ISC
