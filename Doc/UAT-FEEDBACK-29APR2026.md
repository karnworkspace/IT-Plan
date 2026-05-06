# UAT Feedback Analysis — IT Project System
### จากไฟล์: review app project update 29 Apr 2026.pptx (42 slides)
### วันที่วิเคราะห์: 2026-05-06

---

## สารบัญ

1. [สรุปภาพรวม](#สรุปภาพรวม)
2. [รายละเอียดทุก Issue แยกตามหน้า](#รายละเอียดทุก-issue-แยกตามหน้า)
3. [แผนงาน Sprint](#แผนงาน-sprint)
4. [Sprint A — Critical Bugs & Permission](#sprint-a--critical-bugs--permission)
5. [Sprint B — Core UX & Feature Fix](#sprint-b--core-ux--feature-fix)
6. [Sprint C — UI Polish & Branding](#sprint-c--ui-polish--branding)
7. [Sprint D — New Features](#sprint-d--new-features)
8. [สิ่งที่ข้ามไว้ก่อน](#สิ่งที่ข้ามไว้ก่อน)
9. [ความเสี่ยงและ Dependencies](#ความเสี่ยงและ-dependencies)

---

## สรุปภาพรวม

| หมวด | จำนวน | ระดับ | หมายเหตุ |
|------|-------|-------|---------|
| Bugs (ระบบพัง) | 10 ข้อ | Critical | Update fail, file broken, Gantt เด้ง, 404 |
| Permission (เห็นข้อมูลผิด) | 12 ข้อ | Critical | ทุกหน้ายังไม่ filter ตาม Role |
| UX/Layout (ใช้งานลำบาก) | 15 ข้อ | High | ล้นจอ, ย้าย section, sidebar, sorting |
| UI/Label (cosmetic) | 18 ข้อ | Medium | สี, label, logo, font |
| Feature ใหม่ | 9 ข้อ | Low | Email, responsive, internal project |
| ข้ามไว้ก่อน | 7 ข้อ | — | Email notify, Gantt MyTasks, responsive |

**รวม: 71 ข้อ → ทำจริง ~64 ข้อ (ข้าม 7 ข้อ)**

---

## รายละเอียดทุก Issue แยกตามหน้า

### หน้า Login (Slide 1) — 2 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | สถานะปัจจุบัน | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-------------|-------------|--------|---------|
| 1 | 1 | เปลี่ยน Title บน tab browser จาก "Frontend" เป็น **"IT Project System"** | แสดง "Frontend" ซึ่งเป็นชื่อ default ของ Vite | แก้ `index.html` → `<title>IT Project System</title>` | UI/Label | เล็ก |
| 2 | 1 | Forgot Password กด 404 — ถ้ายังไม่พร้อมให้ซ่อนออก | มี ForgotPasswordPage แต่ route ไม่ทำงาน | ซ่อน link "Forgot Password?" ออกจาก LoginPage ไปก่อน (ยังไม่มี email system) | Bug | เล็ก |

---

### หน้า Dashboard — Admin View (Slide 3-5) — 10 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 3 | 3 | ทุก Role เห็น Dashboard Project จำนวนเท่ากัน | Admin กับ Member เห็นจำนวน Project/Task เหมือนกัน | แก้ให้ Member เห็นเฉพาะ project ที่ตัวเองเป็น member, Admin เห็นทั้งหมด | Permission | ใหญ่ |
| 4 | 3 | เปลี่ยน logo เป็น SENA | Sidebar ยังใช้ logo เดิม | เปลี่ยนเป็น `PIC/SenaDlogo.png` | UI/Label | เล็ก |
| 5 | 3 | เปลี่ยน "Welcome back" เป็น "Dashboard" | หัว section เขียน "Welcome back, ชื่อ" | เปลี่ยนเป็นคำว่า "Dashboard" | UI/Label | เล็ก |
| 6 | 3 | Quick Access ล้นจอทางขวา | section Quick Access อยู่ข้างๆ ล้นออกจอ | ย้ายลงมาอยู่ด้านล่างต่อจาก Recent Projects เป็น layout แนวตั้ง | Layout/UX | กลาง |
| 7 | 3 | Team Activity ล้นจอทางขวา | เหมือนข้อ 6 | ย้ายลงมาด้านล่างต่อจาก My Active Tasks | Layout/UX | กลาง |
| 8 | 4 | My Activity Tasks กดชื่อ link ไม่ได้ | Quick Access กดชื่อ link ได้ แต่ My Activity Tasks ต้องกดลูกศรขวาสุด | ให้กดที่ชื่อ task ได้เลยเพื่อ link ไปหน้ารายละเอียดงาน | UX | เล็ก |
| 9 | 5 | เปลี่ยนหัว section เป็น "IT Overall" | section แสดงภาพรวม project ทั้งหมด | เปลี่ยน label เป็น "IT Overall" | UI/Label | เล็ก |
| 10 | 5 | 4 กล่อง stat ไม่ต้องใส่สี | กล่อง Total/Active/Completed/Hold มี gradient สี | ให้เป็นสีขาว/neutral เหมือนกันทั้ง 4 กล่อง | UI/Label | เล็ก |
| 11 | 5 | ไม่มีปุ่มย่อ/ขยาย Sidebar | user หาปุ่มย่อ sidebar ไม่เจอ | ต้องมีปุ่ม << / >> ที่ชัดเจน เพื่อย่อ sidebar แล้วเนื้อหาแสดงเต็มจอมากขึ้น | UX | กลาง |
| 12 | 5 | เปลี่ยน label เป็น "View My Projects" | ปุ่มที่ link ไปหน้า My Projects | เปลี่ยน label ให้ตรง | UI/Label | เล็ก |

---

### หน้า Dashboard — Member View (Slide 22) — 6 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 13 | 22 | เปลี่ยน wording เป็น "Project Overall" | Member ไม่ได้เห็นทุก project | ใช้คำว่า "Project Overall" แทน | UI/Label | เล็ก |
| 14 | 22 | กด Total/Active/View My Projects/Completion Rate แสดงผลไม่เหมือนกัน | แต่ละปุ่ม stat card นำไปคนละหน้าหรือ filter ไม่ตรง | ทุกปุ่มพาไปหน้า My Projects โดย filter ตาม status ที่ตรง | Bug/UX | กลาง |
| 15 | 22 | Team Members กดแล้วไปหน้า project | ควรแสดงรายชื่อคนในทีม | แก้ link ให้แสดงรายชื่อ team members ไม่ใช่ไปหน้า project | Bug | กลาง |
| 16 | 22 | จุดสถานะ complete ไม่เป็นวงกลม | CSS ของ status dot เพี้ยน | แก้ CSS ให้เป็น `border-radius: 50%` | Bug/UI | เล็ก |
| 17 | 22 | Team Activity ต้องเห็นเฉพาะงานตัวเอง | Member เห็น activity ของคนอื่น | filter activity ตาม userId ของ member | Permission | กลาง |
| 18 | 22 | Total IT Project เห็นเฉพาะงานตนเอง | เหมือนข้อ 3 | filter ตาม membership | Permission | กลาง |

---

### หน้า Projects / Timeline (Slide 6) — 3 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 19 | 6 | ขาดกลุ่มงาน "Infrastructure and Network" | ปัจจุบันมี 5 category | เพิ่ม category ใหม่ "Infrastructure and Network" | Config/Data | เล็ก |
| 20 | 6 | แถบสี plan ให้ตรงตาม Project status | แถบสี timeline bar ไม่ตรงกับสี status | Active=เขียว, Delay=แดง, Complete=น้ำเงิน, Hold=ส้ม, Cancelled=เทา | UI | กลาง |
| 21 | 6 | ตัวเลขเป็นตัวหนาและสีดำ | ตัวเลข progress % ไม่เด่นชัด | CSS: `font-weight: bold; color: black` | UI/Label | เล็ก |

---

### หน้า My Projects (Slide 7-9) — 8 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 22 | 7 | เพิ่ม menu "My Projects" ใน sidebar | ต้องมีเมนู My Projects แยกชัดเจน | ตรวจว่าแสดงถูกต้อง (ตอนนี้มีแล้ว) | UX | เล็ก |
| 23 | 7 | แก้ title ของ page ตามหน้านั้นๆ | แต่ละหน้าต้องมี page title ที่ตรง | ใส่ document.title ให้ตรงทุกหน้า เช่น "My Projects", "My Tasks" | UI/Label | เล็ก |
| 24 | 7 | แสดงตัวเลข stat ตามจำนวนที่รับผิดชอบ | stat cards นับทุก project | นับเฉพาะ project ที่ user เป็น member | Permission | กลาง |
| 25 | 7 | เห็นเฉพาะ project ที่เป็น member | list project แสดงทั้งหมด | filter ตาม ProjectMember relation | Permission | กลาง |
| 26 | 7 | เติม label "Project Status :" ด้านหน้า | ตรง filter status ไม่มี label | เติมคำว่า "Project Status :" นำหน้า | UI/Label | เล็ก |
| 27 | 8 | ปุ่ม Export Excel และ Save PDF หายไป | เคยมีแต่ตอนนี้หายแล้ว | นำปุ่ม Export Excel + Save PDF กลับมา | Bug/Regression | กลาง |
| 28 | 9 | ขีดสีหน้า card ต้องตรงตาม status | แถบสีด้านซ้ายของ project card ไม่ตรง | Active=เขียว, Delay=แดง, Complete=น้ำเงิน, Hold=ส้ม, Cancelled=เทา | UI | เล็ก |
| 29 | — | List View ต้องจัด group/sort ตาม status | ไม่มีการจัดกลุ่มตาม status | เพิ่ม group by project status หรือ sort ตาม status ได้ | UX | กลาง |

---

### หน้า My Projects — Member View (Slide 23-24) — 2 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 30 | 23 | สถานะแสดงไม่ครบ + complete สีน้ำเงิน | บาง status ไม่แสดง, สี complete ไม่ตรง | แสดง status ครบทุกตัว + complete ต้องเป็นสีน้ำเงิน | Bug/UI | เล็ก |
| 29 | 24 | (ซ้ำ) ต้องการ group/sort ตาม project status | ไม่มีการจัดกลุ่ม | เพิ่ม sort/group by status | UX | กลาง |

---

### หน้า Project Detail — Member View (Slide 25) — 5 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 31 | 25 | Back to Projects ไม่กลับหน้าก่อนหน้า | กดปุ่มแล้วไม่กลับหน้าที่มา | ใช้ `navigate(-1)` หรือ `navigate('/my-projects')` ตาม context | Bug | เล็ก |
| 32 | 25 | Member ไม่ควรเห็นปุ่มเพิ่มคน/Edit/ลบ | ปุ่ม management แสดงให้ทุก role | ซ่อนปุ่มสำหรับ Member, แสดงเฉพาะ Admin/Manager | Permission | กลาง |
| 33 | 25 | Stat cards กดเข้าไปดู tasks ไม่ได้ | กรอบ Total Tasks/Completed/In Progress/% กดไม่ได้ | กดแล้ว scroll ไปที่ task list หรือ filter ตาม status นั้น | UX | กลาง |
| 34 | 25 | Board View — Member เห็น task ทุกตัว | แสดงทุก task ใน project | แสดงเฉพาะ task ที่ Member ได้รับ assign | Permission | ใหญ่ |
| 35 | 25 | Task มองไม่เห็น Assignee/Owner | task card ไม่แสดงว่าใครรับผิดชอบ | เพิ่ม avatar/ชื่อ assignee บน task card | UX | กลาง |

---

### หน้า My Tasks (Slide 10, 12, 36-37) — 5 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 36 | 10 | เปลี่ยนสี status + เพิ่ม Overdue | สี status ไม่สดชัด, ไม่มี Overdue | ปรับสี status ใหม่ + เพิ่ม "Overdue" (task เลยกำหนด) แสดงสีแดง — computed จาก dueDate < now && status ไม่ใช่ DONE/CANCELLED | UI + Logic | กลาง |
| 37 | 10,12 | เพิ่ม Table/List View พร้อม sorting | มีแค่ Board (Kanban) | เพิ่ม Table view มี columns: Task Name, Assignee, Start Date, Due Date, Priority — หัว column กด sort ASC/DESC ได้ | Feature | ใหญ่ |
| 38 | 10 | Role filtering ตาม Member/Admin | ทุก role เห็นเหมือนกัน | Admin เห็นทุก task, Member เห็นเฉพาะ task ที่ assign ตัวเอง | Permission | ใหญ่ |
| 39 | 12 | Filter หลายเงื่อนไข | filter มีจำกัด | เพิ่ม multi-filter: Task Status, Priority, Tags — เลือกหลายค่าพร้อมกันได้ | UX | กลาง |
| 40 | 37 | แสดง subtask count ใน task card | ไม่แสดงจำนวน subtask | เหมือน ClickUp แสดง subtask count เช่น "3/5" (3 เสร็จจาก 5) | UX | กลาง |

---

### หน้า Task Detail / Update (Slide 11, 13-15, 29, 33-35) — 10 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 41 | 11 | เพิ่ม comment/activity log เมื่อย้าย status | ย้าย task status ต้องบังคับใส่ comment ว่าย้ายเพราะอะไร | เก็บ history log stamp วันที่/เวลา — แสดงเป็น activity log แยก ไม่แสดงในกล่อง comment ของ task | Logic/UX | กลาง |
| 42 | 11 | Hold/Cancelled ดู logic คำนวณเวลา | ไม่ชัดเจนว่าเมื่อ Hold/Cancel แล้วคำนวณอย่างไร | Hold → หยุดนับเวลา ไม่นับรวมใน project progress / Cancelled → ตัดออกจากการคำนวณ | Logic | ใหญ่ |
| 43 | 13 | ย้าย Daily Updates ขึ้นไปต่อจาก Description | Daily Updates อยู่ด้านล่าง | ย้ายขึ้นมาต่อจาก Description + ขีดเส้นใต้คั่น ก่อนจะเป็น section Sub-Tasks | Layout/UX | กลาง |
| 44 | 14,33 | Update task ไม่มีปุ่มแนบไฟล์ + กด Update ขึ้น error | ปุ่มแนบไฟล์หายจากหน้า update, กด update ขึ้น "Failed to add update" | BUG ทั้ง frontend (ปุ่มหาย) และ backend (API error) — ต้อง debug ทั้ง 2 ฝั่ง | Bug | ใหญ่ |
| 45 | 15 | ลบ Current Status และ Progress (%) | ใน daily update form มี dropdown Current Status และ field Progress (%) | ลบออก — เพราะใช้ status ของ task ที่ด้านบนเป็นหลัก, % ถ้า done ก็เป็น 100% อัตโนมัติ | UX | เล็ก |
| 46 | 15 | แก้ label ปุ่มเป็น "Update" | ปุ่ม submit เขียนยาว | เปลี่ยนเป็นแค่คำว่า "Update" | UI/Label | เล็ก |
| 47 | 15 | ปุ่มแนบไฟล์ — ต้องแนบได้หลายไฟล์ รวมไม่เกิน 20MB ต่อ note | ปุ่มแนบไฟล์หาย | นำปุ่มกลับมา + รองรับหลายไฟล์ + validate ขนาดรวมไม่เกิน 20MB ต่อ 1 note | Bug + Feature | กลาง |
| 48 | 34 | แนบไฟล์แล้วไม่แสดงรูปภาพ | upload สำเร็จแต่ preview ไม่ขึ้น | ตรวจ file path / URL ที่ frontend ใช้แสดง + Docker volume mount | Bug | กลาง |
| 49 | 35 | แนบไฟล์แล้ว download ไม่ได้ | กดปุ่ม download ไฟล์ไม่มา | ตรวจ API route + Docker volume mount + file path ใน DB | Bug | กลาง |
| 50 | 29 | Add Subtask แสดง status เป็น text แต่ Create New Task แสดงเป็นสี | UI ไม่ consistent | ทำให้เหมือนกัน — subtask แสดง status เป็นสี badge เหมือน task | UI | เล็ก |

---

### หน้า Subtask (Slide 16) — 5 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 51 | 16 | Subtask ต้องมี Start Date / Due Date | UI ไม่แสดง date picker ใน subtask | เพิ่ม Start Date และ Due Date ใน subtask form (schema มีแล้วเพราะใช้ Task model เดียวกัน) | Feature/UX | กลาง |
| 52 | 16 | Subtask ต้อง assign คนรับผิดชอบได้ | ไม่มี assignee selector ใน subtask | เพิ่ม assignee selector ใน subtask form | Feature/UX | กลาง |
| 53 | 16 | ลบ tags ใน subtask | subtask มี tag selector | ลบออก — อ้างอิงตาม task หลัก | UX | เล็ก |
| 54 | 16 | แก้ปุ่มเป็น "Move to task" | ปุ่ม convert subtask → task ยังใช้ icon/wording เดิม | เปลี่ยน label เป็น "Move to task" + แก้ icon | UI/Label | เล็ก |
| 55 | 16 | แก้ไข wording subtask ไม่ได้ | พิมพ์ชื่อ subtask ผิดแล้วแก้ไขไม่ได้ | ทำให้ชื่อ subtask editable (inline edit หรือ edit modal) | Bug/UX | กลาง |

---

### หน้า Gantt View (Slide 17, 26) — 9 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 56 | 17 | Time Remaining ไม่ต้องหมุน + จัด 1 บรรทัด | animation spinner ใน Time Remaining | ลบ animation ออก + จัดเรียงเนื้อหาเหลือ 1 บรรทัดต่อช่อง | UI/UX | เล็ก |
| 57 | 17 | ขีดสีตาม status | แถบสีด้านซ้ายของ task ใน Gantt ไม่ตรง status | ใช้สี Active=เขียว, Delay=แดง, Complete=น้ำเงิน, Hold=ส้ม, Cancelled=เทา | UI | เล็ก |
| 58 | 17 | Gantt drag วันที่ → auto update task + revision log | ลาก bar เพื่อขยับ/ย่อ-ขยาย | อัปเดต startDate/dueDate อัตโนมัติ + บันทึก revision log (ชื่อ user, วันที่, เวลา) | Feature | ใหญ่ |
| 59 | 17 | Hover Task Name → แสดง 3 last activity | ไม่มี hover tooltip | mouse hover ที่ชื่อ task → popup แสดง 3 activity ล่าสุด | Feature/UX | กลาง |
| 60 | 17 | Gantt View หายไป (ใน MyTasksPage) | ตอนนี้มีแค่ Board + List | **ข้ามไว้ก่อน** — ตามที่ตกลง | — | — |
| 61 | 26 | Gantt แสดง task ไม่ครบ | บาง task ไม่ขึ้นใน Gantt | ตรวจว่า task ที่ไม่มี date ถูกกรองออกหรือแสดง default | Bug | กลาง |
| 62 | 26 | Freeze 2 columns (Task Name, Duration) | เมื่อ scroll timeline ด้านขวา column หายไป | 2 column แรกต้อง sticky (CSS: `position: sticky; left: 0`) | UX | กลาง |
| 63 | 26 | ขยับ bar แล้วเด้งไป Board View | drag bar ใน Gantt → ระบบเปลี่ยน tab ไป Board | BUG — ต้อง fix event handler ไม่ให้ trigger tab change | Bug | กลาง |
| 64 | 26 | กด status filter ใน Gantt ไม่ได้ | box status ด้านบน Gantt กดเพื่อ filter ไม่ทำงาน | fix event handler ของ status filter boxes | Bug | กลาง |

---

### หน้า Calendar (Slide 18) — 4 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 65 | 18 | ตัด 2 กล่อง stat ทิ้ง | กล่อง stat ด้านบน Calendar | ลบออก | UI/UX | เล็ก |
| 66 | 18 | แสดง Task ตามสี status | task ใน calendar สีไม่ตรง status | สีวงกลม/แถบต้องตรงกับ status ของ task | UI | เล็ก |
| 67 | 18 | Filter: Task Status, Tags, Priority | ต้องการ filter | เพิ่ม filter dropdown สำหรับ Status, Tags, Priority (มีบางส่วนแล้ว ตรวจให้ครบ) | UX | กลาง |
| 68 | 18 | Email notify เมื่อ assign/เปลี่ยน status (Zimbra) | ไม่มี email system | **ข้ามไว้ก่อน** — ต้องมี SMTP config | — | — |

---

### Internal Project / Responsive (Slide 19) — 3 ข้อ

| # | Slide | สิ่งที่ user ต้องการ | อธิบายรายละเอียด | สิ่งที่ต้องทำ | ประเภท | ความยาก |
|---|-------|---------------------|-----------------|-------------|--------|---------|
| 69 | 19 | แยกประเภท Project: report ผบห. vs internal | ต้องแบ่ง 2 ประเภท | (1) Project = report ผู้บริหาร มีคำนวณ % (2) Internal = งานย่อยภายใน tracking เฉพาะทีม — ปัจจุบันมี projectType PROJECT/INTERNAL อยู่แล้ว ต้องตรวจว่า logic แยกถูกต้อง | Logic | กลาง |
| 70 | 19 | Manager สร้าง internal project + tag member ได้ / Member สร้าง task ได้ | permission ยังไม่แยก | Manager สร้าง internal project + เพิ่ม member ได้ → Member สร้าง Task ภายใน project ได้เอง | Permission | กลาง |
| 71 | 19 | Responsive web: PC, Notebook, Tablet, iPad | ยังไม่ responsive เต็มที่ | **ข้ามไว้ก่อน** — ทำเป็นลำดับท้าย | — | — |

---

## แผนงาน Sprint

| Sprint | ระยะเวลา | จำนวน Issues | โฟกัส | สถานะ |
|--------|---------|-------------|-------|-------|
| **A** | สัปดาห์ 1 | 22 ข้อ | Critical Bugs + Permission | รอเริ่ม |
| **B** | สัปดาห์ 2 | 20 ข้อ | Core UX + Feature Fix | รอเริ่ม |
| **C** | สัปดาห์ 3 | 18 ข้อ | UI Polish + Branding | รอเริ่ม |
| **D** | สัปดาห์ 4+ | 11 ข้อ | New Features | รอเริ่ม |

---

## Sprint A — Critical Bugs & Permission

**เป้าหมาย:** แก้ bug ที่ทำให้ระบบใช้งานจริงไม่ได้ + แก้ permission ให้ data แสดงตาม Role

| ลำดับ | Issue # | รายละเอียด | ไฟล์ที่ต้องแก้ | ประเภท | ความยาก |
|------|---------|-----------|--------------|--------|---------|
| A-1 | 3,13,17,18 | Dashboard แสดงข้อมูลไม่ตาม Role — Member ต้องเห็นเฉพาะ project/task ที่ assign | `DashboardPage.tsx` + `project.service.ts` + `task.service.ts` | Backend+Frontend | ใหญ่ |
| A-2 | 25,34 | My Projects + Board View — Member เห็น Project/Task ทุกตัว | `MyProjectsPage.tsx` + `ProjectDetailPage.tsx` + `task.service.ts` | Backend+Frontend | ใหญ่ |
| A-3 | 32 | Member เห็นปุ่ม Admin (เพิ่มคน/Edit/ลบ) | `ProjectDetailPage.tsx` | Frontend | กลาง |
| A-4 | 38 | My Tasks — Role filtering ไม่ทำงาน | `MyTasksPage.tsx` + `task.service.ts` | Backend+Frontend | ใหญ่ |
| A-5 | 44,47 | Update task fail + ไม่มีปุ่มแนบไฟล์ | `TaskDetailModal.tsx` + `dailyUpdate.service.ts` | Full-stack | ใหญ่ |
| A-6 | 48,49 | แนบไฟล์ไม่แสดง + download ไม่ได้ | `attachment.service.ts` + frontend components | Backend | ใหญ่ |
| A-7 | 60 | Gantt View หายไป (ใน ProjectDetailPage) | `ProjectDetailPage.tsx` — ตรวจ import path | Frontend | กลาง |
| A-8 | 27 | Export Excel / PDF หายไป | `MyProjectsPage.tsx` | Frontend | กลาง |
| A-9 | 2 | Forgot Password 404 → ซ่อน link | `LoginPage.tsx` | Frontend | เล็ก |
| A-10 | 31 | Back to Projects ไม่กลับหน้าก่อนหน้า | `ProjectDetailPage.tsx` | Frontend | เล็ก |
| A-11 | 14 | Stat card กดแล้วไปคนละหน้า | `DashboardPage.tsx` | Frontend | กลาง |
| A-12 | 15 | Team Members กดแล้วไปหน้า project แทน | `DashboardPage.tsx` | Frontend | กลาง |
| A-13 | 16 | จุดสถานะ complete ไม่เป็นวงกลม | CSS file | Frontend | เล็ก |
| A-14 | 63 | Gantt ขยับ bar แล้วเด้งไป Board View | `GanttChart.tsx` | Frontend | กลาง |
| A-15 | 64 | Gantt กด status filter ไม่ได้ | `GanttChart.tsx` | Frontend | กลาง |
| A-16 | 30 | สถานะแสดงไม่ครบ + complete สีน้ำเงิน | `constants/index.ts` + CSS | Frontend | เล็ก |
| A-17 | 55 | แก้ไข wording subtask ไม่ได้ | SubTaskList component | Frontend | กลาง |
| A-18 | 61 | Gantt แสดง task ไม่ครบ | `GanttChart.tsx` | Frontend | กลาง |
| A-19 | 24 | Stat แสดงตัวเลขไม่ตาม Role | `MyProjectsPage.tsx` | Frontend | กลาง |

---

## Sprint B — Core UX & Feature Fix

**เป้าหมาย:** แก้ไข UX ที่ user ใช้งานลำบาก + เพิ่ม feature ที่ขาด

| ลำดับ | Issue # | รายละเอียด | ไฟล์ที่ต้องแก้ | ประเภท | ความยาก |
|------|---------|-----------|--------------|--------|---------|
| B-1 | 6,7 | Quick Access + Team Activity ล้นจอ → ย้ายลงล่าง | `DashboardPage.tsx` + `DashboardPage.css` | Frontend | กลาง |
| B-2 | 8 | My Activity Tasks กดชื่อ link ไม่ได้ | `DashboardPage.tsx` | Frontend | เล็ก |
| B-3 | 11 | Sidebar ไม่มีปุ่มย่อ/ขยาย ที่ชัดเจน | `Sidebar.tsx` + `Sidebar.css` | Frontend | กลาง |
| B-4 | 37 | My Tasks List View + sorting columns (แบบ ClickUp) | `MyTasksPage.tsx` | Frontend | ใหญ่ |
| B-5 | 39 | Multi-filter: Status, Priority, Tags | `MyTasksPage.tsx` | Frontend | กลาง |
| B-6 | 40 | Subtask count ใน task card (แบบ ClickUp "3/5") | `MyTasksPage.tsx` + task card component | Frontend | กลาง |
| B-7 | 43 | ย้าย Daily Updates ต่อจาก Description + ขีดเส้นคั่น | `TaskDetailModal.tsx` | Frontend | กลาง |
| B-8 | 51,52 | Subtask: เพิ่ม Start Date + Due Date + Assignee | SubTaskList component + backend | Full-stack | ใหญ่ |
| B-9 | 56 | Time Remaining ไม่ต้องหมุน + จัด 1 บรรทัด | `GanttChart.tsx` | Frontend | เล็ก |
| B-10 | 62 | Gantt freeze 2 columns (Task Name, Duration) | `GanttChart.tsx` + CSS | Frontend | กลาง |
| B-11 | 33 | Stat cards ใน Project Detail กดเข้าไปดู tasks ได้ | `ProjectDetailPage.tsx` | Frontend | กลาง |
| B-12 | 29 | My Projects List View group/sort ตาม status | `MyProjectsPage.tsx` | Frontend | กลาง |
| B-13 | 35 | แสดง Assignee/Owner ใน Task card | task card component | Frontend | กลาง |
| B-14 | 41 | Activity log เมื่อย้าย status — แยกจาก comment | `TaskDetailModal.tsx` + `StatusChangeLog` | Frontend | กลาง |
| B-15 | 42 | Hold/Cancelled logic คำนวณเวลา project | `project.service.ts` + `task.service.ts` | Backend | ใหญ่ |
| B-16 | 36 | เปลี่ยนสี status + เพิ่ม Overdue | `constants/index.ts` + `MyTasksPage.tsx` | Frontend | กลาง |
| B-17 | 59 | Gantt Hover Task Name → แสดง 3 last activity | `GanttChart.tsx` | Frontend | กลาง |
| B-18 | 67 | Calendar Filter: Task Status, Tags, Priority | `CalendarPage.tsx` | Frontend | กลาง |
| B-19 | 69,70 | Internal Project แยกประเภท + permission Manager/Member | `project.service.ts` + frontend | Full-stack | กลาง |

---

## Sprint C — UI Polish & Branding

**เป้าหมาย:** ปรับ UI ให้ตรงตาม SENA brand + แก้ label/สี/font ทั้งหมด

| ลำดับ | Issue # | รายละเอียด | ไฟล์ที่ต้องแก้ | ประเภท | ความยาก |
|------|---------|-----------|--------------|--------|---------|
| C-1 | 1 | Title → "IT Project System" | `index.html` + `LoginPage.tsx` | UI/Label | เล็ก |
| C-2 | 4 | Logo → SENA (`PIC/SenaDlogo.png`) | `Sidebar.tsx` + assets | UI/Label | เล็ก |
| C-3 | 5 | "Welcome back" → "Dashboard" | `DashboardPage.tsx` | UI/Label | เล็ก |
| C-4 | 9 | Section header → "IT Overall" | `DashboardPage.tsx` | UI/Label | เล็ก |
| C-5 | 10 | 4 stat cards ไม่ใส่สี (neutral/ขาว) | `DashboardPage.css` | UI/Label | เล็ก |
| C-6 | 12 | Label → "View My Projects" | `DashboardPage.tsx` | UI/Label | เล็ก |
| C-7 | 13 | Member view → "Project Overall" | `DashboardPage.tsx` | UI/Label | เล็ก |
| C-8 | 19 | เพิ่ม category "Infrastructure and Network" | `constants/index.ts` หรือ TimelinePage config | Config | เล็ก |
| C-9 | 20,28,57 | แถบสีตรงตาม status ทุกหน้า | `constants/index.ts` + CSS หลายไฟล์ | UI | กลาง |
| C-10 | 21 | ตัวเลขตัวหนา สีดำ | CSS files | UI/Label | เล็ก |
| C-11 | 22 | ตรวจ menu "My Projects" ใน sidebar | `Sidebar.tsx` | UI | เล็ก |
| C-12 | 23 | Page title ตามหน้า (document.title) | ทุก page component | UI/Label | เล็ก |
| C-13 | 26 | Label "Project Status :" ด้านหน้า filter | `MyProjectsPage.tsx` | UI/Label | เล็ก |
| C-14 | 45 | ลบ Current Status + Progress (%) ใน daily update | `TaskDetailModal.tsx` | UX | เล็ก |
| C-15 | 46 | แก้ label ปุ่มเป็น "Update" | `TaskDetailModal.tsx` | UI/Label | เล็ก |
| C-16 | 50 | Subtask status แสดงเป็นสี badge (เหมือน task) | SubTaskList component | UI | เล็ก |
| C-17 | 53 | ลบ tags ใน subtask | SubTaskList component | UX | เล็ก |
| C-18 | 54 | ปุ่ม "Move to task" + แก้ icon | SubTaskList component | UI/Label | เล็ก |
| C-19 | 65 | Calendar ตัด 2 กล่อง stat ทิ้ง | `CalendarPage.tsx` | UI/UX | เล็ก |
| C-20 | 66 | Calendar แสดง Task ตามสี status | `CalendarPage.tsx` | UI | เล็ก |
| C-21 | 58 | Gantt drag → auto update task + revision log | `GanttChart.tsx` + backend | Feature | ใหญ่ |

---

## Sprint D — New Features

**เป้าหมาย:** เพิ่ม feature ใหม่ที่ user ร้องขอ

| ลำดับ | Issue # | รายละเอียด | ไฟล์ที่ต้องแก้ | ประเภท | ความยาก |
|------|---------|-----------|--------------|--------|---------|
| D-1 | 58 | Gantt drag วันที่ → auto update + revision activity log | `GanttChart.tsx` + backend API | Feature | ใหญ่ |
| D-2 | 71 | Responsive web: PC, Notebook, Tablet, iPad | CSS ทุกหน้า | Feature | ใหญ่ |

---

## สิ่งที่ข้ามไว้ก่อน

| # | Issue | เหตุผลที่ข้าม |
|---|-------|-------------|
| 60 | Gantt View ใน MyTasksPage | ตกลงกับ user ว่าข้ามไว้ก่อน |
| 68 | Email notify Zimbra | ยังไม่มี SMTP config / ข้ามไว้ก่อน |
| 71 | Responsive Tablet/iPad | ทำเป็นลำดับท้าย |

---

## ความเสี่ยงและ Dependencies

| ความเสี่ยง | โอกาส | ผลกระทบ | แนวทางจัดการ |
|-----------|-------|---------|-------------|
| Permission fix กระทบ API ทุก endpoint | สูง | สูง | ทำที่ service layer + test ทุก role ทุกหน้า |
| File attachment path ต่างกัน local vs Docker | กลาง | สูง | ตรวจ Docker volume mount + env vars |
| Gantt refactor อาจใช้เวลามาก | กลาง | กลาง | Fix import ก่อน, enhance ทีหลัง |
| V2 refactor ทำให้ feature เดิม regression | สูง | สูง | ตรวจ import paths ที่เปลี่ยนจาก restructure |

### Dependencies ที่ต้องการ

| รายการ | สถานะ | หมายเหตุ |
|-------|-------|---------|
| SENA logo file | ✅ มีแล้ว | `PIC/SenaDlogo.png` |
| Test account (Manager) | ✅ มีแล้ว | `tharab@sena.co.th` / 123456 |
| Zimbra SMTP credentials | ⏭️ ข้ามไว้ | ต้องขอจาก IT Infra เมื่อถึง Sprint D |

---

> **สร้างโดย:** AI Team Meeting (BA + Head Team + Senior Engineer + Code Reviewer + Data Engineer)
> **วันที่:** 2026-05-06
