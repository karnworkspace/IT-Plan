# 🚀 Production Deployment Guide

## ⚠️ สำคัญ: Migration จาก SQLite ไป PostgreSQL

ตอนนี้โปรเจคใช้ **SQLite** สำหรับการพัฒนาและทดสอบ แต่เมื่อจะขึ้น **Production** จำเป็นต้องเปลี่ยนเป็น **PostgreSQL** เพื่อประสิทธิภาพและความเสถียรที่ดีกว่า

---

## 📋 ขั้นตอนการเตรียม Production Database

### 1. ติดตั้ง PostgreSQL

#### macOS (Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Docker (แนะนำสำหรับ Development/Staging)
```bash
docker run --name taskflow-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=taskflow_db \
  -p 5432:5432 \
  -d postgres:14
```

### 2. สร้าง Database

```bash
# เข้าสู่ PostgreSQL shell
psql -U postgres

# สร้าง database
CREATE DATABASE taskflow_db;

# สร้าง user (optional)
CREATE USER taskflow_user WITH PASSWORD 'your_secure_password';

# ให้สิทธิ์
GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;

# ออกจาก shell
\q
```

### 3. อัพเดท Prisma Schema

แก้ไขไฟล์ `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // เปลี่ยนจาก "sqlite"
}
```

### 4. อัพเดท Environment Variables

แก้ไขไฟล์ `.env`:

```env
# เปลี่ยนจาก SQLite
# DATABASE_URL="file:./dev.db"

# เป็น PostgreSQL
DATABASE_URL="postgresql://taskflow_user:your_secure_password@localhost:5432/taskflow_db?schema=public"
```

**สำหรับ Production Server:**
```env
DATABASE_URL="postgresql://user:password@your-server-ip:5432/taskflow_db?schema=public"
```

### 5. Generate Prisma Client ใหม่

```bash
npm run prisma:generate
```

### 6. รัน Database Migrations

```bash
npm run prisma:migrate
```

หรือถ้าต้องการสร้าง migration ใหม่:
```bash
npx prisma migrate dev --name init
```

### 7. (Optional) Migrate ข้อมูลจาก SQLite

หากมีข้อมูลใน SQLite ที่ต้องการย้าย:

```bash
# Export ข้อมูลจาก SQLite
npx prisma db pull --schema=prisma/schema.sqlite.prisma

# Import ไป PostgreSQL (ต้องเขียน script custom)
# หรือใช้เครื่องมืออย่าง pgloader
```

---

## 🌐 Cloud Database Options (แนะนำสำหรับ Production)

### Option 1: Supabase (Free tier available)
1. สมัครที่ https://supabase.com
2. สร้าง Project ใหม่
3. คัดลอก Connection String
4. อัพเดท `DATABASE_URL` ใน `.env`

### Option 2: Railway (Free tier available)
1. สมัครที่ https://railway.app
2. สร้าง PostgreSQL Database
3. คัดลอก Connection String
4. อัพเดท `DATABASE_URL` ใน `.env`

### Option 3: Neon (Serverless PostgreSQL)
1. สมัครที่ https://neon.tech
2. สร้าง Project ใหม่
3. คัดลอก Connection String
4. อัพเดท `DATABASE_URL` ใน `.env`

### Option 4: AWS RDS
1. สร้าง RDS PostgreSQL instance
2. Configure Security Groups
3. คัดลอก Endpoint
4. อัพเดท `DATABASE_URL` ใน `.env`

---

## 🔒 Production Security Checklist

### Environment Variables
- [ ] เปลี่ยน `JWT_ACCESS_SECRET` เป็นค่าที่ปลอดภัย (random string ยาวๆ)
- [ ] เปลี่ยน `JWT_REFRESH_SECRET` เป็นค่าที่ปลอดภัย
- [ ] ตั้ง `NODE_ENV=production`
- [ ] อัพเดท `CORS_ORIGIN` เป็น domain จริงของ Frontend
- [ ] ใช้ Strong Password สำหรับ Database

### Database
- [ ] Enable SSL/TLS connection
- [ ] ตั้งค่า Connection Pooling
- [ ] Enable Automatic Backups
- [ ] ตั้งค่า Database Firewall Rules

### Application
- [ ] Enable HTTPS
- [ ] ตั้งค่า Rate Limiting ที่เหมาะสม
- [ ] Enable Logging และ Monitoring
- [ ] ตั้งค่า Error Tracking (เช่น Sentry)

---

## 📊 Performance Optimization

### Database Indexes
Prisma Schema มี indexes อยู่แล้ว แต่ตรวจสอบว่าครบถ้วน:
- User: `email`, `id`
- Task: `projectId`, `assigneeId`, `status`, `dueDate`
- Project: `ownerId`
- RefreshToken: `userId`, `token`

### Connection Pooling
แก้ไข `DATABASE_URL` เพื่อเพิ่ม connection pool:
```env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&connection_limit=10&pool_timeout=20"
```

---

## 🚀 Deployment Steps

### 1. Build Application
```bash
npm run build
```

### 2. Set Environment Variables
ตั้งค่า Environment Variables บน Production Server

### 3. Run Migrations
```bash
npm run prisma:migrate
```

### 4. Start Application
```bash
npm start
```

### 5. Verify
```bash
curl https://your-api-domain.com/api/v1/health
```

---

## 📝 Rollback Plan

หากเกิดปัญหาในการ migrate:

1. **Backup Database ก่อนเสมอ:**
```bash
pg_dump taskflow_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. **Restore จาก Backup:**
```bash
psql taskflow_db < backup_20260122_123456.sql
```

3. **Revert Prisma Schema:**
```bash
git checkout HEAD -- prisma/schema.prisma
npm run prisma:generate
```

---

## 🆘 Troubleshooting

### Connection Error
```
Error: Can't reach database server
```
**แก้ไข:**
- ตรวจสอบว่า PostgreSQL รันอยู่
- ตรวจสอบ `DATABASE_URL` ว่าถูกต้อง
- ตรวจสอบ Firewall/Security Groups

### Migration Error
```
Error: Migration failed
```
**แก้ไข:**
- ลบ `prisma/migrations` folder
- รัน `npx prisma migrate dev --name init` ใหม่

### SSL Error
```
Error: SSL connection required
```
**แก้ไข:**
เพิ่ม `?sslmode=require` ใน `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&sslmode=require"
```

---

## 📞 Support

หากพบปัญหาในการ migrate ไป Production:
1. ตรวจสอบ logs: `npm run dev` หรือ `npm start`
2. ดู Prisma documentation: https://www.prisma.io/docs
3. ตรวจสอบ PostgreSQL logs

---

**⚠️ สำคัญ: อย่าลืม Backup Database ก่อนทำการ migrate ทุกครั้ง!**
