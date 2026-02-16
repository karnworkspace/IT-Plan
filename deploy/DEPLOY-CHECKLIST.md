# Deployment Checklist — TaskFlow

> ใช้ track ความคืบหน้าตอน deploy จริง

## Pre-Deploy

- [ ] Git repo พร้อม push (branch: main)
- [ ] สร้าง SSH key สำหรับ server
- [ ] เตรียม domain name (ถ้ามี)
- [ ] เตรียม JWT secrets (2 ชุด)
- [ ] เตรียม strong database password

## Server Setup

- [ ] SSH เข้า server ได้
- [ ] อัปเดต OS (`apt update && upgrade`)
- [ ] สร้าง deploy user
- [ ] ตั้ง timezone Asia/Bangkok
- [ ] ติดตั้ง Docker + Docker Compose
- [ ] ทดสอบ `docker compose version`

## Application Deploy

- [ ] Clone repo เข้า server
- [ ] สร้าง `.env` (production values)
- [ ] สร้าง `backend/.env` (สำหรับ Prisma CLI)
- [ ] `docker compose -f docker-compose.prod.yml up -d --build`
- [ ] ทุก container status = healthy

## Database

- [ ] Prisma db push สำเร็จ
- [ ] Import/seed ข้อมูลเริ่มต้น
- [ ] สร้าง Admin user
- [ ] ทดสอบ login ได้

## Networking & Security

- [ ] Nginx reverse proxy ตั้งค่าเรียบร้อย
- [ ] Frontend เข้าได้ผ่าน port 80
- [ ] API เข้าได้ผ่าน /api/v1/
- [ ] UFW firewall เปิด (22, 80, 443 only)
- [ ] PostgreSQL port 5432 ปิดจากภายนอก
- [ ] SSL/HTTPS (ถ้ามี domain)

## Validation

- [ ] `curl /api/v1/health` → OK
- [ ] Frontend โหลดหน้า Login ได้
- [ ] Login → Dashboard แสดงข้อมูลถูกต้อง
- [ ] สร้าง Project ได้
- [ ] สร้าง Task ได้
- [ ] Upload รูปใน comment ได้
- [ ] Timeline page แสดงข้อมูล

## Post-Deploy

- [ ] ตั้ง cron backup database (ทุกวัน ตี 2)
- [ ] สร้าง backup directory
- [ ] ทดสอบ restore backup
- [ ] จด Server IP / Domain ลงใน SERVER-SPECS.md
- [ ] แจ้ง users เข้าใช้งาน

---

## Environment Variables Summary

| Variable | ตัวอย่าง | ต้องเปลี่ยน? |
|----------|---------|-------------|
| POSTGRES_USER | taskflow | ไม่จำเป็น |
| POSTGRES_PASSWORD | ********** | **YES** |
| POSTGRES_DB | taskflow | ไม่จำเป็น |
| JWT_ACCESS_SECRET | (64 chars random) | **YES** |
| JWT_REFRESH_SECRET | (64 chars random) | **YES** |
| CORS_ORIGIN | http://your-ip:4200 | **YES** |
| VITE_API_URL | http://your-ip:4201/api/v1 | **YES** |
| FRONTEND_PORT | 4200 | ไม่ชนกับ app อื่น |
| BACKEND_PORT | 4201 | ไม่ชนกับ app อื่น |

---

## Ports Map

| Port | Service | เข้าจากภายนอก? |
|------|---------|---------------|
| 22 | SSH | YES |
| 80 | Nginx (Host) | YES |
| 443 | Nginx HTTPS | YES |
| 4200 | TaskFlow Frontend (Docker) | NO (ผ่าน Nginx) |
| 4201 | TaskFlow Backend (Docker) | NO (ผ่าน Nginx) |
| 5432 | PostgreSQL (Docker) | NO (internal only) |

---

*Created: 2026-02-15*
