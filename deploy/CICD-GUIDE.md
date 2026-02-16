# CI/CD Guide — TaskFlow

> ตั้งค่า GitHub Actions ให้ auto deploy เมื่อ push to main

---

## Flow Overview

```
┌──────────┐    git push     ┌──────────────┐    SSH deploy    ┌──────────────┐
│  Local    │ ──────────────► │   GitHub      │ ──────────────► │  Production  │
│  Machine  │    to main      │   Actions     │   pull & build  │  Server      │
└──────────┘                  └──────────────┘                  └──────────────┘

Developer workflow:
  1. แก้ code → test locally
  2. git push origin main
  3. GitHub Actions ทำงานอัตโนมัติ:
     ├── CI: type check + build test
     └── CD: SSH เข้า server → pull → docker compose build
  4. Production อัปเดตเอง ~5 นาที
```

---

## ขั้นตอนตั้งค่า (ทำครั้งเดียว)

### Step 1: สร้าง SSH Key สำหรับ GitHub Actions

**บน production server:**

```bash
# สร้าง key pair เฉพาะสำหรับ CI/CD
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# เพิ่ม public key เข้า authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Copy private key (ใช้ใน step ถัดไป)
cat ~/.ssh/github_actions
```

> Copy ทั้งหมดตั้งแต่ `-----BEGIN OPENSSH PRIVATE KEY-----` ถึง `-----END OPENSSH PRIVATE KEY-----`

---

### Step 2: ตั้ง GitHub Secrets

ไปที่ GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value | ตัวอย่าง |
|------------|-------|---------|
| `SERVER_HOST` | IP address ของ server | `203.150.xxx.xxx` |
| `SERVER_USER` | SSH username | `deploy` |
| `SERVER_SSH_KEY` | Private key จาก Step 1 | `-----BEGIN OPENSSH...` |
| `SERVER_PORT` | SSH port (default 22) | `22` |
| `DEPLOY_PATH` | Path ของ project บน server | `/home/deploy/taskflow` |

**วิธีเพิ่ม:**
1. ไปที่ `https://github.com/<user>/<repo>/settings/secrets/actions`
2. กด **New repository secret**
3. ใส่ Name + Value → Save

---

### Step 3: เตรียม Production Server

**บน server — clone repo + ตั้งค่า .env:**

```bash
# Clone repo (ถ้ายังไม่มี)
cd /home/deploy
git clone git@github.com:<user>/<repo>.git taskflow
cd taskflow

# ตั้งค่า .env สำหรับ production
cp docker/.env.example .env
nano .env
# แก้: POSTGRES_PASSWORD, JWT secrets, CORS_ORIGIN, VITE_API_URL

# Build ครั้งแรก
docker compose -f docker-compose.prod.yml up -d --build
```

**ตั้งค่า Git ให้ pull ได้โดยไม่ต้องใส่ password:**

```bash
# ถ้าใช้ SSH
git remote set-url origin git@github.com:<user>/<repo>.git

# ถ้าใช้ HTTPS + Personal Access Token
git remote set-url origin https://<TOKEN>@github.com/<user>/<repo>.git
```

---

### Step 4: ทดสอบ

```bash
# จาก local machine
git add .
git commit -m "test: CI/CD pipeline"
git push origin main
```

**ดูผลที่:** `https://github.com/<user>/<repo>/actions`

---

## GitHub Actions Workflow อธิบาย

**ไฟล์:** `.github/workflows/deploy.yml`

```
Job 1: CI (ทำก่อน)
├── Checkout code
├── Backend: npm ci → prisma generate → tsc --noEmit → npm run build
└── Frontend: npm ci → tsc --noEmit → npm run build

Job 2: CD (ทำหลัง CI ผ่าน)
└── SSH เข้า server แล้วรัน:
    ├── git pull origin main
    ├── docker compose up -d --build
    ├── prisma db push
    ├── docker image prune -f
    └── curl health check
```

### Trigger Conditions

| Event | ทำงาน? |
|-------|--------|
| Push to `main` | CI + CD |
| Push to branch อื่น | ไม่ทำงาน |
| Pull Request | ไม่ทำงาน |
| กดปุ่ม "Run workflow" ใน GitHub UI | CI + CD |

> ถ้าต้องการให้ PR รัน CI ด้วย เพิ่ม `pull_request: branches: [main]` ใน workflow

---

## Manual Deploy (ไม่ผ่าน CI/CD)

**กรณีที่ต้องการ deploy มือ:**

```bash
# SSH เข้า server
ssh deploy@<SERVER_IP>

# รัน deploy script
cd /home/deploy/taskflow
./deploy/deploy.sh
```

**Script ทำอะไร:**
1. Backup database ก่อน deploy
2. `git pull origin main`
3. `docker compose -f docker-compose.prod.yml up -d --build`
4. `prisma db push`
5. Clean old Docker images
6. Health check (backend + frontend)

---

## Workflow ที่แนะนำสำหรับ Developer

### Daily Development

```bash
# 1. สร้าง branch ใหม่
git checkout -b feature/my-feature

# 2. แก้ code + test locally
cd frontend && npm run dev    # ดู UI
cd backend && npm run dev     # ดู API
npx tsc --noEmit              # type check

# 3. Commit
git add <files>
git commit -m "feat: add new feature"

# 4. Push branch (ยังไม่ deploy)
git push origin feature/my-feature
```

### Deploy to Production

```bash
# 5. Merge เข้า main
git checkout main
git merge feature/my-feature

# 6. Push to main → AUTO DEPLOY!
git push origin main

# 7. ดูสถานะใน GitHub Actions
# https://github.com/<user>/<repo>/actions
```

### Hotfix (ด่วน)

```bash
git checkout main
# แก้ bug
git add <files>
git commit -m "fix: critical bug fix"
git push origin main
# → auto deploy ภายใน ~5 นาที
```

---

## Monitoring & Debugging

### ดู GitHub Actions logs
1. ไปที่ `https://github.com/<user>/<repo>/actions`
2. คลิกที่ workflow run ล่าสุด
3. ดู logs ของแต่ละ step

### ดู logs บน server

```bash
# Docker container logs
docker compose -f docker-compose.prod.yml logs -f --tail=50

# เฉพาะ backend
docker compose -f docker-compose.prod.yml logs -f backend

# ดู deploy history (git log)
git log --oneline -10
```

### Rollback (ย้อนกลับ)

```bash
# SSH เข้า server
ssh deploy@<SERVER_IP>
cd /home/deploy/taskflow

# ดู commit ที่ต้องการย้อน
git log --oneline -10

# Rollback ไป commit ก่อนหน้า
git checkout <COMMIT_HASH>

# Rebuild
docker compose -f docker-compose.prod.yml up -d --build

# ถ้า database schema เปลี่ยน → restore backup
cat /home/deploy/backups/taskflow_pre_deploy_YYYYMMDD.sql.gz | gunzip | \
  docker compose -f docker-compose.prod.yml exec -T postgres psql -U taskflow taskflow
```

---

## Cost

| Item | Cost |
|------|------|
| GitHub Actions | **Free** (2,000 min/month สำหรับ public, 500 min สำหรับ private) |
| Server | มีอยู่แล้ว |
| Docker Hub | ไม่ใช้ (build บน server โดยตรง) |

---

## Checklist ตั้งค่า CI/CD

- [ ] สร้าง SSH key pair บน server
- [ ] เพิ่ม public key ใน `~/.ssh/authorized_keys`
- [ ] ตั้ง GitHub Secrets (5 ตัว)
- [ ] Clone repo บน server + ตั้งค่า `.env`
- [ ] Push `.github/workflows/deploy.yml` ไป GitHub
- [ ] ทดสอบ push to main → ดู GitHub Actions
- [ ] ตรวจ production ทำงานถูกต้อง

---

*Last updated: 2026-02-15*
