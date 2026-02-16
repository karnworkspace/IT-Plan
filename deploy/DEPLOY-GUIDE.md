# Deployment Guide — YTY Project (TaskFlow)

> คู่มือ deploy ระบบ TaskFlow ลง Ubuntu Server แบบ step-by-step
> Server spec: Ubuntu 24.04.3 LTS, Intel Xeon E-2334, 2 vCPU, 58.5 GB disk

---

## สารบัญ

1. [เตรียม Server](#step-1-เตรียม-server)
2. [ติดตั้ง Docker](#step-2-ติดตั้ง-docker)
3. [Clone โปรเจค](#step-3-clone-โปรเจค)
4. [ตั้งค่า Environment Variables](#step-4-ตั้งค่า-environment-variables)
5. [Build & Run (Production)](#step-5-build--run-production)
6. [Prisma — Sync Database](#step-6-prisma--sync-database)
7. [Seed ข้อมูลเริ่มต้น](#step-7-seed-ข้อมูลเริ่มต้น)
8. [ตั้งค่า Nginx Reverse Proxy (Host)](#step-8-ตั้งค่า-nginx-reverse-proxy-host)
9. [SSL Certificate (HTTPS)](#step-9-ssl-certificate-https)
10. [Firewall (UFW)](#step-10-firewall-ufw)
11. [ตรวจสอบระบบ](#step-11-ตรวจสอบระบบ)
12. [Backup & Maintenance](#step-12-backup--maintenance)
13. [Troubleshooting](#step-13-troubleshooting)

---

## Step 1: เตรียม Server

### 1.1 อัปเดต OS

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 ติดตั้ง packages พื้นฐาน

```bash
sudo apt install -y curl git wget unzip htop net-tools ufw
```

### 1.3 สร้าง deploy user (ไม่ใช้ root)

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy
```

### 1.4 ตั้ง timezone

```bash
sudo timedatectl set-timezone Asia/Bangkok
date   # ยืนยันว่าเป็นเวลาไทย
```

---

## Step 2: ติดตั้ง Docker

### 2.1 ติดตั้ง Docker Engine

```bash
# ลบ Docker เก่า (ถ้ามี)
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null

# เพิ่ม Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# เพิ่ม Docker repo
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# ติดตั้ง
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2.2 ให้ user ใช้ Docker ได้โดยไม่ต้อง sudo

```bash
sudo usermod -aG docker $USER
newgrp docker

# ทดสอบ
docker --version
docker compose version
```

---

## Step 3: Clone โปรเจค

```bash
cd /home/deploy
git clone <YOUR_GIT_REPO_URL> taskflow
cd taskflow
```

> ถ้าใช้ SSH key:
> ```bash
> ssh-keygen -t ed25519 -C "deploy@server"
> cat ~/.ssh/id_ed25519.pub
> # เพิ่ม public key ใน GitHub → Settings → SSH Keys
> ```

---

## Step 4: ตั้งค่า Environment Variables

### 4.1 สร้าง .env สำหรับ Production

```bash
cp docker/.env.example .env
```

### 4.2 แก้ไข .env — ค่าสำคัญที่ต้องเปลี่ยน

```bash
nano .env
```

```env
# ===== DATABASE =====
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=<STRONG_PASSWORD_HERE>     # ❗ เปลี่ยนจาก taskflow123
POSTGRES_DB=taskflow
POSTGRES_PORT=5432

# ===== BACKEND =====
BACKEND_PORT=4201                                  # ❗ host port → container 3000
JWT_ACCESS_SECRET=<RANDOM_64_CHAR_STRING>          # ❗ สร้างใหม่
JWT_REFRESH_SECRET=<RANDOM_64_CHAR_STRING>         # ❗ สร้างใหม่
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ===== FRONTEND =====
FRONTEND_PORT=4200                                 # ❗ host port → container 80
VITE_API_URL=http://<YOUR_SERVER_IP>:4201/api/v1   # ❗ ใส่ IP จริง

# ===== CORS =====
CORS_ORIGIN=http://<YOUR_SERVER_IP>:4200           # ❗ ใส่ IP/Domain จริง
```

### 4.3 สร้าง JWT Secret แบบ random

```bash
# สร้าง 64 ตัวอักษร random สำหรับ JWT
openssl rand -hex 32
# รันสองครั้ง — ใช้สำหรับ ACCESS_SECRET และ REFRESH_SECRET
```

### 4.4 สร้าง backend/.env สำหรับ Prisma CLI (ใช้ตอน seed)

```bash
cat > backend/.env << 'EOF'
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://taskflow:<SAME_PASSWORD>@localhost:5432/taskflow?schema=public"
JWT_ACCESS_SECRET=<SAME_AS_ABOVE>
JWT_REFRESH_SECRET=<SAME_AS_ABOVE>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://<YOUR_SERVER_IP>
EOF
```

> **หมายเหตุ:** backend/.env ใช้ `localhost:5432` เพราะ Prisma CLI รันจาก host
> ส่วน docker-compose.prod.yml ใช้ `postgres:5432` (Docker network name)

---

## Step 5: Build & Run (Production)

### 5.1 Build และ Start ทุก service

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 5.2 ตรวจสอบ status

```bash
docker compose -f docker-compose.prod.yml ps
```

**ผลลัพธ์ที่คาดหวัง:**

| Container | Status | Port |
|-----------|--------|------|
| taskflow-db-prod | healthy | 5432 |
| taskflow-backend-prod | healthy | 4201 |
| taskflow-frontend-prod | healthy | 4200 |

### 5.3 ดู logs

```bash
# ดู log ทั้งหมด
docker compose -f docker-compose.prod.yml logs -f

# ดูเฉพาะ service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f postgres
```

---

## Step 6: Prisma — Sync Database

### 6.1 เข้าไปใน backend container

```bash
docker compose -f docker-compose.prod.yml exec backend sh
```

### 6.2 Push schema ไป database

```bash
npx prisma db push
```

### 6.3 ตรวจสอบ (ออกจาก container ก่อน: `exit`)

```bash
# Health check
curl http://localhost:4201/api/v1/health
```

**ผลลัพธ์ที่คาดหวัง:**

```json
{"success":true,"data":{"status":"OK","timestamp":"..."}}
```

---

## Step 7: Seed ข้อมูลเริ่มต้น

### 7.1 ติดตั้ง Node.js บน host (สำหรับรัน scripts)

```bash
# ติดตั้ง Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ตรวจสอบ
node --version   # v20.x.x
npm --version
```

### 7.2 ติดตั้ง dependencies สำหรับ scripts

```bash
cd /home/deploy/taskflow/backend
npm install
npx prisma generate
```

### 7.3 Import ข้อมูล (เลือกตามต้องการ)

```bash
# Import users (ถ้ามี users_export.json)
npx ts-node scripts/import-users.ts

# Import project data (ถ้ามี data_export.json)
npx ts-node scripts/import-data.ts

# Seed timeline data (25 projects)
npx ts-node scripts/seed-timeline.ts
```

### 7.4 สร้าง Admin user ด้วยมือ (ถ้ายังไม่มี)

```bash
# เข้า database
docker compose -f docker-compose.prod.yml exec postgres psql -U taskflow -d taskflow
```

```sql
-- ดู users
SELECT id, email, name, role FROM "User";

-- ถ้าไม่มี user ให้ register ผ่าน API:
-- curl -X POST http://localhost:3000/api/v1/auth/register \
--   -H "Content-Type: application/json" \
--   -d '{"email":"admin@example.com","password":"securepass","name":"Admin"}'
--
-- แล้วเปลี่ยน role เป็น ADMIN:
-- UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

---

## Step 8: ตั้งค่า Nginx Reverse Proxy (Host)

> **ทำไมต้องมี Nginx บน Host?**
> - ให้ทุก request เข้าที่ port 80/443 จุดเดียว
> - Nginx จะส่งต่อ (proxy) ไป frontend container หรือ backend container ตาม URL path
> - จัดการ SSL/HTTPS ที่จุดเดียว

### 8.1 ติดตั้ง Nginx

```bash
sudo apt install -y nginx
```

### 8.2 สร้าง config

```bash
sudo nano /etc/nginx/sites-available/taskflow
```

```nginx
server {
    listen 80;
    server_name <YOUR_DOMAIN_OR_IP>;

    # Frontend — proxy ไป Docker frontend container (port 4200)
    location / {
        proxy_pass http://127.0.0.1:4200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API — proxy ไป Docker backend container (port 4201)
    location /api/ {
        proxy_pass http://127.0.0.1:4201;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # File upload limit
        client_max_body_size 10M;
    }

    # Uploaded files
    location /uploads/ {
        proxy_pass http://127.0.0.1:4201;
        proxy_set_header Host $host;
    }
}
```

> **Port mapping:** Frontend → 4200, Backend → 4201 (ไม่ชนกับ app อื่นบน server)

### 8.3 เปิดใช้งาน

```bash
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default   # ลบ default site
sudo nginx -t                               # ทดสอบ config
sudo systemctl restart nginx
sudo systemctl enable nginx                  # auto-start on boot
```

---

## Step 9: SSL Certificate (HTTPS)

> ใช้ได้เมื่อมี domain name ชี้มาที่ server แล้ว

### 9.1 ติดตั้ง Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 ขอ certificate

```bash
sudo certbot --nginx -d yourdomain.com
```

### 9.3 Auto-renew

```bash
sudo certbot renew --dry-run   # ทดสอบ
# Certbot จะตั้ง cron/timer อัตโนมัติ
```

### 9.4 อัปเดต .env หลังได้ HTTPS

```env
VITE_API_URL=https://yourdomain.com/api/v1
CORS_ORIGIN=https://yourdomain.com
```

```bash
# Rebuild frontend (เพราะ VITE_API_URL เป็น build-time variable)
docker compose -f docker-compose.prod.yml up -d --build frontend
```

---

## Step 10: Firewall (UFW)

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw deny 5432/tcp     # ❗ ปิด PostgreSQL จากภายนอก
sudo ufw deny 4201/tcp     # ❗ ปิด Backend จากภายนอก (ให้เข้าผ่าน Nginx เท่านั้น)
sudo ufw deny 4200/tcp     # ❗ ปิด Frontend จากภายนอก (ให้เข้าผ่าน Nginx เท่านั้น)
sudo ufw enable
sudo ufw status
```

**ผลลัพธ์ที่คาดหวัง:**

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
5432/tcp                   DENY        Anywhere
4200/tcp                   DENY        Anywhere
4201/tcp                   DENY        Anywhere
```

---

## Step 11: ตรวจสอบระบบ

### 11.1 Health checks

```bash
# Backend health
curl -s http://localhost:4201/api/v1/health | python3 -m json.tool

# Frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:4200

# Database
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U taskflow -d taskflow
```

### 11.2 ทดสอบ Login

```bash
curl -s -X POST http://localhost:4201/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}' | python3 -m json.tool
```

### 11.3 ดู resource usage

```bash
docker stats --no-stream
```

**ตัวอย่าง resource usage:**

| Container | CPU | MEM | Limit |
|-----------|-----|-----|-------|
| taskflow-backend-prod | ~1% | ~120MB | 512MB |
| taskflow-frontend-prod | ~0% | ~10MB | 128MB |
| taskflow-db-prod | ~0% | ~50MB | — |

---

## Step 12: Backup & Maintenance

### 12.1 Database Backup

```bash
# Backup
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U taskflow taskflow > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
cat backup_YYYYMMDD_HHMMSS.sql | docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U taskflow taskflow
```

### 12.2 Automated Daily Backup (cron)

```bash
# สร้าง backup directory
mkdir -p /home/deploy/backups

# เพิ่ม cron job
crontab -e
```

```cron
# Backup database ทุกวัน ตี 2
0 2 * * * docker compose -f /home/deploy/taskflow/docker-compose.prod.yml exec -T postgres pg_dump -U taskflow taskflow | gzip > /home/deploy/backups/taskflow_$(date +\%Y\%m\%d).sql.gz

# ลบ backup เก่ากว่า 30 วัน
0 3 * * * find /home/deploy/backups -name "*.sql.gz" -mtime +30 -delete
```

### 12.3 อัปเดต Application

```bash
cd /home/deploy/taskflow

# Pull code ใหม่
git pull origin main

# Rebuild และ restart
docker compose -f docker-compose.prod.yml up -d --build

# Sync database schema (ถ้า schema เปลี่ยน)
docker compose -f docker-compose.prod.yml exec backend npx prisma db push
```

### 12.4 ดู Logs

```bash
# Realtime logs
docker compose -f docker-compose.prod.yml logs -f --tail=100

# เฉพาะ backend errors
docker compose -f docker-compose.prod.yml logs backend 2>&1 | grep -i error
```

---

## Step 13: Troubleshooting

### Container ไม่ขึ้น

```bash
# ดู logs
docker compose -f docker-compose.prod.yml logs <service_name>

# Restart service
docker compose -f docker-compose.prod.yml restart <service_name>

# Rebuild
docker compose -f docker-compose.prod.yml up -d --build <service_name>
```

### Database connection refused

```bash
# ตรวจว่า DB container healthy
docker compose -f docker-compose.prod.yml ps postgres

# เข้าไปตรวจ
docker compose -f docker-compose.prod.yml exec postgres psql -U taskflow -d taskflow -c "SELECT 1;"
```

### Frontend แสดงผิด / API call ไม่ได้

```bash
# ตรวจ VITE_API_URL (build-time variable)
docker compose -f docker-compose.prod.yml exec frontend sh -c "grep -r 'api' /usr/share/nginx/html/assets/*.js | head -3"

# ถ้าผิด → แก้ .env แล้ว rebuild frontend
docker compose -f docker-compose.prod.yml up -d --build frontend
```

### Disk เต็ม

```bash
# ดู disk usage
df -h

# ลบ Docker images/containers เก่า
docker system prune -a --volumes

# ดู Docker disk usage
docker system df
```

### Backend crash loop

```bash
# ดู logs
docker compose -f docker-compose.prod.yml logs --tail=50 backend

# เช็ค memory
docker stats --no-stream

# เข้าไป debug
docker compose -f docker-compose.prod.yml exec backend sh
```

---

## Architecture Diagram

```
                        ┌─────────────────────────────────┐
                        │         Ubuntu Server            │
                        │    Intel Xeon E-2334, 2 vCPU     │
                        │                                  │
  Internet              │  ┌──────────────────────────┐   │
    │                   │  │   Nginx (Host)            │   │
    │   :80/:443        │  │   - SSL termination       │   │
    ├──────────────────►│  │   - Reverse proxy         │   │
    │                   │  └──────┬───────────┬────────┘   │
    │                   │         │           │            │
    │                   │         ▼           ▼            │
    │                   │  ┌──────────┐ ┌──────────┐      │
    │                   │  │ Frontend │ │ Backend  │      │
    │                   │  │ (Nginx)  │ │ (Node)   │      │
    │                   │  │ :4200    │ │ :4201    │      │
    │                   │  │ Static   │ │ Express  │      │
    │                   │  │ React    │ │ Prisma   │      │
    │                   │  └──────────┘ └────┬─────┘      │
    │                   │                    │             │
    │                   │                    ▼             │
    │                   │              ┌──────────┐       │
    │                   │              │ PostgreSQL│       │
    │                   │              │ :5432     │       │
    │                   │              │ (Docker)  │       │
    │                   │              └──────────┘       │
    │                   │                                  │
    │                   └─────────────────────────────────┘
```

---

## Quick Reference Commands

```bash
# === Docker Compose (Production) ===
docker compose -f docker-compose.prod.yml up -d --build      # Start all
docker compose -f docker-compose.prod.yml down                # Stop all
docker compose -f docker-compose.prod.yml restart             # Restart all
docker compose -f docker-compose.prod.yml ps                  # Status
docker compose -f docker-compose.prod.yml logs -f             # Logs

# === Database ===
docker compose -f docker-compose.prod.yml exec backend npx prisma db push    # Sync schema
docker compose -f docker-compose.prod.yml exec backend npx prisma studio     # DB GUI
docker compose -f docker-compose.prod.yml exec postgres psql -U taskflow -d taskflow  # SQL shell

# === Update Application ===
git pull origin main && docker compose -f docker-compose.prod.yml up -d --build

# === Backup ===
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U taskflow taskflow > backup.sql
```

---

*Last updated: 2026-02-15*
*Project: YTY Project (TaskFlow)*
