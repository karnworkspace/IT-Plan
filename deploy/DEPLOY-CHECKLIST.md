# Deployment Checklist — TaskFlow

> ใช้ track ความคืบหน้าตอน deploy จริง
> Last updated: 2026-02-16

## Pre-Deploy

- [x] Git repo พร้อม push (branch: main)
- [x] สร้าง SSH key สำหรับ server
- [ ] เตรียม domain name (ถ้ามี) — ยังไม่มี domain
- [x] เตรียม JWT secrets (2 ชุด) — generated ด้วย `openssl rand -base64 48`
- [x] เตรียม strong database password

## Server Setup

- [x] SSH เข้า server ได้ — `admindigital@ubuntudigital` (172.22.22.11)
- [x] อัปเดต OS (`apt update && upgrade`)
- [x] สร้าง deploy user — ใช้ `admindigital`
- [x] ตั้ง timezone Asia/Bangkok
- [x] ติดตั้ง Docker + Docker Compose
- [x] ทดสอบ `docker compose version`

## Application Deploy

- [x] Clone repo เข้า server — `/home/admindigital/taskflow`
- [x] สร้าง `.env` (production values)
- [x] สร้าง `backend/.env` (สำหรับ Prisma CLI)
- [x] `docker compose -f docker-compose.prod.yml up -d --build`
- [x] ทุก container status = healthy

### Build Issues Resolved
- Fixed: `package-lock.json` missing (removed from `.gitignore`)
- Fixed: 17 TypeScript errors (unused imports, type mismatches)
- Fixed: `AuthRequest` import path in `user.controller.ts`
- Fixed: Prisma OpenSSL on Alpine (`binaryTargets + apk add openssl`)
- Fixed: `window.location.href` ไม่ respect basename (`BASE_URL` fix)

## Database

- [x] Prisma db push สำเร็จ
- [ ] Import/seed ข้อมูลเริ่มต้น — **กำลังทำ**
- [x] สร้าง Admin user — `admin@taskflow.com` / `123456` (ADMIN)
- [x] ทดสอบ login ได้

## Networking & Security

- [x] Nginx reverse proxy ตั้งค่าเรียบร้อย — sub-path `/taskflow`
- [x] Frontend เข้าได้ผ่าน port 80 → `http://IP/taskflow`
- [x] API เข้าได้ผ่าน `/taskflow/api/v1/`
- [ ] UFW firewall เปิด (22, 80, 443 only)
- [ ] PostgreSQL port 5432 ปิดจากภายนอก
- [ ] SSL/HTTPS (ถ้ามี domain)

### Nginx Config
- Config file: `/etc/nginx/sites-enabled/multi-app`
- TaskFlow blocks เพิ่มใน server block เดียวกับ app อื่น
- Location blocks: `/taskflow/api` (→ 4201), `/taskflow` (→ 4200), static files

### Sub-path Configuration
- `vite.config.ts`: `base: mode === 'production' ? '/taskflow/' : '/'`
- `App.tsx`: `basename={import.meta.env.BASE_URL.replace(/\/+$/, '')}`
- `LoginPage.tsx`: `window.location.href = import.meta.env.BASE_URL + 'dashboard'`
- `api.ts`: `window.location.href = import.meta.env.BASE_URL + 'login'`
- `.env` on server: `VITE_API_URL=/taskflow/api/v1`

## Validation

- [x] `curl /taskflow/api/v1/health` → OK (200)
- [x] Frontend โหลดหน้า Login ได้
- [x] Login → Dashboard แสดงข้อมูลถูกต้อง
- [ ] สร้าง Project ได้
- [ ] สร้าง Task ได้
- [ ] Upload รูปใน comment ได้
- [ ] Timeline page แสดงข้อมูล

## Post-Deploy

- [ ] ตั้ง cron backup database (ทุกวัน ตี 2)
- [ ] สร้าง backup directory
- [ ] ทดสอบ restore backup
- [x] จด Server IP / Domain ลงใน SERVER-SPECS.md
- [ ] แจ้ง users เข้าใช้งาน
- [ ] ตั้ง CI/CD (GitHub Actions — SSH deploy on push to main)

---

## Access URLs

| Environment | URL |
|-------------|-----|
| LAN | `http://172.22.22.11/taskflow` |
| Public | `http://167.179.239.122/taskflow` |
| API Health | `http://172.22.22.11/taskflow/api/v1/health` |

## Server Info

| Item | Value |
|------|-------|
| Server | `admindigital@ubuntudigital` |
| IP (LAN) | 172.22.22.11 |
| IP (Public) | 167.179.239.122 |
| Project path | `/home/admindigital/taskflow` |
| GitHub repo | `karnworkspace/IT-Plan` |
| Nginx | 1.24.0 (Ubuntu) |
| Docker Compose | `docker-compose.prod.yml` |

## Environment Variables Summary

| Variable | ค่าที่ใช้ | หมายเหตุ |
|----------|---------|----------|
| POSTGRES_USER | taskflow | |
| POSTGRES_PASSWORD | ********** | strong password |
| POSTGRES_DB | taskflow | |
| JWT_ACCESS_SECRET | (64 chars) | generated |
| JWT_REFRESH_SECRET | (64 chars) | generated |
| CORS_ORIGIN | `http://172.22.22.11,http://167.179.239.122` | ทั้ง LAN + Public |
| VITE_API_URL | `/taskflow/api/v1` | relative path |
| FRONTEND_PORT | 4200 | |
| BACKEND_PORT | 4201 | |

## Ports Map

| Port | Service | เข้าจากภายนอก? |
|------|---------|---------------|
| 22 | SSH | YES |
| 80 | Nginx (Host) | YES |
| 443 | Nginx HTTPS | YES (ถ้าเปิด) |
| 4200 | TaskFlow Frontend (Docker) | NO (ผ่าน Nginx `/taskflow`) |
| 4201 | TaskFlow Backend (Docker) | NO (ผ่าน Nginx `/taskflow/api`) |
| 5432 | PostgreSQL (Docker) | NO (internal only) |

---

## Docker Containers

| Container | Image | Port Mapping |
|-----------|-------|-------------|
| taskflow-db-prod | postgres:16-alpine | - (internal) |
| taskflow-backend-prod | taskflow-backend | 4201:3000 |
| taskflow-frontend-prod | taskflow-frontend | 4200:80 |

---

*Created: 2026-02-15 | Updated: 2026-02-16*
