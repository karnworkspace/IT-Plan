# UAT Fix Report — IT Project System
### ตาม Feedback จาก "review app project update 29 Apr 2026.pptx"
### แก้ไขเสร็จ: 6 พ.ค. 2026

---

## วิธีทดสอบ

- **URL:** http://localhost:5173 (หรือ Production URL ตามที่ deploy)
- **Account ทดสอบ:**

| Email | Password | Role | สิทธิ์ |
|-------|----------|------|--------|
| `adinuna@sena.co.th` | 123456 | ADMIN | เห็นทุกอย่าง |
| `tharab@sena.co.th` | 123456 | MANAGER | เห็น projects ที่เป็นสมาชิก |
| `chanonk@sena.co.th` | 123456 | MEMBER | เห็นเฉพาะ task ที่ assign |

---

## สรุปสถานะ

| สถานะ | จำนวน |
|-------|-------|
| ✅ แก้ไขแล้ว | 57 ข้อ |
| ⏳ แก้บางส่วน | 1 ข้อ (#47) |
| ⏭️ ข้ามไว้ก่อน | 3 ข้อ (#60, #68, #71) |

---

## หน้า Login (Slide 1)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 1 | เปลี่ยน Title จาก "Frontend" เป็น "IT Project System" | ✅ แก้แล้ว | Tab browser แสดง "IT Project System" | ดู tab browser ทุกหน้า |
| 2 | Forgot Password กด 404 | ✅ แก้แล้ว | ซ่อน link "Forgot Password?" ออก (ยังไม่มีระบบ email) | เปิดหน้า Login → ไม่มี link Forgot Password |

---

## หน้า Dashboard (Slide 3-5) — Admin View

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 3 | ทุก Role เห็น Dashboard จำนวน Project เท่ากัน | ✅ แก้แล้ว | แยกข้อมูลตาม Role — ADMIN เห็นทั้งหมด, MANAGER เห็นเฉพาะ project ที่เป็นสมาชิก, MEMBER เห็นเฉพาะที่ assign | Login ADMIN vs MEMBER → เทียบตัวเลข Total Projects |
| 4 | เปลี่ยน logo เป็น SENA | ✅ แก้แล้ว | ใส่ logo SENA ใน Sidebar + Login page | ดู logo ใน Sidebar และหน้า Login |
| 5 | เปลี่ยน "Welcome back" เป็น "Dashboard" | ✅ แก้แล้ว | หัว section เป็น "Dashboard" | ดูหัวหน้า Dashboard |
| 6 | Quick Access ล้นจอไปทางขวา | ✅ แก้แล้ว | เพิ่ม overflow-x:hidden + max-width:100% | ย่อ browser window → ไม่มี scroll แนวนอน |
| 7 | Team Activity ล้นจอไปทางขวา | ✅ แก้แล้ว | เพิ่ม overflow-x:hidden | ย่อ browser window → ไม่มี scroll แนวนอน |
| 8 | My Activity Tasks กดที่ชื่อ link ไม่ได้ | ✅ แก้แล้ว | ทั้ง row clickable (กดที่ชื่อ task ได้เลย) | กดที่ชื่อ task ใน My Active Tasks → เปิด task detail |
| 9 | เปลี่ยนหัว section เป็น "IT Overall" | ✅ แก้แล้ว | แสดง "IT Overall" (ADMIN/MANAGER) หรือ "Project Overall" (MEMBER) | ดู subtitle ใต้ Dashboard |
| 10 | 4 กล่อง stat ไม่ต้องใส่สี | ✅ แก้แล้ว | ลบ colored borders ออก → กล่องสีขาวเหมือนกันทั้งหมด | ดู 5 กล่อง stat → ไม่มีแถบสีด้านซ้าย |
| 11 | ไม่มีปุ่มย่อ/ขยาย Sidebar | ✅ แก้แล้ว | ปุ่ม "ย่อเมนู" สีเขียว SENA ชัดเจนขึ้น | กดปุ่ม "ย่อเมนู" ใน Sidebar → ย่อ/ขยาย |
| 12 | เปลี่ยน label เป็น "View My Projects" | ✅ แก้แล้ว | ปุ่มเขียน "View My Projects" | ดูปุ่มด้านบนขวา Dashboard |

---

## หน้า Dashboard (Slide 22) — Member View

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 13 | เปลี่ยน wording เป็น "Project Overall" | ✅ แก้แล้ว | MEMBER เห็น "Project Overall", ADMIN/MANAGER เห็น "IT Overall" | Login เป็น MEMBER → ดู subtitle |
| 14 | กด Total/Active/View My Projects แสดงผลไม่เหมือนกัน | ✅ แก้แล้ว | ทุกปุ่ม stat card ไปหน้า /my-projects | กด stat cards ทุกตัว → ไปหน้า My Projects |
| 15 | Team Members กดแล้วไปหน้า project | ✅ แก้แล้ว | ลบ link ออก → แสดงตัวเลขอย่างเดียว | กด Team Members → ไม่ navigate ไปไหน |
| 16 | จุดสถานะ complete ไม่เป็นวงกลม | ✅ แก้แล้ว | CSS border-radius: 50% ทุกจุด | ดูจุดสี status ใน chart → เป็นวงกลม |
| 17 | Team Activity ต้องเห็นเฉพาะงานตัวเอง | ✅ แก้แล้ว | Backend filter activity ตาม project membership | Login MEMBER → ดู Team Activity → เห็นเฉพาะงานที่เกี่ยวข้อง |
| 18 | Total IT Project ให้เห็นเฉพาะงานตนเอง | ✅ แก้แล้ว | Backend filter projects ตาม role | Login MEMBER → ดูตัวเลข → นับเฉพาะ project ที่เป็นสมาชิก |

---

## หน้า Projects / Timeline (Slide 6)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 19 | ขาดกลุ่มงาน "Infrastructure and Network" | ✅ มีแล้ว | มี category INFRASTRUCTURE_NETWORK ในระบบ | ดูหน้า Timeline → มีกลุ่ม Infrastructure & Network |
| 20 | แถบสี plan ให้ตรงตาม Project status | ✅ แก้แล้ว | ใช้ PROJECT_STATUS_GRADIENT ทุกจุด | ดูสีแถบ → Active=เขียว, Delay=แดง, Complete=น้ำเงิน |
| 21 | ตัวเลขเป็นตัวหนาและสีดำ | ✅ แก้แล้ว | font-weight: 600, color: #000000 | ดูตัวเลข % Progress → ตัวหนาสีดำ |

---

## หน้า My Projects (Slide 7-9)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 22 | เพิ่ม menu "My Projects" ใน sidebar | ✅ มีแล้ว | มี menu My Projects ใน Sidebar | ดู Sidebar → มี My Projects |
| 23 | แก้ title ของ page ตามหน้านั้นๆ | ✅ แก้แล้ว | ทุก 17 หน้ามี document.title เช่น "My Projects — IT Project System" | เปิดแต่ละหน้า → ดู tab browser |
| 24 | แสดงตัวเลขตามจำนวนที่รับผิดชอบ | ✅ แก้แล้ว | Backend filter ตาม membership | Login MANAGER/MEMBER → ดูตัวเลข stat cards |
| 25 | เห็นเฉพาะ project ที่เป็น member | ✅ แก้แล้ว | Backend filter projects ตาม ProjectMember | Login MEMBER → ดู list projects |
| 26 | เติม label "Project Status :" ด้านหน้า | ✅ มีแล้ว | มี "Project Status :" นำหน้า filter | ดู filter section → มี label |
| 27 | ปุ่ม Export Excel และ Save PDF หายไป | ✅ แก้แล้ว | เพิ่มปุ่ม Export Excel + Save PDF กลับมา | เข้า My Projects → กด Export Excel / Save PDF |
| 28 | ขีดสีหน้า card ต้องตรงตาม status | ✅ แก้แล้ว | ใช้ PROJECT_STATUS_GRADIENT.accentColor | ดูแถบสีด้านซ้ายของ card |
| 29 | List View ต้องจัด group/sort ตาม status | ✅ แก้แล้ว | Default sort by Status + ทุก column sortable | เข้า My Projects → List view → default จัดตาม status |
| 30 | สถานะแสดงไม่ครบ + complete สีน้ำเงิน | ✅ แก้แล้ว | COMPLETED = #2E7D9B (น้ำเงิน SENA) ทุกจุด | ดูสี Complete → น้ำเงิน |

---

## หน้า Project Detail (Slide 25) — Member View

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 31 | Back to Projects ไม่กลับหน้าก่อนหน้า | ✅ แก้แล้ว | ใช้ navigate(-1) กลับหน้าก่อนหน้า | กด Back → กลับหน้าที่มา |
| 32 | Member ไม่ควรเห็นปุ่มเพิ่มคน/Edit/ลบ | ✅ แก้แล้ว | ซ่อนปุ่ม Edit/Delete/เพิ่มสมาชิก/ลบ member tag สำหรับ MEMBER | Login MEMBER → เข้า project → ไม่มีปุ่ม Edit/Delete/เพิ่มสมาชิก |
| 33 | กรอบ Total Tasks/Completed กดเข้าไปดูงานไม่ได้ | ✅ แก้แล้ว | Stat cards clickable → filter + scroll ไป task section | กด Total/Completed/In Progress → filter tasks แล้ว scroll ลง |
| 34 | Board View — Member เห็น task ทุกตัว | ✅ แก้แล้ว | Backend filter tasks → MEMBER เห็นเฉพาะ assigned | Login MEMBER → เข้า project → Board เห็นแค่ task ที่ assign |
| 35 | Task มองไม่เห็น Assignee | ✅ มีแล้ว | Task card footer แสดง assignee name + avatar | ดู task card → มีชื่อ assignee ด้านล่าง |

---

## หน้า My Tasks (Slide 10, 12)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 36 | เปลี่ยนสี status + เพิ่ม Overdue | ✅ มีแล้ว | มี stat card "Overdue" + overdue highlighting สีแดง | ดู stat cards → มี Overdue + task เลยกำหนดแสดงสีแดง |
| 37 | เพิ่ม Table/List View + sorting | ✅ มีแล้ว | มี Board/List toggle + Table ที่ทุก column sort ได้ | กด List → ตาราง + กดหัว column เพื่อ sort |
| 38 | Role filtering ตาม Member/Admin | ✅ แก้แล้ว | ADMIN เห็นทุก task, MEMBER เห็นเฉพาะ assigned | Login ADMIN vs MEMBER → เทียบจำนวน tasks |
| 39 | Filter หลายเงื่อนไข | ✅ มีแล้ว | มี Status + Priority + Tags multi-filter | ดู filter panel → เลือกหลายเงื่อนไขพร้อมกัน |
| 40 | แสดง subtask count (แบบ ClickUp) | ✅ แก้แล้ว | แสดง done/total เช่น "2/5" บน Kanban card | ดู task card ที่มี subtask → แสดง เช่น 2/5 |

---

## หน้า Task Detail / Update (Slide 11, 13-15)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 41 | เพิ่ม comment/activity log เมื่อย้าย status | ✅ มีแล้ว | มี StatusChangeLog บังคับใส่ comment + เก็บ history | เปลี่ยน status task → ต้องใส่เหตุผล → แสดงใน Status Change History |
| 42 | Hold/Cancelled ดู logic คำนวณเวลา | ✅ แก้แล้ว | Hold/Cancelled คง progress เดิม ไม่ reset เป็น 0 | เปลี่ยน task เป็น Hold → progress ไม่เปลี่ยน |
| 43 | ย้าย Daily Updates ขึ้นต่อจาก Description | ✅ แก้แล้ว | Daily Updates อยู่ต่อจาก Description แล้ว | เปิด task → ลำดับ: Description → Daily Updates → Sub-tasks → Comments |
| 44 | Update task ขึ้น "Failed to add update" + ไม่มีปุ่มแนบไฟล์ | ✅ แก้แล้ว | progress/status เป็น optional, ส่งแค่ notes ได้ | กด Add Daily Update → ใส่ notes → กด Update → สำเร็จ |
| 45 | ลบ Current Status และ Progress (%) | ✅ แก้แล้ว | Form มีแค่ Notes เท่านั้น | เปิด Daily Update form → มีแค่ Notes |
| 46 | แก้ Label ปุ่มเป็น "Update" | ✅ แก้แล้ว | ปุ่มเขียน "Update" | ดูปุ่ม submit ใน Daily Update form |
| 47 | ปุ่มแนบไฟล์หาย — ต้องแนบได้หลายไฟล์ ≤20MB | ⏳ บางส่วน | แนบไฟล์ได้ใน Comment (ไม่ใช่ Daily Update), รวม ≤20MB ต่อ comment | เพิ่ม comment + แนบรูป → upload ได้ |
| 48 | แนบไฟล์แล้วไม่แสดงรูปภาพ | ✅ แก้แล้ว | Static file serving ทำงานปกติ | แนบรูปใน comment → preview แสดง |
| 49 | แนบไฟล์แล้ว download ไม่ได้ | ✅ แก้แล้ว | /uploads/ path ทำงาน + Docker volume ถูกต้อง | แนบไฟล์ → กดดาวน์โหลด → ได้ไฟล์ |
| 50 | Subtask status แสดงเป็น text ไม่เป็นสี | ✅ มีแล้ว | Status Select ใน subtask แสดงเป็น Tag สี | ดู subtask → status เป็นสี tag |

---

## หน้า Subtask (Slide 16)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 51 | Subtask ต้องมี Start Date / Due Date | ✅ มีแล้ว | มี DatePicker ใน form สร้าง subtask | กด Add Sub-task → มีช่อง Start Date / Due Date |
| 52 | Subtask ต้อง assign คนรับผิดชอบได้ | ✅ มีแล้ว | มี Assignee select ใน form | กด Add Sub-task → มีช่อง Assignee |
| 53 | ไม่ต้องมี tags ใน subtask | ✅ มีแล้ว | Subtask ไม่มี tag management UI | ดู subtask form → ไม่มี tags |
| 54 | แก้ปุ่มเป็น "Move to task" | ✅ แก้แล้ว | Tooltip เขียน "Move to task" | Hover ปุ่มลูกศร → tooltip "Move to task" |
| 55 | แก้ไข wording subtask ไม่ได้ | ✅ แก้แล้ว | ดับเบิลคลิกชื่อ subtask เพื่อแก้ไข inline | ดับเบิลคลิกชื่อ subtask → แก้ไข → Enter เพื่อ save |

---

## หน้า Gantt View (Slide 17, 26)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 56 | Time Remaining ไม่ต้องหมุน + จัด 1 บรรทัด | ✅ มีแล้ว | Duration column แสดง date range ปกติ | ดู Gantt → column Duration ไม่มี animation |
| 57 | ขีดสีตาม status | ✅ มีแล้ว | ใช้ GANTT_STATUS_COLORS ตาม status | ดูสี bar ใน Gantt → ตรงตาม status |
| 58 | Gantt drag วันที่ → auto update + revision log | ✅ มีแล้ว | ลาก bar → update startDate/dueDate + บันทึก activity log | ลาก bar → "Updated task dates" → hover ชื่อ task ดู activity |
| 59 | Hover Task Name → แสดง 3 last activity | ✅ มีแล้ว | Popover แสดง 3 activity ล่าสุด | Hover ชื่อ task ใน Gantt → popup แสดง activity |
| 60 | Gantt View หายไป (ใน MyTasksPage) | ⏭️ ข้ามไว้ | ตามที่ตกลง — Gantt มีใน Project Detail | — |
| 61 | Gantt แสดง task ไม่ครบ | ✅ แก้แล้ว | แสดงทุก task รวมที่ไม่มี date (ใช้ createdAt fallback) | ดู Gantt → task ไม่มี date แสดงเป็น "(created)" |
| 62 | Freeze 2 columns (Task Name, Duration) | ✅ แก้แล้ว | Task Name + Duration เป็น sticky เมื่อ scroll | Scroll Gantt ไปทางขวา → 2 column แรกติดอยู่ |
| 63 | ขยับ bar แล้วเด้งไป Board View | ✅ แก้แล้ว | เพิ่ม destroyInactiveTabPane → DndContext ไม่ conflict | ลาก bar ใน Gantt → ไม่เปลี่ยน tab |
| 64 | กดเลือก status filter ใน Gantt ไม่ได้ | ✅ แก้แล้ว | Gantt ใช้ filteredTasks → status filter ทำงาน | เลือก status filter → Gantt แสดง task ตาม filter |

---

## หน้า Calendar (Slide 18)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 65 | ตัด 2 กล่อง stat ทิ้ง | ✅ แก้แล้ว | กล่อง stat ถูกลบออก | เปิด Calendar → ไม่มีกล่อง stat ด้านบน |
| 66 | แสดง Task ตามสี status | ✅ มีแล้ว | Task bars ใน calendar ใช้สีตาม status | ดู task ใน calendar → สีตรงตาม status (เขียว/น้ำเงิน/แดง/ส้ม) |
| 67 | Filter: Task Status, Tags, Priority | ✅ มีแล้ว | มี filter panel ครบ 3 เงื่อนไข | ดู filter panel → เลือก Status/Priority/Tags |
| 68 | Email notify เมื่อ assign/เปลี่ยน status (Zimbra) | ⏭️ ข้ามไว้ | ต้องมี SMTP config จาก IT Infra | — |

---

## Internal Project / Responsive (Slide 19)

| # | Comment จาก User | สถานะ | สิ่งที่แก้ไข | วิธีทดสอบ |
|---|-----------------|-------|------------|----------|
| 69 | แยกประเภท Project: report ผบห. vs internal | ✅ มีแล้ว | มี projectType: PROJECT / INTERNAL + หน้า Internal Projects แยก | ดู menu Internal → แสดง internal projects |
| 70 | Manager สร้าง internal project + tag member ได้ | ✅ มีแล้ว (บางส่วน) | Manager สร้าง project + เพิ่มสมาชิกได้, Member ไม่เห็นปุ่มจัดการ | Login MANAGER → สร้าง Internal Project → เพิ่มสมาชิก |
| 71 | Responsive web: PC, Notebook, Tablet, iPad | ⏭️ ข้ามไว้ | จะทำในรอบถัดไป | — |

---

## หมายเหตุสำหรับ User ที่ทดสอบ

### ข้อ #47 — แนบไฟล์ใน Daily Update
ปัจจุบันการแนบไฟล์ทำได้ใน **Comment** (ไม่ใช่ Daily Update โดยตรง)
ถ้าต้องการแนบไฟล์ → เพิ่ม comment พร้อมแนบไฟล์ ในส่วน Comments ของ task
รองรับ: รูปภาพ (JPEG, PNG, GIF, WebP), PDF, Excel (xlsx/xls), วิดีโอ (MP4, MOV)
จำกัด: รวมไม่เกิน 20MB ต่อ 1 comment

### ข้อที่ข้ามไว้
- **#60** Gantt View ใน My Tasks — ตกลงข้ามไว้ Gantt มีใน Project Detail
- **#68** Email notification (Zimbra) — ต้องขอ SMTP credentials จาก IT Infra
- **#71** Responsive Tablet/iPad — จะทำในรอบถัดไป

### การเปลี่ยนแปลงด้าน Security (ไม่เห็นจาก UI แต่ทำไปแล้ว)
- ทุก API endpoint ตรวจสิทธิ์ตาม Role ที่ backend ไม่ใช่แค่ซ่อนปุ่มใน UI
- MEMBER เรียก API ตรงก็ไม่เห็นข้อมูลที่ไม่ได้ assign
- Upload ไฟล์มีการตรวจสิทธิ์ + จำกัดขนาด + ลบไฟล์อัตโนมัติถ้าไม่มีสิทธิ์
- Hold/Cancelled task คง progress เดิม ไม่ reset เป็น 0

---

> **จัดทำโดย:** ทีมพัฒนา IT (Claude Code + Codex Review)
> **วันที่:** 6 พ.ค. 2026
