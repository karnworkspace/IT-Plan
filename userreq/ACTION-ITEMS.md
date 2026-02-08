# Action Items - TaskFlow Development

**Based on:** User Feedback Review (2026-02-08)
**Total Items:** 30 feedback points → 25 action items

---

## Phase 1: Critical Fixes (Priority: URGENT)

### 1.1 UI Contrast Issues
**Problem:** ตัวอักษรมองไม่เห็น (สีดำบนสีเทา, สีขาวอ่านไม่ชัด)

**Files to modify:**
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/ProjectListPage.tsx`
- `frontend/src/pages/TaskDetailPage.tsx`
- `frontend/src/index.css` or component styles

**Actions:**
- [ ] เปลี่ยนตัวอักษรในช่องสีเทาเป็นสีขาว
- [ ] ปรับ contrast ให้อ่านง่ายขึ้น
- [ ] Test accessibility (WCAG AA standard)

---

### 1.2 Forgot Password/PIN
**Problem:** Function ยังใช้ไม่ได้

**Files to modify:**
- `backend/src/services/auth.service.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/auth.routes.ts`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/services/auth.service.ts`

**Actions:**
- [ ] Implement forgot password API
- [ ] Implement forgot PIN API
- [ ] Add email notification (optional for UAT)
- [ ] Create UI for forgot password/PIN flow

---

## Phase 2: Task Management Enhancements

### 2.1 Add Start Date & Finish Date to Tasks
**Problem:** Create Task ไม่มี Start/Finish Date

**Files to modify:**
- `backend/prisma/schema.prisma` - Add `startDate`, `finishDate` fields
- `backend/src/services/task.service.ts`
- `backend/src/controllers/task.controller.ts`
- `frontend/src/pages/TaskCreatePage.tsx` or modal
- `frontend/src/types/task.ts`

**Schema changes:**
```prisma
model Task {
  // existing fields...
  startDate    DateTime?
  finishDate   DateTime?
  plannedStart DateTime?
  plannedEnd   DateTime?
  actualStart  DateTime?
  actualEnd    DateTime?
}
```

**Actions:**
- [ ] Add fields to Prisma schema
- [ ] Run migration
- [ ] Update create/update APIs
- [ ] Update UI forms
- [ ] Add date pickers

---

### 2.2 Update Assignee & Due Date
**Problem:** Update Task ไม่สามารถเปลี่ยน assignee และ duedate ได้

**Files to modify:**
- `backend/src/services/task.service.ts`
- `frontend/src/pages/TaskDetailPage.tsx`

**Actions:**
- [ ] Allow assigneeId update in API
- [ ] Allow dueDate update in API
- [ ] Add Assignee dropdown in Edit Task UI
- [ ] Add Due Date picker in Edit Task UI

---

### 2.3 Task Status Options
**Problem:** สร้าง Task ได้เฉพาะ TODO, ต้องเลือกสถานะอื่นได้

**Current Status:** TODO, IN_PROGRESS, DONE
**Required Status:** TODO, IN_PROGRESS, DONE, HOLD, CANCELLED + Ahead/Delay indicator

**Files to modify:**
- `backend/prisma/schema.prisma` - Update TaskStatus enum
- `frontend/src/pages/TaskCreatePage.tsx`
- `frontend/src/components/TaskStatusBadge.tsx`

**Actions:**
- [ ] Add HOLD, CANCELLED to TaskStatus enum
- [ ] Add status dropdown in Create Task form
- [ ] Add Ahead/Delay calculation based on dates

---

## Phase 3: Project Status & Filtering

### 3.1 Add Project Status Options
**Current Status:** Active, Completed
**Required Status:** Active, Delay, Completed, Hold, Cancelled, Postpone

**Files to modify:**
- `backend/prisma/schema.prisma` - Add/update ProjectStatus enum
- `backend/src/services/project.service.ts`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/ProjectListPage.tsx`

**Actions:**
- [ ] Update ProjectStatus enum
- [ ] Run migration
- [ ] Add status filter UI
- [ ] Update dashboard statistics

---

### 3.2 Checkbox Multi-Select Filter
**Problem:** ต้องเลือกหลายสถานะพร้อมกันได้

**Files to modify:**
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/ProjectListPage.tsx`
- `frontend/src/components/StatusFilter.tsx` (new)

**Actions:**
- [ ] Create StatusFilter component with checkboxes
- [ ] Implement multi-select logic
- [ ] Filter projects/tasks based on selected statuses

---

### 3.3 Dashboard Boxes Clickable
**Problem:** ทุกกล่องใน Dashboard ต้องคลิกเข้าไปดูรายละเอียดได้

**Files to modify:**
- `frontend/src/pages/DashboardPage.tsx`

**Actions:**
- [ ] Make "Active Projects" box → navigate to filtered project list
- [ ] Make "My Pending Tasks" box → navigate to my tasks page
- [ ] Make "Team Members" box → navigate to team page
- [ ] Make "Completion Rate" box → show detailed stats

---

## Phase 4: Views & UI Improvements

### 4.1 Toggle Card/List View
**Problem:** ต้องมีปุ่ม Toggle แปลงระหว่าง Card ↔ List view

**Files to modify:**
- `frontend/src/pages/ProjectListPage.tsx`
- `frontend/src/components/ProjectCard.tsx`
- `frontend/src/components/ProjectListItem.tsx` (new)

**Actions:**
- [ ] Add Toggle button (Card/List icons)
- [ ] Create ProjectListItem component
- [ ] Store view preference in localStorage

---

### 4.2 Sorting Options
**Problem:** ต้องเลือก sorting ได้ (ตามชื่อ / ตาม Project ID)

**Files to modify:**
- `frontend/src/pages/ProjectListPage.tsx`
- `frontend/src/pages/TaskListPage.tsx`

**Actions:**
- [ ] Add sorting dropdown
- [ ] Options: Name (A-Z, Z-A), ID, Date Created, Status
- [ ] Implement sorting logic

---

### 4.3 Label Change: Deadline → Finish
**Files to modify:**
- `frontend/src/**/*.tsx` (search for "Deadline")

**Actions:**
- [ ] Find and replace "Deadline" with "Finish" in UI

---

## Phase 5: New Features

### 5.1 Sub-tasks (Multi-level)
**Problem:** แต่ละ Task ต้องมี sub-tasks ย่อยได้

**Files to modify:**
- `backend/prisma/schema.prisma` - Add parentTaskId relation
- `backend/src/services/task.service.ts`
- `frontend/src/pages/TaskDetailPage.tsx`
- `frontend/src/components/SubTaskList.tsx` (new)

**Schema changes:**
```prisma
model Task {
  // existing fields...
  parentTaskId String?
  parentTask   Task?   @relation("SubTasks", fields: [parentTaskId], references: [id])
  subTasks     Task[]  @relation("SubTasks")
}
```

**Actions:**
- [ ] Add parent-child relation in schema
- [ ] Create sub-task CRUD APIs
- [ ] Create SubTaskList component
- [ ] Allow creating sub-tasks from task detail

---

### 5.2 Timeline/Gantt View
**Problem:** ต้องมี view ที่ดูหลาย project พร้อมกัน เห็นงานซ้อนกัน

**Recommended library:** `react-gantt-timeline` or `frappe-gantt`

**Files to create:**
- `frontend/src/pages/TimelinePage.tsx` (new)
- `frontend/src/components/GanttChart.tsx` (new)

**Actions:**
- [ ] Install Gantt library
- [ ] Create TimelinePage
- [ ] Allow multi-project selection
- [ ] Display tasks on timeline

---

### 5.3 User Groups & Project Groups
**Problem:** ต้องจัดกลุ่ม user และ project ได้

**Files to modify:**
- `backend/prisma/schema.prisma` - Add Group, ProjectGroup models
- `backend/src/services/group.service.ts` (new)
- `frontend/src/pages/SettingsPage.tsx` (new)

**Schema additions:**
```prisma
model Group {
  id        String   @id @default(cuid())
  name      String
  type      GroupType // USER_GROUP, PROJECT_GROUP
  members   User[]
  projects  Project[]
  createdAt DateTime @default(now())
}
```

**Actions:**
- [ ] Create Group model
- [ ] Create group management APIs
- [ ] Create Settings page UI
- [ ] Allow tagging projects with groups

---

### 5.4 Export Excel
**Recommended library:** `xlsx` or `exceljs`

**Files to create:**
- `frontend/src/utils/exportExcel.ts`
- Button in ProjectListPage, TaskListPage

**Actions:**
- [ ] Install xlsx library
- [ ] Create export utility function
- [ ] Add Export Excel button
- [ ] Export filtered data

---

### 5.5 Save as PDF
**Recommended library:** `jspdf` + `html2canvas`

**Files to create:**
- `frontend/src/utils/exportPDF.ts`

**Actions:**
- [ ] Install jspdf, html2canvas
- [ ] Create PDF export function
- [ ] Add Save as PDF button

---

### 5.6 Image Attachment in Notes
**Problem:** Notes ไม่สามารถแนบรูปภาพได้

**Files to modify:**
- `backend/prisma/schema.prisma` - Add Attachment model
- `backend/src/services/upload.service.ts` (new)
- `backend/src/controllers/upload.controller.ts` (new)
- `frontend/src/components/CommentInput.tsx`

**Actions:**
- [ ] Set up file upload (local or S3/Cloudinary)
- [ ] Create upload API
- [ ] Add image picker in comment/note form
- [ ] Display attached images

---

## Phase 6: Performance & Polish

### 6.1 Rate Limiting Optimization
**Problem:** กด refresh รัวๆ จะ Failed

**Files to modify:**
- `backend/src/middlewares/rateLimit.ts`

**Actions:**
- [ ] Increase rate limit for authenticated users
- [ ] Add better error message
- [ ] Consider caching strategies

---

## Summary Table

| Phase | Items | Estimated Effort |
|-------|-------|------------------|
| Phase 1: Critical Fixes | 2 | 1-2 days |
| Phase 2: Task Management | 3 | 3-4 days |
| Phase 3: Status & Filtering | 3 | 2-3 days |
| Phase 4: Views & UI | 3 | 2-3 days |
| Phase 5: New Features | 6 | 7-10 days |
| Phase 6: Performance | 1 | 1 day |
| **Total** | **18** | **~16-23 days** |

---

## Quick Wins (Can do immediately)

1. **Label change:** Deadline → Finish (5 mins)
2. **Dashboard boxes clickable** (30 mins)
3. **Status dropdown in Create Task** (1 hr)
4. **Update Assignee/DueDate API** (2 hrs)

---

**Created:** 2026-02-08
**Status:** Ready for Development
