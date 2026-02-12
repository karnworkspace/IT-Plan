# Manual Test Scenario - TaskFlow

**Version:** 1.0
**Date:** 2026-02-10
**Testers:** 2 roles
**Environment:** Local (http://localhost:5173)

---

## Test Accounts

| Role | Email | Password | PIN |
|------|-------|----------|-----|
| MEMBER | tharab@sena.co.th | password123 | 123456 |
| ADMIN | adinuna@sena.co.th | password123 | 123456 |

> หมายเหตุ: Password/PIN อาจแตกต่าง ให้ใช้ค่าที่ตั้งไว้จริง

---

## สัญลักษณ์

- [ ] = ยังไม่ทดสอบ
- [x] = ผ่าน
- [!] = ไม่ผ่าน (ระบุรายละเอียดใน หมายเหตุ)

---

## 1. Authentication (การเข้าสู่ระบบ)

### 1.1 Login ด้วย Email/Password

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 1.1.1 | Login สำเร็จ (MEMBER) | tharab | 1. เปิดหน้า Login 2. กรอก email: tharab@sena.co.th 3. กรอก password 4. กด Login | เข้าสู่ Dashboard สำเร็จ, เห็นชื่อ "ธรา" ที่ sidebar | [ ] | |
| 1.1.2 | Login สำเร็จ (ADMIN) | adinuna | 1. เปิดหน้า Login 2. กรอก email: adinuna@sena.co.th 3. กรอก password 4. กด Login | เข้าสู่ Dashboard สำเร็จ, เห็นชื่อ "อดินันท์" ที่ sidebar | [ ] | |

### 1.2 Login ด้วย PIN

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 1.2.1 | Login PIN สำเร็จ | tharab | 1. เปิดหน้า Login 2. เลือก tab "PIN" 3. กรอก email + PIN 6 หลัก 4. กด Login | เข้าสู่ Dashboard สำเร็จ | [ ] | |
| 1.2.2 | Login PIN ผิด | tharab | 1. กรอก email ถูก + PIN ผิด 2. กด Login | แสดง error "Invalid PIN" | [ ] | |

### 1.3 Forgot Password

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 1.3.1 | Reset password สำเร็จ | tharab | 1. คลิก "Forgot Password" 2. กรอก email: tharab@sena.co.th 3. กรอก password ใหม่ 4. กด Reset | แสดง success, สามารถ login ด้วย password ใหม่ได้ | [ ] | |
| 1.3.2 | Reset password email ไม่มีในระบบ | - | 1. คลิก "Forgot Password" 2. กรอก email ที่ไม่มี 3. กด Reset | แสดง error "User not found" | [ ] | |

### 1.4 Forgot PIN

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 1.4.1 | Reset PIN สำเร็จ | adinuna | 1. คลิก "Forgot PIN" 2. กรอก email + password ยืนยันตัวตน 3. ตั้ง PIN ใหม่ | แสดง success, login ด้วย PIN ใหม่ได้ | [ ] | |
| 1.4.2 | Reset PIN password ไม่ถูก | adinuna | 1. คลิก "Forgot PIN" 2. กรอก email ถูก + password ผิด | แสดง error ยืนยันตัวตนไม่ผ่าน | [ ] | |

### 1.5 Logout

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 1.5.1 | Logout สำเร็จ | tharab | 1. กดปุ่ม "Logout" ที่ sidebar ล่าง | กลับไปหน้า Login, ไม่สามารถเข้า /dashboard ได้โดยไม่ login | [ ] | |
| 1.5.2 | Logout แล้วกด Back | adinuna | 1. Logout 2. กด Back ของ browser | ไม่กลับเข้า Dashboard, redirect ไป Login | [ ] | |

---

## 2. Dashboard (หน้าหลัก)

### 2.1 แสดงข้อมูลสรุป

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 2.1.1 | ดู Dashboard (MEMBER) | tharab | 1. Login 2. ดูหน้า Dashboard | เห็น 4 กล่อง: Active Projects, My Pending Tasks, Team Members, Completion Rate | [ ] | |
| 2.1.2 | ดู Dashboard (ADMIN) | adinuna | 1. Login 2. ดูหน้า Dashboard | เห็นข้อมูลเดียวกัน แต่จำนวนอาจต่างกัน (ADMIN เห็นทุก project) | [ ] | |

### 2.2 กล่อง Dashboard คลิกได้

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 2.2.1 | คลิก Active Projects | tharab | 1. คลิกกล่อง "Active Projects" | นำทางไปหน้า /projects | [ ] | |
| 2.2.2 | คลิก My Pending Tasks | tharab | 1. คลิกกล่อง "My Pending Tasks" | นำทางไปหน้า /my-tasks | [ ] | |

---

## 3. Projects (โครงการ)

### 3.1 ดูรายการ Projects

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.1.1 | ดูรายการ (MEMBER) | tharab | 1. ไปหน้า Projects | เห็นเฉพาะ projects ที่เป็น member | [ ] | |
| 3.1.2 | ดูรายการ (ADMIN) | adinuna | 1. ไปหน้า Projects | เห็น projects ทั้งหมดในระบบ | [ ] | |

### 3.2 สร้าง Project ใหม่

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.2.1 | สร้าง Project (ADMIN) | adinuna | 1. กด "Create Project" 2. กรอก: Name, Description, Status=ACTIVE 3. กด Save | Project ใหม่แสดงในรายการ | [ ] | |
| 3.2.2 | สร้าง Project สถานะ DELAY | adinuna | 1. กด "Create Project" 2. เลือก Status=DELAY 3. กด Save | Project แสดงด้วย tag สีส้ม "DELAY" | [ ] | |

### 3.3 แก้ไข Project

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.3.1 | แก้ไขชื่อ Project | adinuna | 1. คลิก Edit บน project card 2. เปลี่ยนชื่อ 3. กด Save | ชื่อเปลี่ยนตามที่แก้ไข | [ ] | |
| 3.3.2 | เปลี่ยนสถานะเป็น HOLD | adinuna | 1. คลิก Edit 2. เปลี่ยน Status เป็น HOLD 3. กด Save | แสดง tag "HOLD" สีเหลือง | [ ] | |

### 3.4 กรอง Project (Multi-Select Filter)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.4.1 | กรองเฉพาะ ACTIVE | tharab | 1. ติ๊ก checkbox "ACTIVE" | แสดงเฉพาะ projects ที่ status = ACTIVE | [ ] | |
| 3.4.2 | กรองหลายสถานะ | tharab | 1. ติ๊ก "ACTIVE" + "DELAY" | แสดง projects ที่เป็น ACTIVE หรือ DELAY | [ ] | |

### 3.5 Toggle Card/List View

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.5.1 | สลับไป List view | tharab | 1. กดปุ่ม List icon (BarsOutlined) | เปลี่ยนเป็น List view แบบแถว | [ ] | |
| 3.5.2 | สลับกลับ Card view | tharab | 1. กดปุ่ม Card icon (AppstoreOutlined) | เปลี่ยนกลับเป็น Card view | [ ] | |

### 3.6 Sorting

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.6.1 | Sort ตามชื่อ A-Z | tharab | 1. เลือก dropdown "Name A-Z" | Projects เรียงตามชื่อ A → Z | [ ] | |
| 3.6.2 | Sort ตาม Newest | tharab | 1. เลือก dropdown "Newest" | Projects ล่าสุดอยู่บนสุด | [ ] | |

### 3.7 Export Excel (Projects)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.7.1 | Export ทุก Projects | tharab | 1. กดปุ่ม "Export Excel" ที่หน้า Projects | ดาวน์โหลดไฟล์ .xlsx, เปิดได้ใน Excel, มีข้อมูลครบ | [ ] | |
| 3.7.2 | Export หลังกรอง | tharab | 1. กรอง ACTIVE 2. กด Export Excel | ไฟล์ .xlsx มีเฉพาะ projects ที่กรอง | [ ] | |

### 3.8 Save as PDF (Projects)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 3.8.1 | Export PDF ทุก Projects | tharab | 1. กดปุ่ม "Save PDF" ที่หน้า Projects | ดาวน์โหลดไฟล์ .pdf, ภาษาไทยแสดงถูกต้อง | [ ] | |
| 3.8.2 | ตรวจสอบเนื้อหา PDF | tharab | 1. เปิดไฟล์ PDF ที่ดาวน์โหลด | มี header, ตาราง, ข้อมูลครบ, วันที่เป็นภาษาไทย | [ ] | |

---

## 4. Project Detail (รายละเอียดโครงการ)

### 4.1 ดูรายละเอียด Project

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 4.1.1 | เข้าดู Project Detail | tharab | 1. คลิกที่ project card ใดก็ได้ | เห็นรายละเอียด: ชื่อ, description, สถานะ, รายการ tasks | [ ] | |
| 4.1.2 | ดู Task list ใน Project | adinuna | 1. เข้า Project Detail | เห็น tasks ทั้งหมดใน project, แสดง status tag แต่ละ task | [ ] | |

### 4.2 Export Excel (Tasks ใน Project)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 4.2.1 | Export Tasks เป็น Excel | tharab | 1. เข้า Project Detail 2. กด "Export Excel" | ดาวน์โหลด .xlsx มีข้อมูล tasks ครบ 10 columns | [ ] | |
| 4.2.2 | Export Tasks เป็น PDF | tharab | 1. เข้า Project Detail 2. กด "Save PDF" | ดาวน์โหลด .pdf ภาษาไทยถูกต้อง | [ ] | |

---

## 5. Tasks (งาน)

### 5.1 สร้าง Task ใหม่

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 5.1.1 | สร้าง Task พร้อมวันที่ | adinuna | 1. เข้า Project Detail 2. กด "Add Task" 3. กรอก: Title, Description, Status=TODO, Start Date, Finish Date, Assignee=ธรา | Task ใหม่แสดงในรายการ, มีวันที่ Start/Finish | [ ] | |
| 5.1.2 | สร้าง Task สถานะ IN_PROGRESS | adinuna | 1. กด "Add Task" 2. เลือก Status=IN_PROGRESS 3. กด Save | Task แสดงด้วย tag "IN_PROGRESS" สีน้ำเงิน | [ ] | |

### 5.2 แก้ไข Task

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 5.2.1 | เปลี่ยน Assignee | adinuna | 1. คลิก Task 2. แก้ไข Assignee เป็นคนอื่น 3. กด Save | Assignee เปลี่ยนตามที่เลือก | [ ] | |
| 5.2.2 | เปลี่ยน Status เป็น DONE | tharab | 1. คลิก Task ที่ได้รับมอบหมาย 2. เปลี่ยน Status เป็น DONE 3. กด Save | Task แสดง tag "DONE" สีเขียว | [ ] | |

### 5.3 Task Status ครบทุกสถานะ

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 5.3.1 | เปลี่ยนเป็น HOLD | adinuna | 1. แก้ไข Task 2. เลือก Status=HOLD | Tag "HOLD" แสดงถูกต้อง | [ ] | |
| 5.3.2 | เปลี่ยนเป็น CANCELLED | adinuna | 1. แก้ไข Task 2. เลือก Status=CANCELLED | Tag "CANCELLED" แสดงถูกต้อง | [ ] | |

### 5.4 Sub-Tasks (งานย่อย)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 5.4.1 | สร้าง Sub-task | adinuna | 1. เปิด Task Detail 2. กด "Add Sub-task" 3. กรอกชื่อ sub-task 4. กด Save | Sub-task แสดงใต้ parent task | [ ] | |
| 5.4.2 | ดู Sub-tasks list | tharab | 1. เปิด Task ที่มี sub-tasks | เห็นรายการ sub-tasks พร้อม checkbox/status | [ ] | |

---

## 6. Task Detail Modal (รายละเอียดงาน)

### 6.1 ดู Task Detail

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 6.1.1 | เปิด Task Detail | tharab | 1. คลิกที่ชื่อ Task ใดก็ได้ | Modal เปิดขึ้น, เห็น: Title, Description, Status, Dates, Assignee, Comments | [ ] | |
| 6.1.2 | ดู Ahead/Delay indicator | tharab | 1. ดู Task ที่มี Finish Date | แสดง Ahead (สีเขียว) หรือ Delay (สีแดง) ตามเวลา | [ ] | |

### 6.2 Comment (ความคิดเห็น)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 6.2.1 | เพิ่ม Comment | tharab | 1. เปิด Task Detail 2. พิมพ์ข้อความในช่อง Comment 3. กด Send | Comment แสดงในรายการ พร้อมชื่อผู้เขียนและเวลา | [ ] | |
| 6.2.2 | ดู Comments ของคนอื่น | adinuna | 1. เปิด Task เดียวกัน | เห็น comment ที่ tharab เขียน | [ ] | |

### 6.3 Image Attachment (แนบรูปภาพ)

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 6.3.1 | แนบรูป 1 ไฟล์ | tharab | 1. เปิด Task Detail 2. คลิก Attach Image 3. เลือกรูป JPG/PNG (< 5MB) 4. พิมพ์ comment 5. กด Send | Comment แสดงพร้อมรูปภาพ, คลิกดูรูปขยายได้ | [ ] | |
| 6.3.2 | แนบรูปหลายไฟล์ | adinuna | 1. เปิด Task Detail 2. เลือกรูป 2-3 ไฟล์พร้อมกัน 3. กด Send | แสดงรูปทั้งหมดที่แนบ | [ ] | |

### 6.4 Daily Update

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 6.4.1 | เพิ่ม Daily Update | tharab | 1. เปิด Task Detail 2. เพิ่ม update: progress %, notes | Update แสดงในรายการ พร้อมวันที่ | [ ] | |
| 6.4.2 | ดู Update history | adinuna | 1. เปิด Task เดียวกัน | เห็น updates ทั้งหมดเรียงตามเวลา | [ ] | |

---

## 7. My Tasks (งานของฉัน)

### 7.1 ดูรายการ Tasks ของตัวเอง

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 7.1.1 | ดู My Tasks (MEMBER) | tharab | 1. คลิก "My Tasks" ที่ sidebar | เห็นเฉพาะ tasks ที่ assign ให้ตัวเอง | [ ] | |
| 7.1.2 | ดู My Tasks (ADMIN) | adinuna | 1. คลิก "My Tasks" | เห็น tasks ที่ assign ให้ตัวเอง (ไม่ใช่ทุก task) | [ ] | |

---

## 8. Calendar (ปฏิทิน)

### 8.1 ดูปฏิทิน

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 8.1.1 | ดู Calendar view | tharab | 1. คลิก "Calendar" ที่ sidebar | เห็นปฏิทินแสดง tasks ตาม due date | [ ] | |
| 8.1.2 | คลิก Task บนปฏิทิน | tharab | 1. คลิกที่ task ในปฏิทิน | เปิด Task Detail หรือนำทางไป task นั้น | [ ] | |

---

## 9. Timeline (ไทม์ไลน์)

### 9.1 ดู Timeline แบบ Multi-Project

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 9.1.1 | ดู Timeline หลาย Projects | adinuna | 1. คลิก "Timeline" ที่ sidebar 2. เลือกหลาย projects | เห็น Gantt chart แสดง tasks จากหลาย projects ซ้อนกัน | [ ] | |
| 9.1.2 | ดู Timeline (MEMBER) | tharab | 1. คลิก "Timeline" 2. เลือก project ที่เป็น member | เห็น tasks ของ project นั้นบน timeline | [ ] | |

---

## 10. Groups (กลุ่ม)

### 10.1 สร้าง Group

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 10.1.1 | สร้าง Group ใหม่ | adinuna | 1. ไปหน้า Groups 2. กด "Create Group" 3. กรอกชื่อ + description 4. กด Save | Group ใหม่แสดงในรายการ | [ ] | |
| 10.1.2 | สร้าง Group (MEMBER) | tharab | 1. ไปหน้า Groups 2. กด "Create Group" 3. กรอกข้อมูล 4. กด Save | สร้างสำเร็จ หรือ ถูกจำกัดสิทธิ์ (ขึ้นกับ RBAC) | [ ] | |

### 10.2 จัดการ Members ใน Group

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 10.2.1 | เพิ่ม Member เข้า Group | adinuna | 1. เปิด Group 2. กด "Add Member" 3. เลือก user 4. กด Add | User แสดงในรายการ members ของ group | [ ] | |
| 10.2.2 | ลบ Member ออกจาก Group | adinuna | 1. เปิด Group 2. กด Remove ที่ member | Member ถูกลบออก, ไม่แสดงในรายการ | [ ] | |

### 10.3 จัดการ Projects ใน Group

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 10.3.1 | เพิ่ม Project เข้า Group | adinuna | 1. เปิด Group 2. กด "Add Project" 3. เลือก project 4. กด Add | Project แสดงในรายการ projects ของ group | [ ] | |
| 10.3.2 | ลบ Project ออกจาก Group | adinuna | 1. เปิด Group 2. กด Remove ที่ project | Project ถูกลบออกจาก group | [ ] | |

---

## 11. Notifications (การแจ้งเตือน)

### 11.1 ดูการแจ้งเตือน

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 11.1.1 | ดู Notification popover | tharab | 1. คลิกไอคอนกระดิ่งที่ sidebar | เห็นรายการแจ้งเตือน (due soon, overdue, assignment) | [ ] | |
| 11.1.2 | Mark as read | tharab | 1. คลิกที่ notification | Notification เปลี่ยนเป็นอ่านแล้ว, badge count ลดลง | [ ] | |

---

## 12. UI/UX ทั่วไป

### 12.1 Contrast & Readability

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 12.1.1 | ตรวจ text contrast | tharab | 1. ดูทุกหน้า | ตัวอักษรอ่านง่าย ไม่มีสีดำบนสีเทาเข้ม | [ ] | |
| 12.1.2 | Label "Finish" แทน "Deadline" | tharab | 1. ดูหน้า Task Detail, Create Task | แสดง "Finish" ไม่ใช่ "Deadline" | [ ] | |

### 12.2 Responsive & Navigation

| # | Scenario | User | ขั้นตอน | Expected Result | Status | หมายเหตุ |
|---|----------|------|---------|-----------------|--------|----------|
| 12.2.1 | Sidebar navigation | tharab | 1. คลิกทุก menu: Dashboard, Projects, My Tasks, Calendar, Timeline, Groups | ทุกหน้าเปิดได้ถูกต้อง, highlight menu ที่ active | [ ] | |
| 12.2.2 | Rate limiting | tharab | 1. กด refresh รัวๆ 10 ครั้งภายใน 5 วินาที | ไม่โดน rate limit block, ยังใช้งานได้ปกติ | [ ] | |

---

## สรุปผลการทดสอบ

| Section | จำนวน Test Cases | ผ่าน | ไม่ผ่าน | หมายเหตุ |
|---------|-----------------|------|---------|----------|
| 1. Authentication | 10 | | | |
| 2. Dashboard | 4 | | | |
| 3. Projects | 16 | | | |
| 4. Project Detail | 4 | | | |
| 5. Tasks | 8 | | | |
| 6. Task Detail | 8 | | | |
| 7. My Tasks | 2 | | | |
| 8. Calendar | 2 | | | |
| 9. Timeline | 2 | | | |
| 10. Groups | 6 | | | |
| 11. Notifications | 2 | | | |
| 12. UI/UX | 4 | | | |
| **รวม** | **68** | | | |

---

## Bug Report Template

เมื่อพบ bug ให้กรอกข้อมูลต่อไปนี้:

```
Bug #: [เลขที่]
Test Case: [เลข test case เช่น 5.1.1]
Severity: [Critical / High / Medium / Low]
User: [tharab / adinuna]
Description: [อธิบายปัญหา]
Steps to Reproduce:
  1. ...
  2. ...
Expected: [ผลที่คาดหวัง]
Actual: [ผลที่เกิดขึ้นจริง]
Screenshot: [แนบรูป ถ้ามี]
```

---

**Prepared by:** Claude AI
**Approved by:** ________________
**Test Date:** ________________
