# Review R1 — Task List & UX Analysis

**Source:** review app project update 16 Feb 2026 R1.pdf
**Analyzed by:** UX/UI Design Agent
**Date:** 2026-02-21

---

## สรุปภาพรวม

- **รวม 12 items** — Quick Fix 5 / Redesign 7
- **Priority:** Critical (3) / High (4) / Medium (4) / Low (1)
- **Item #24 (กรองสิทธิ์)** → ชะลอ ผู้ใช้สั่ง "ให้ทุกคนเห็นเหมือนกันก่อน"

---

## Quick Fix (5 items) — แก้ได้เลย

### #26 — Color picker ไม่ตีกรอบตามที่เลือก `[15 นาที]`
- **ปัญหา:** เลือกสีแล้วไม่มี highlight บอกว่าเลือกสีไหน
- **แก้:** เพิ่ม CSS selected state ให้ color swatch (`box-shadow` + `border`)
- **ไฟล์:** `ProjectsPage.tsx` / `ProjectsPage.css`

### #25 — แก้ไข Group Type ไม่ save `[30 นาที]`
- **ปัญหา:** เปลี่ยน Type จาก Project Group → User Group แล้วระบบไม่บันทึก
- **แก้:** เพิ่ม `type` field ใน update payload ทั้ง frontend + backend
- **ไฟล์:** `GroupsPage.tsx`, `groupService.ts`, `group.service.ts`
- **หมายเหตุ:** Groups ถูก disable อยู่ ทำเมื่อเปิดใช้งานใหม่

### #29 — ไม่สามารถลบ Project ได้ `[30 นาที]`
- **ปัญหา:** ไม่มีปุ่ม Delete ในหน้า Project Detail
- **แก้:** เพิ่ม Dropdown menu ที่ header → "Delete Project" → `Modal.confirm()` → `projectService.deleteProject()` → navigate กลับ `/projects`
- **ไฟล์:** `ProjectDetailPage.tsx`

### #30 — Save PDF ไม่ตอบสนอง `[60 นาที]`
- **ปัญหา:** กด Save PDF → ระบบนิ่ง ไม่มี feedback
- **แก้:**
  - เพิ่ม loading state + `message.success/error`
  - ตรวจ font path (Thai font Sarabun อาจโหลดไม่ได้ใน production)
  - เพิ่ม `try/catch` ที่ครอบ `exportTasksPDF()`
- **ไฟล์:** `ProjectDetailPage.tsx`, `utils/exportPDF.ts`

### #27 — เพิ่ม Member เข้า Project ไม่ได้ `[60 นาที]`
- **ปัญหา:** กดเพิ่มสมาชิกแล้วระบบไม่ทำงาน
- **แก้:** Debug — ตรวจ API response, permission check, UI refresh
- **หมายเหตุ:** เพิ่ง implement Add Member UI แล้ว ต้อง test บน production
- **ไฟล์:** `ProjectDetailPage.tsx`, `projectService.ts`, `project.service.ts`

---

## Redesign (7 items) — ต้องออกแบบ

### #28 — Edit Project Info `[M — 3-4 ชม.]`
- **ปัญหา:** ไม่มี UI แก้ไข ชื่อ/description/start date/end date/status/color
- **แนวทาง:** เพิ่ม Edit Project Modal (consistent กับ Create Project ที่มีอยู่)
  - ปุ่ม Edit ที่ header → เปิด Modal pre-filled → Save → reload
- **ไฟล์:** `ProjectDetailPage.tsx`

### P4-1 — Dashboard เป็นหน้าหลัก + Activity Feed `[L — 1-2 วัน]`
- **ปัญหา:** Dashboard ไม่มี activity feed, ไม่แสดง recent updates
- **แนวทาง:**
  - เพิ่ม Activity Feed section (ดึงจาก ActivityLog table)
  - แต่ละ item: avatar + action text + timestamp + link
  - คลิก → navigate ไปหน้า project/task ที่เกี่ยวข้อง
  - เพิ่ม Quick Access panel (project shortcuts + my tasks)
- **Reference:** Jira Dashboard, Asana Home

### P4-2 — Annual Plan View ใน Dashboard `[S-M]`
- **ปัญหา:** ผู้ใช้ต้องการเห็น IT Project Tracking 2026 ภาพรวม
- **แนวทาง:**
  - Option 1 (Quick): ปุ่ม "View Annual Plan" → link ไป `/timeline`
  - Option 2: Embed mini timeline ใน Dashboard

### P5-1 — เครื่องหมาย +/- ใน Timeline `[M — 3-5 ชม.]`
- **ปัญหา:** ไม่เห็นว่า progress เปลี่ยนแปลงเท่าไร
- **แนวทาง:** แสดง delta badge เช่น `65% (+5% ▲)` สีเขียว / `40% (-3% ▼)` สีแดง
- **ต้องเพิ่ม:** คำนวณ delta จาก DailyUpdate หรือเพิ่ม `previousProgress` field

### P5-2 — ลบปุ่ม Edit → Inline Editing `[M-L — 4-8 ชม.]`
- **ปัญหา:** ต้องกดปุ่ม edit ก่อนถึงจะแก้ไขได้
- **แนวทาง:** เปิด task detail → ทุก field editable ทันที → กด Save
  - Title → `Input` editable
  - Status/Priority/Assignees → `Select` เปลี่ยนได้ทันที
  - มี "Save Changes" button + "Unsaved changes" indicator
- **Reference:** Notion, Linear, ClickUp

### P5-3 — ยุบหน้า Project → Timeline-centric + Tag + Convert + Chat `[XL — 3-5 วัน]`
- **ปัญหา:** ผู้ใช้ต้องการ:
  - ไม่ต้องมีหน้า Project แยก → ใช้ Timeline เป็นหลัก
  - Project ติดหัว (sticky header) → view เฉพาะ subtask
  - Tag project ย่อยกับ main task
  - Convert subtask ↔ main task
  - Chat-style comments (ของเราขวา, คนอื่นซ้าย)
- **แนวทาง (แบ่ง Phase):**
  - **Phase A:** Tag System — เพิ่ม tags ใน Task model + UI badges
  - **Phase B:** Convert Task ↔ Subtask — action button เปลี่ยน `parentTaskId`
  - **Phase C:** Timeline-centric View — expand project → subtasks inline
  - **Phase D:** Chat-style Comments — bubble layout ซ้าย/ขวา

### #24 — กรองสิทธิ์ Project ตาม User `[ชะลอ]`
- **สถานะ:** ผู้ใช้สั่ง "ให้ทุกคนเห็นเหมือนกันไปทั้งหมดก่อน"
- **เมื่อทำ:** Backend filter `getAllProjects()` by userId via ProjectMember

---

## ลำดับการทำงาน

### Sprint 1 — Quick Fixes (1 วัน)
- [ ] #26 Color picker selected state `[15 min]`
- [ ] #29 Delete Project button `[30 min]`
- [ ] #30 Save PDF fix + feedback `[60 min]`
- [ ] #27 Debug Add Member `[60 min]`
- [ ] #28 Edit Project modal `[3-4 hr]`

### Sprint 2 — Core Improvements (2-3 วัน)
- [ ] P5-2 Inline editing TaskDetail `[4-8 hr]`
- [ ] P4-2 Annual Plan link/embed `[1-3 hr]`
- [ ] P5-1 Delta indicator `[3-5 hr]`

### Sprint 3 — Major Redesign (3-5 วัน)
- [ ] P4-1 Dashboard Activity Feed `[1-2 days]`
- [ ] P5-3 Timeline-centric + Tag + Convert + Chat `[3-5 days]`

### Backlog
- [ ] #24 Permission filtering `[ชะลอ]`
- [ ] #25 Group type save `[ชะลอ — Groups disabled]`

---

**Last Updated:** 2026-02-21
