# User Feedback Summary - TaskFlow App

**Source:** review app project.pptx
**Date:** 2026-02-08
**Total Slides:** 13

---

## สรุป Feedback ตามหมวดหมู่

### 1. Dashboard & Status Management (Slide 1, 2, 5)

| # | Feedback | Priority |
|---|----------|----------|
| 1.1 | **Project Status ต้องมี 6 สถานะ:** Active, Delay, Completed, Hold, Cancelled, Postpone | 🔴 High |
| 1.2 | **Status boxes ต้องคลิกได้** เพื่อ filter แสดง projects ตามสถานะ | 🔴 High |
| 1.3 | **เลือกหลายสถานะพร้อมกันได้** → ใช้ Checkbox แทน | 🟡 Medium |
| 1.4 | **Group Project 3 Level** เหมือนของพี่เชียร | 🟡 Medium |
| 1.5 | **Dashboard boxes ทุกกล่องต้องคลิกดูรายละเอียดได้** (active project, my pending tasks, team members, completion rate) | 🔴 High |

### 2. UI/UX Improvements (Slide 2, 3)

| # | Feedback | Priority |
|---|----------|----------|
| 2.1 | **ตัวอักษรในช่องสีเทา → เปลี่ยนเป็นสีขาว** (สีดำกลืน มองไม่เห็น) | 🔴 High |
| 2.2 | **ตัวอักษรสีขาวอ่านไม่ชัด** - ต้องปรับ contrast | 🔴 High |
| 2.3 | **เพิ่มปุ่ม Toggle** แปลงระหว่าง Card view ↔ List view | 🟡 Medium |
| 2.4 | **การเรียง project** ต้องเลือก sorting ได้ (ตามชื่อ / ตาม Project ID) | 🟡 Medium |
| 2.5 | **เปลี่ยน "Deadline" → "Finish"** | 🟢 Low |

### 3. Sub-tasks Feature (Slide 4) - NEW FEATURE

| # | Feedback | Priority |
|---|----------|----------|
| 3.1 | **แต่ละ Task ต้องมี Sub-tasks ย่อยได้** (หลาย level) | 🔴 High |
| 3.2 | **Example workflow:** Project Scope → Kick off → Get Requirement → Design → Development → SIT → UAT → Golive → Post Implement | 🟡 Medium |

### 4. Task Status & Filtering (Slide 5)

| # | Feedback | Priority |
|---|----------|----------|
| 4.1 | **Task Status ต้องมี:** Active (Ahead, On Plan, Delay), Completed, Hold, Cancelled | 🔴 High |
| 4.2 | **แสดง Ahead/Delay ได้** - เพื่อเห็นงานที่ล่าช้า | 🟡 Medium |
| 4.3 | **Status boxes ต้องเป็น Checkbox** เลือกหลาย status ได้ | 🟡 Medium |

### 5. Timeline/Gantt View (Slide 6) - NEW FEATURE

| # | Feedback | Priority |
|---|----------|----------|
| 5.1 | **เพิ่ม View แบบ Timeline/Gantt** ที่เลือกดูหลาย project พร้อมกัน | 🔴 High |
| 5.2 | **เห็นงานซ้อนกันได้** เพื่อวางแผนบริหารจัดการ | 🟡 Medium |

### 6. Task Creation & Update (Slide 7, 8, 12)

| # | Feedback | Priority |
|---|----------|----------|
| 6.1 | **Create Task ต้องมี Start Date และ Finish Date** (ปัจจุบันไม่มี) | 🔴 High |
| 6.2 | **ต้อง update Plan vs Actual ได้** | 🔴 High |
| 6.3 | **Update Task ต้องเปลี่ยน Assignee ได้** | 🔴 High |
| 6.4 | **Update Task ต้องเปลี่ยน Due Date ได้** | 🔴 High |
| 6.5 | **สร้าง Task ได้เฉพาะ Status "TODO"** - ต้องเลือกสถานะอื่นได้ | 🟡 Medium |

### 7. Authentication (Slide 9)

| # | Feedback | Priority |
|---|----------|----------|
| 7.1 | **Forgot Password ยังใช้ไม่ได้** | 🟡 Medium |
| 7.2 | **Forgot PIN ยังใช้ไม่ได้** | 🟡 Medium |

### 8. Settings & User Groups (Slide 10) - NEW FEATURE

| # | Feedback | Priority |
|---|----------|----------|
| 8.1 | **เพิ่ม Settings menu** | 🟡 Medium |
| 8.2 | **สร้างกลุ่ม User** และจัด member เข้ากลุ่มได้ | 🔴 High |
| 8.3 | **จัด Project เข้ากลุ่มได้** (1 project มีได้หลายกลุ่ม - tag system) | 🔴 High |
| 8.4 | **กลุ่ม Project** เช่น SENA Idea, CMS พจมาน, Web Application | 🟡 Medium |
| 8.5 | **Export Excel** เพื่อ filter ต่อได้ | 🟡 Medium |
| 8.6 | **Save as PDF** | 🟡 Medium |

### 9. Rate Limiting (Slide 11)

| # | Feedback | Priority |
|---|----------|----------|
| 9.1 | **กด refresh รัวๆ จะ Failed** (rate limiting issue) | 🟢 Low |

### 10. Notes/Comments (Slide 13)

| # | Feedback | Priority |
|---|----------|----------|
| 10.1 | **Notes ไม่สามารถแนบรูปภาพได้** - ต้องรองรับ image attachment | 🔴 High |

---

## สรุปจำนวน Feedback ตาม Priority

| Priority | จำนวน | รายละเอียด |
|----------|-------|------------|
| 🔴 **High** | 15 | ต้องทำก่อน - Core functionality |
| 🟡 **Medium** | 13 | ทำหลังจาก High เสร็จ |
| 🟢 **Low** | 2 | Nice to have |
| **Total** | **30** | |

---

## แยกเป็น Categories

### A. Bug Fixes (ต้องแก้ทันที)
1. ตัวอักษรมองไม่เห็น (contrast issues)
2. Forgot Password/PIN ไม่ทำงาน
3. Rate limiting ที่กดรัวๆ แล้ว failed

### B. UI/UX Improvements
1. Toggle Card ↔ List view
2. Sorting by Name / Project ID
3. Checkbox multi-select for status
4. เปลี่ยน Deadline → Finish

### C. New Features (ต้องพัฒนาใหม่)
1. **Sub-tasks** - Task ย่อยหลาย level
2. **Timeline/Gantt View** - ดูหลาย project ซ้อนกัน
3. **User Groups** - จัดกลุ่ม user และ project
4. **Project Groups/Tags** - จัด project เข้ากลุ่ม
5. **Export Excel & PDF**
6. **Image Attachment** ใน Notes/Comments
7. **Plan vs Actual** tracking

### D. Task Management Enhancements
1. เพิ่ม Project Status: Hold, Cancelled, Postpone
2. เพิ่ม Task Status: Ahead, Delay
3. Start Date & Finish Date สำหรับ Task
4. Update Assignee & Due Date ได้
5. เลือก Status อื่นตอน Create Task ได้

---

## Recommended Development Phases

### Phase 1: Critical Fixes (1-2 วัน)
- [ ] แก้ UI contrast issues
- [ ] แก้ Forgot Password/PIN

### Phase 2: Task Management (3-5 วัน)
- [ ] เพิ่ม Start Date, Finish Date ใน Task
- [ ] Update Assignee & Due Date ได้
- [ ] เพิ่ม Task Status options
- [ ] เลือก Status ตอน Create ได้

### Phase 3: Status & Filtering (2-3 วัน)
- [ ] เพิ่ม Project Status ใหม่
- [ ] Checkbox multi-select filter
- [ ] Dashboard boxes clickable

### Phase 4: Views & UI (3-4 วัน)
- [ ] Toggle Card ↔ List view
- [ ] Sorting options
- [ ] Timeline/Gantt view (basic)

### Phase 5: Advanced Features (5-7 วัน)
- [ ] Sub-tasks (multi-level)
- [ ] User Groups & Project Groups
- [ ] Export Excel
- [ ] Save as PDF
- [ ] Image attachment in Notes

---

**Last Updated:** 2026-02-08
