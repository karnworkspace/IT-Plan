# สรุปปัญหาจาก Feedback Review — 6 เมษายน 2026

**ที่มา:** review app project update 31 Mar 2026.pptx (15 slides)

---

## A. UI/UX (19 รายการ)

| ลำดับ | หน้า | รายละเอียดปัญหา | Slide | Priority | สถานะ |
|-------|------|----------------|-------|----------|-------|
| U01 | Login | เปลี่ยน Title จาก "Frontend" เป็น "IT Project System" | 1 | P2 | |
| U02 | Login | Forgot Password กดแล้วเจอ 404 Not Found — ถ้ายังใช้ไม่ได้ให้ลบลิงก์ออก | 1 | P2 | |
| U03 | Dashboard | เปลี่ยน logo เป็น logo เสนา | 2 | P2 | |
| U04 | Dashboard | เปลี่ยนคำว่า "Welcome back" เป็น "Dashboard" | 2 | P2 | |
| U05 | Dashboard | ส่วน Quick Access ล้นจอไปทางขวา — ย้ายลงมาอยู่ด้านล่างต่อจาก Recent Projects | 2 | P1 | |
| U06 | Dashboard | ส่วน Team Activity ล้นจอไปทางขวา — ย้ายลงมาอยู่ด้านล่างต่อจาก My Active Tasks | 2 | P1 | |
| U07 | Dashboard | ใส่คำว่า "IT Overall" เป็น header section | 3 | P2 | |
| U08 | Dashboard | 4 กล่อง stat ไม่ต้องใส่สี ให้เป็นแบบเดียวกันกับด้านหน้า (พื้นขาว) | 3 | P2 | |
| U09 | Dashboard | เปลี่ยน label เป็น "View My Projects" | 3 | P2 | |
| U10 | Sidebar | ต้องสามารถกดย่อ (<<) หรือขยาย (>>) เมนู Sidebar ได้ เพื่อแสดงผลส่วนอื่นได้มากขึ้น | 3 | P1 | |
| U11 | Projects/Timeline | เปลี่ยนแถบสีของ plan ให้เป็นแบบเดียวตาม Project | 4 | P2 | |
| U12 | Projects/Timeline | เปลี่ยนแถบสีของสถานะให้ตรงกับ Active, Delay, Complete, Hold, Cancelled | 4 | P2 | |
| U13 | Projects/Timeline | ตัวเลขขอให้เป็นตัวหนาและสีดำ | 4 | P2 | |
| U14 | My Projects | ขีดสีด้านหน้า List View ต้องแสดงตรงตามสถานะ Project | 6 | P2 | |
| U15 | My Projects | แก้ไข title ของ page ตามหน้านั้นๆ เช่น "My Projects" | 5 | P2 | |
| U16 | My Projects | เติม label ด้านหน้าเขียนว่า "Project Status :" | 5 | P2 | |
| U17 | Task Detail | ย้ายส่วน Daily Updates ขึ้นไปอยู่ต่อจาก Description และมีเส้นคั่นระหว่าง section | 10 | P2 | |
| U18 | Gantt | Time Remaining ไม่ต้องหมุน และกล่องทุกช่องจัดเรียงให้เหลือแค่ 1 บรรทัด | 13 | P2 | |
| U19 | Calendar | ตัด 2 กล่อง stat ด้านบนออก | 14 | P2 | |

---

## B. Role & Permission (5 รายการ)

| ลำดับ | หน้า | รายละเอียดปัญหา | Slide | Priority | สถานะ |
|-------|------|----------------|-------|----------|-------|
| R01 | Dashboard | ทุกคนเห็นหน้า Dashboard จำนวน Project เท่ากันหมด — ต้องแบ่งตาม Role (Admin เห็นทั้งหมด, Member เห็นเฉพาะของตัวเอง) | 2 | P0 | |
| R02 | My Tasks | Role Member เห็นเฉพาะ Task ที่มีการ assign ตัวเอง, Role Admin เห็นทุก Task | 7 | P0 | |
| R03 | My Projects | ส่วน My Projects ต้องเห็นเฉพาะ project ที่เราเป็น Member เท่านั้น | 5 | P0 | |
| R04 | Projects | Manager สร้าง project ได้ และสามารถ tag user member เข้ากลุ่มใน project | 15 | P1 | |
| R05 | Tasks | Member สามารถสร้าง Task ได้เอง เพื่อ tracking งานภายใน | 15 | P1 | |

---

## C. Features ใหม่ (18 รายการ)

| ลำดับ | หน้า | รายละเอียดปัญหา | Slide | Priority | สถานะ |
|-------|------|----------------|-------|----------|-------|
| F01 | Login | Forgot Password ถ้าจะใช้งานได้ ให้มีการส่ง mail เข้าที่ Email ของ user เพื่อตั้ง password ใหม่ | 1 | P2 | |
| F02 | Sidebar | เพิ่ม menu "My Projects" ใน Sidebar | 5 | P1 | |
| F03 | My Projects | สร้างหน้า My Projects ใหม่ — แสดงเฉพาะ project ที่เราเป็น Member พร้อมตัวเลข stat ตามจำนวนที่รับผิดชอบ | 5 | P1 | |
| F04 | My Tasks | เปลี่ยนสี status ใหม่ และเพิ่มสถานะ "Overdue" แสดงด้วย | 7 | P2 | |
| F05 | My Tasks | เพิ่มแสดงผลแบบตาราง (List View) มี column: Task Name, Assignee, Start Date, Due Date, Priority — คลิกหัว column เพื่อ sorting ได้ทั้ง ASC และ DESC | 7, 9 | P1 | |
| F06 | My Tasks | สามารถใส่ Filter ได้หลายเงื่อนไข: Task Status, Priority, Tags (เหมือนระบบ ClickUp) | 9 | P1 | |
| F07 | My Tasks | สามารถเลื่อนสลับ status column ขึ้นบนหรือลงล่างได้ (เหมือนระบบ ClickUp) | 9 | P3 | |
| F08 | Task Status | เมื่อมีการย้าย task status ต้องใส่ comment เสมอ (mandatory) ว่าย้ายเนื่องจากอะไร | 8 | P0 | |
| F09 | Task Status | เก็บ History log ทุกครั้งที่ย้าย status — stamp ชื่อ user, วันที่, เวลา และ note comment | 8 | P0 | |
| F10 | Task Status | การ move ไป Hold หรือ Cancelled ต้องดู logic คำนวณเวลา project ว่านับอย่างไร (หยุดนับเมื่อ Hold/Cancelled) | 8 | P1 | |
| F11 | Task Detail | ลบ "Current Status" และ "Progress (%)" ออก — ใช้ status ของ Task ด้านบนเป็นหลัก, % ถ้าทำเสร็จก็เป็น 100% เอง | 11 | P1 | |
| F12 | Task Detail | แก้ label ปุ่มเหลือแค่คำว่า "Update" อย่างเดียว | 11 | P2 | |
| F13 | Task Detail | ปุ่มแนบไฟล์หายไป — ต้องแนบไฟล์ได้มากกว่า 1 ไฟล์ รวมทุกไฟล์ไม่เกิน 20 MB ต่อ 1 Notes | 11 | P1 | |
| F14 | Subtask | Subtask ต้องมีวันที่เริ่มต้น วันที่สิ้นสุด และสามารถ assign คนรับผิดชอบได้ (Subtask ไม่ต้องมี Tag เพราะ relate กับ Task อยู่แล้ว) | 12 | P1 | |
| F15 | Subtask/Tag | ต้องสามารถ Create, Edit, Delete tag ได้ และ apply กับตัวที่มี tag นี้อยู่ทั้งหมด สามารถใส่สีใน tag ได้ | 12 | P2 | |
| F16 | Subtask | แก้ไขปุ่มจาก "Convert to Task" เป็น "Move to task" | 12 | P2 | |
| F17 | Gantt | สามารถ drag ขยับวันเริ่มต้น/สิ้นสุดของ task ที่ Gantt ได้ และ auto แก้ไขใน task ให้เลย พร้อม revision activity (ชื่อ user, วันที่, เวลา) — คลิกที่ Task Name เปิด task ได้ และ Mouse Hover แสดง 3 last activity | 13 | P3 | |
| F18 | Calendar | แสดง Task ตามสีของสถานะ, มี Filter (Task Status, Tags, Priority) และเมื่อ assign งาน/ปรับ status ควรยิง calendar email เข้า Zimbra (ถ้าทำได้) | 14 | P2 | |

---

## D. Data / Architecture (5 รายการ)

| ลำดับ | หน้า | รายละเอียดปัญหา | Slide | Priority | สถานะ |
|-------|------|----------------|-------|----------|-------|
| D01 | Projects/Timeline | ขาดกลุ่มงาน "Infrastructure and Network" ของฝั่งพี่เบิร์ด — ต้องเพิ่ม category นี้ | 4 | P2 | |
| D02 | Projects | แยกประเภท Project เป็น 2 แบบ: (1) Project ที่ต้อง report ผู้บริหาร มีการคำนวณเปอร์เซ็นต์ (2) Internal project สำหรับงานย่อยภายใน | 15 | P0 | |
| D03 | Gantt | Activity log ต้องครบถ้วน — เก็บ user, วันที่, เวลา ของทุกการเปลี่ยนแปลง | 13 | P1 | |
| D04 | Subtask | Subtask ไม่ต้องมี Tag (inherit จาก parent task) | 12 | P2 | |
| D05 | ทั้งระบบ | Responsive web — ใช้งานได้ทั้งใน PC, Notebook, Tablet, iPad | 15 | P3 | |

---

## สรุปจำนวนตาม Priority

| Priority | คำอธิบาย | จำนวน |
|----------|---------|-------|
| **P0** | Critical — กระทบการใช้งานหลัก/ข้อมูลรั่ว | 5 |
| **P1** | High — Feature หลักที่ขาด | 11 |
| **P2** | Medium — ปรับ UI/UX, text, สี | 23 |
| **P3** | Low — Nice-to-have, effort สูง | 8 |
| **รวม** | | **47** |
