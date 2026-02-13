# Rework Design Phase 1 — UI/UX Improvements

**วันที่เริ่ม:** 2026-02-13
**Branch:** afterohmtest
**สถานะ:** กำลังดำเนินการ

---

## บริบท (Context)

หลังจาก Manual Test Round 1 ผ่านแล้ว (37/39 passed, bugs fixed) เข้าสู่ phase ปรับปรุง UX/UI ให้ดูเป็น Premium, อ่านง่าย, ไม่ตาลาย

**Agent ต้องอ่านไฟล์นี้ก่อนเริ่มงาน Design เสมอ**

---

## รายการแก้ไข Design

### 1. Projects Page — Stats Cards สี Pastel
- **สถานะ:** [x] เสร็จแล้ว
- **ไฟล์:** `frontend/src/pages/ProjectsPage.tsx`, `ProjectsPage.css`
- **รายละเอียด:**
  - Total: พื้นขาว (`#FFFFFF`) + border, อักษรดำ
  - Active: พื้นเหลือง pastel (`#FFF9E6`), อักษรดำ
  - Delay: พื้นแดง pastel (`#FFF1F0`), อักษรแดงเข้ม (`#CF1322`)
  - Completed: พื้นเขียว pastel (`#F0FFF4`), อักษรดำ

### 2. Projects Page — Grid View 3x3 + Pagination
- **สถานะ:** [x] เสร็จแล้ว
- **ไฟล์:** `frontend/src/pages/ProjectsPage.tsx`, `ProjectsPage.css`
- **รายละเอียด:**
  - เปลี่ยนจาก 4 คอลัมน์เป็น 3 คอลัมน์ (lg=8, xl=8)
  - Card ย่อลง compact — ลด padding, ซ่อน description, font เล็กลง
  - Pagination 9 รายการต่อหน้า
  - แสดง "1-9 of 20 projects"

### 3. Projects Page — Board View (Kanban) + ลบ Postpone/Archived
- **สถานะ:** [x] เสร็จแล้ว
- **ไฟล์:** `ProjectsPage.tsx`, `ProjectsPage.css`, `projectService.ts`, `exportExcel.ts`, `exportPDF.ts`, `DashboardPage.tsx`
- **รายละเอียด:**
  - เพิ่ม Board View แบบ Kanban — 5 คอลัมน์: Active, Delay, Completed, Hold, Cancelled
  - แต่ละคอลัมน์มี: จุดสี + ชื่อ status + Badge จำนวน + project cards
  - Project card แสดง: color bar + ชื่อ + progress bar + members + tasks count
  - เพิ่มปุ่มสลับ view 3 แบบ: Card / Board / List
  - ลบ status Postpone และ Archived ออกจาก UI ทั้งหมด (filter, modal, export)

### 4. Board View — Drag & Drop + Bug Fixes
- **สถานะ:** [x] เสร็จแล้ว
- **ไฟล์ที่แก้ไข:**
  - `frontend/src/pages/ProjectsPage.tsx` — เพิ่ม Drag & Drop
  - `frontend/src/pages/ProjectsPage.css` — แก้ CSS สำหรับ Board cards
  - `frontend/src/main.tsx` — ลบ React StrictMode
  - `backend/src/services/project.service.ts` — แก้ permission updateProject
- **รายละเอียด:**
  - **ติดตั้ง `@hello-pangea/dnd` v18.0.1** — ใช้ DragDropContext, Droppable, Draggable
  - **แก้ Board cards ไม่แสดงเนื้อหา** — ย้าย `Droppable` ref จาก `.board-column` ไปไว้ที่ `.board-column-content` (ต้องเป็น direct parent ของ Draggable items) + เพิ่ม `flex-shrink: 0` ป้องกัน card ถูก flex compress
  - **แก้ drag ไม่ทำงาน** — ลบ `React.StrictMode` ใน `main.tsx` (React 18 StrictMode double-mount ทำให้ `@hello-pangea/dnd` sensor พัง)
  - **Optimistic UI update** — เมื่อลาก card ย้ายคอลัมน์ จะอัปเดต UI ทันที แล้วเรียก API ตามหลัง ถ้า fail จะ rollback กลับ
  - **แก้ "Failed to update project status"** — Backend `updateProject` เดิมให้เฉพาะ project owner เท่านั้น แก้ให้ ADMIN role สามารถอัปเดตได้ด้วย

### 5. Docker Database Restore จาก Production
- **สถานะ:** [x] เสร็จแล้ว
- **สาเหตุ:** Docker container `taskflow-db` ถูก recreate ใหม่ (จาก `docker compose up --remove-orphans`) ทำให้ข้อมูลหาย
- **วิธีแก้:**
  - ใช้ `psql` ผ่าน Docker container เชื่อมต่อ production Neon DB (non-pooler URL)
  - Export ข้อมูลด้วย `COPY ... TO STDOUT` แล้ว `COPY ... FROM STDIN` เข้า local DB
  - **ข้อควรระวัง:** Schema ไม่ตรงกัน — production ไม่มี columns: `passwordResetToken`, `passwordResetExpires`, `pinResetToken`, `pinResetExpires` (users), `parentTaskId` (tasks) — ต้อง specify columns ตรงๆ เมื่อ COPY
  - `pg_dump` ใช้ไม่ได้ (production PG 17 vs Docker PG 16 — version mismatch)
- **ข้อมูลที่ restore:**
  - Users: 77 records
  - Projects: 26 records
  - Tasks: 73 records
  - Project Members: 39 records
  - Comments: 1 record
  - Daily Updates: 5 records
  - Activity Logs: 18 records
- **ทดสอบ:** Login `tharab@sena.co.th` (password: `123456`) สำเร็จ

---

## รายการที่รอดำเนินการ (Pending)

- [ ] ทดสอบ Board View drag-and-drop end-to-end หลัง DB restore
- [ ] ทดสอบ Drag & Drop บน Docker environment ว่าอัปเดต status สำเร็จ

---

## หมายเหตุ
- ไม่แก้ Prisma schema / backend สำหรับ Postpone/Archived — เก็บไว้เป็น fallback
- Design อ้างอิงจากรูปที่ผู้ใช้แนบมา (Kanban board style)
- ใช้ Ant Design components เป็นหลัก
- `@hello-pangea/dnd` ต้องติดตั้งใน Docker ด้วย: `docker exec taskflow-frontend npm install @hello-pangea/dnd`
- React StrictMode ถูกลบออก — จำเป็นเพื่อให้ drag-and-drop ทำงานกับ React 18
- Docker named volume (`frontend_node_modules`) แยกจาก host `node_modules` — ต้อง install package ทั้งสองที่
