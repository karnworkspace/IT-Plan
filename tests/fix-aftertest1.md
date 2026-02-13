# Fix After Manual Test Round 1

**วันที่เริ่ม:** 2026-02-12
**Branch:** afterohmtest
**ผลทดสอบ:** 39/68 tested | 37/39 passed (95%) | 2 bugs → **ALL FIXED**

---

## รายการแก้ไข

### Bug#1: PIN Login ผิด PIN แต่ไม่แสดง error message
- **Severity:** Medium
- **Test Case:** 1.2.2
- **อาการ:** ใส่ PIN ผิด → หน้าจอ redirect กลับ login โดยไม่แสดง error toast
- **สาเหตุ:** api.ts response interceptor ดัก 401 ทุก request แล้วพยายาม refresh token → ไม่มี token → redirect ไป /login ก่อนที่ LoginPage catch จะแสดง error
- **สถานะ:** [x] แก้ไขแล้ว

### Bug#2: Post Comment ไม่ทำงาน
- **Severity:** Medium
- **Test Case:** 6.2.1
- **อาการ:** กด Post Comment แล้วยังแสดง "No comments yet"
- **สาเหตุ:** React stale closure — ใช้ค่า comments จาก closure เก่าทำให้ state update ไม่สะท้อนค่าล่าสุด
- **สถานะ:** [x] แก้ไขแล้ว

### Bug#3: Delete member ลบ group แทน (FIXED by tester)
- **Severity:** High
- **Test Case:** 10.3
- **อาการ:** ลบ member แล้ว group หายด้วย
- **สถานะ:** [x] แก้ไขแล้วก่อนหน้านี้

### Issue#4: Docker dev ไม่ได้ใช้ PostgreSQL
- **Severity:** Low
- **อาการ:** docker-compose.yml (dev) ใช้ SQLite แต่ production ใช้ PostgreSQL — ไม่ตรงกัน, มี orphan container `taskflow-db` จาก version เก่า
- **สถานะ:** [x] แก้ไขแล้ว

### Issue#5: ADMIN แสดงชื่อ "OHM" แทน "อดินันท์"
- **Severity:** Low
- **อาการ:** user `adinuna@sena.co.th` มี name = "adinuna" ใน database — ควรแสดง "อดินันท์ (OHM)"
- **สถานะ:** [x] แก้ไขแล้ว (run script บน production สำเร็จ)

---

## บันทึกการแก้ไข

### 2026-02-12

**Bug#1 — PIN Login error not showing** [FIXED]
- แก้ `frontend/src/services/api.ts` — เพิ่ม `isAuthRequest` check ใน response interceptor
- 401 จาก auth endpoints (`/auth/*`) จะ skip refresh token logic แล้ว reject error กลับไปให้ caller จัดการ
- LoginPage.tsx catch block จะแสดง `message.error('Invalid email or PIN')` ได้ถูกต้อง

**Bug#2 — Post Comment not working** [FIXED]
- แก้ `frontend/src/pages/TaskDetailModal.tsx` — เปลี่ยน `setComments([comment, ...comments])` เป็น `setComments(prev => [comment, ...prev])`
- ใช้ functional state updater เพื่อป้องกัน stale closure ใน React
- แก้เดียวกันกับ `setUpdates` ด้วย
- เพิ่ม `console.error` ใน catch block เพื่อ debug ง่ายขึ้น

**Issue#4 — Docker dev ไม่ใช้ PostgreSQL** [FIXED]
- แก้ `docker-compose.yml` — เพิ่ม PostgreSQL service (`db`) พร้อม healthcheck
- เปลี่ยน backend DATABASE_URL จาก SQLite เป็น PostgreSQL
- เพิ่ม `depends_on: db: condition: service_healthy`
- แก้ VITE_API_URL ให้ตรง port 3000
- dev environment ตรงกับ production แล้ว

**Issue#5 — ADMIN name** [FIXED - Production DB Updated]
- สร้าง `backend/scripts/fix-admin-name.ts`
- Run สำเร็จบน production: "adinuna" → "อดินันท์ (OHM)"
- Prisma schema เปลี่ยนจาก sqlite → postgresql (ตรงกับ production + Docker dev)
- อัปเดต backend/.env ให้ชี้ Docker PostgreSQL เป็น default

**Infrastructure — Prisma + Docker unified to PostgreSQL** [FIXED]
- `backend/prisma/schema.prisma`: provider เปลี่ยนเป็น `postgresql`
- `backend/.env`: DATABASE_URL ชี้ Docker PostgreSQL (localhost:5432)
- `docker-compose.yml`: เพิ่ม `db` service (postgres:16-alpine)
- ทั้ง dev (Docker) และ production (Neon) ใช้ PostgreSQL เหมือนกันแล้ว
