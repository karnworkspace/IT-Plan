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
- [x] เปลี่ยนตัวอักษรในช่องสีเทาเป็นสีขาว -- ดำเนินการแล้ว 08/02/26
- [x] ปรับ contrast ให้อ่านง่ายขึ้น -- ดำเนินการแล้ว 08/02/26
- [ ] Test accessibility (WCAG AA standard)

**Status: ✅ Done (ยกเว้น WCAG test)**

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
- [x] Implement forgot password API -- ดำเนินการแล้ว 08/02/26
- [x] Implement forgot PIN API -- ดำเนินการแล้ว 08/02/26
- [ ] Add email notification (optional for UAT)
- [x] Create UI for forgot password/PIN flow -- ดำเนินการแล้ว 08/02/26

**Status: ✅ Done (ยกเว้น email notification - optional)**

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
- [x] Add fields to Prisma schema -- ดำเนินการแล้ว 10/02/26 (startDate & dueDate มีอยู่แล้ว ใช้ dueDate เป็น Finish Date)
- [x] Run migration -- ไม่จำเป็น (fields มีอยู่แล้ว)
- [x] Update create/update APIs -- ดำเนินการแล้ว 10/02/26
- [x] Update UI forms -- ดำเนินการแล้ว 10/02/26
- [x] Add date pickers -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done** | Tested: 64/64 passed (round test 10/02/26)

---

### 2.2 Update Assignee & Due Date
**Problem:** Update Task ไม่สามารถเปลี่ยน assignee และ duedate ได้

**Files to modify:**
- `backend/src/services/task.service.ts`
- `frontend/src/pages/TaskDetailPage.tsx`

**Actions:**
- [x] Allow assigneeId update in API -- ดำเนินการแล้ว 10/02/26 (รองรับอยู่แล้ว เพิ่ม validation)
- [x] Allow dueDate update in API -- ดำเนินการแล้ว 10/02/26 (รองรับอยู่แล้ว)
- [x] Add Assignee dropdown in Edit Task UI -- ดำเนินการแล้ว 10/02/26
- [x] Add Due Date picker in Edit Task UI -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done** | Tested: 64/64 passed (round test 10/02/26)

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
- [x] Add HOLD, CANCELLED to TaskStatus enum -- ดำเนินการแล้ว 10/02/26
- [x] Add status dropdown in Create Task form -- ดำเนินการแล้ว 10/02/26
- [x] Add Ahead/Delay calculation based on dates -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done** | Tested: 64/64 passed (round test 10/02/26)

**Phase 2 Additional Bug Fix:**
- [x] แก้ไข sendSuccess status code bug ใน 4 controllers (task, comment, dailyUpdate, notification) -- `sendSuccess(res, data, '201')` ส่ง '201' เป็น message แทน statusCode → แก้เป็น `sendSuccess(res, data, undefined, 201)` -- ดำเนินการแล้ว 10/02/26

**Phase 2 Round Test Results (10/02/26):**
- `phase2-roundtest.test.ts`: **35/35 PASSED** (tharab MEMBER + adinuna ADMIN)
- `task-management.test.ts`: **29/29 PASSED**
- **Total: 64/64 tests PASSED (100%)**

---

## Phase 3: Project Status & Filtering

### 3.1 Add Project Status Options
**Current Status:** Active, Completed
**Required Status:** Active, Delay, Completed, Hold, Cancelled, Postpone

**Files modified:**
- `backend/prisma/schema.prisma` - Updated ProjectStatus comment (ใช้ String, ไม่ต้อง migration)
- `backend/src/services/project.service.ts` - เพิ่ม status ใน CreateProjectInput
- `backend/src/controllers/project.controller.ts` - เพิ่ม status validation (7 statuses)
- `frontend/src/services/projectService.ts` - อัปเดต Project.status type union
- `frontend/src/pages/ProjectsPage.tsx` - อัปเดต getStatusConfig(), stats row, modal dropdown

**Actions:**
- [x] Update ProjectStatus (7 values: ACTIVE, DELAY, COMPLETED, HOLD, CANCELLED, POSTPONE, ARCHIVED) -- ดำเนินการแล้ว 10/02/26
- [x] Backend validation for create/update -- ดำเนินการแล้ว 10/02/26
- [x] Add status filter UI (Checkbox multi-select) -- ดำเนินการแล้ว 10/02/26
- [x] Update dashboard statistics -- ดำเนินการแล้ว 10/02/26
- [x] Update modal Create/Edit with all 7 statuses -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 3.2 Checkbox Multi-Select Filter
**Problem:** ต้องเลือกหลายสถานะพร้อมกันได้

**Files modified:**
- `frontend/src/pages/ProjectsPage.tsx` - เปลี่ยน Select → Checkbox.Group, statusFilter เป็น string[]

**Actions:**
- [x] Create Checkbox.Group with all 7 status checkboxes -- ดำเนินการแล้ว 10/02/26
- [x] Implement multi-select logic (array-based filtering) -- ดำเนินการแล้ว 10/02/26
- [x] Filter projects based on selected statuses -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 3.3 Dashboard Boxes Clickable
**Problem:** ทุกกล่องใน Dashboard ต้องคลิกเข้าไปดูรายละเอียดได้

**Files modified:**
- `frontend/src/pages/DashboardPage.tsx` - เพิ่ม onClick + hoverable ให้ StatusCard, อัปเดต Tag color

**Actions:**
- [x] Make "Active Projects" box → navigate to /projects -- ดำเนินการแล้ว 10/02/26
- [x] Make "My Pending Tasks" box → navigate to /my-tasks -- ดำเนินการแล้ว 10/02/26
- [x] Make "Team Members" box → navigate to /projects -- ดำเนินการแล้ว 10/02/26
- [x] Make "Completion Rate" box → navigate to /projects -- ดำเนินการแล้ว 10/02/26
- [x] Update project status tag colors for all new statuses -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

**Phase 3 API Test Results (10/02/26):**
- Create project with DELAY status: ✅ Success
- Create project with HOLD status: ✅ Success
- Update project to POSTPONE: ✅ Success
- Reject invalid status: ✅ Correctly rejected
- `phase2-roundtest.test.ts`: **35/35 PASSED** (no regression)
- `task-management.test.ts`: **29/29 PASSED** (no regression)
- **Total: 64/64 tests PASSED (100%) — no regression**

---

## Phase 4: Views & UI Improvements

### 4.1 Toggle Card/List View
**Problem:** ต้องมีปุ่ม Toggle แปลงระหว่าง Card ↔ List view

**Files modified:**
- `frontend/src/pages/ProjectsPage.tsx` - เพิ่ม viewMode state, Card/List toggle buttons, List view rendering
- `frontend/src/pages/ProjectsPage.css` - เพิ่ม styles สำหรับ list view, toggle buttons, checkbox filter

**Actions:**
- [x] Add Toggle button (AppstoreOutlined / BarsOutlined) -- ดำเนินการแล้ว 10/02/26
- [x] Create List view with compact layout (color bar, progress circle, stats) -- ดำเนินการแล้ว 10/02/26
- [x] Store view preference in localStorage -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 4.2 Sorting Options
**Problem:** ต้องเลือก sorting ได้ (ตามชื่อ / ตาม Project ID)

**Files modified:**
- `frontend/src/pages/ProjectsPage.tsx` - เพิ่ม sortBy state, sorting dropdown, sorting logic

**Actions:**
- [x] Add sorting dropdown (Name A-Z, Name Z-A, Newest, Oldest, Status) -- ดำเนินการแล้ว 10/02/26
- [x] Implement sorting logic in filter useEffect -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

**Phase 4 Round Test Results (10/02/26):**
- `phase2-roundtest.test.ts`: **35/35 PASSED** (no regression)
- `task-management.test.ts`: **29/29 PASSED** (no regression)
- **Total: 64/64 tests PASSED (100%) — no regression**

---

### 4.3 Label Change: Deadline → Finish
**Files to modify:**
- `frontend/src/**/*.tsx` (search for "Deadline")

**Actions:**
- [x] Find and replace "Deadline" with "Finish" in UI -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

## Phase 5: New Features

### 5.1 Sub-tasks (Multi-level)
**Problem:** แต่ละ Task ต้องมี sub-tasks ย่อยได้

**Files modified:**
- `backend/prisma/schema.prisma` - เพิ่ม parentTaskId self-relation + migration
- `backend/src/services/task.service.ts` - เพิ่ม getSubTasks, อัปเดต createTask/getAllTasks/getTaskById
- `backend/src/controllers/task.controller.ts` - เพิ่ม getSubTasks controller
- `backend/src/routes/task.routes.ts` - เพิ่ม GET /tasks/:id/subtasks
- `frontend/src/services/taskService.ts` - เพิ่ม parentTaskId, subTasks ใน Task interface + getSubTasks method
- `frontend/src/components/SubTaskList.tsx` (new) - Sub-task list component
- `frontend/src/pages/TaskDetailModal.tsx` - integrate SubTaskList

**Actions:**
- [x] Add parent-child relation in schema -- ดำเนินการแล้ว 10/02/26
- [x] Create sub-task CRUD APIs -- ดำเนินการแล้ว 10/02/26
- [x] Create SubTaskList component -- ดำเนินการแล้ว 10/02/26
- [x] Allow creating sub-tasks from task detail -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 5.2 Timeline/Gantt View
**Problem:** ต้องมี view ที่ดูหลาย project พร้อมกัน เห็นงานซ้อนกัน

**Files modified/created:**
- `frontend/src/pages/TimelinePage.tsx` (new) - Multi-project timeline page
- `frontend/src/pages/TimelinePage.css` (new) - Timeline page styles
- ใช้ GanttChart.tsx component เดิมที่มีอยู่แล้ว (ไม่ต้อง install library ใหม่)

**Actions:**
- [x] ~~Install Gantt library~~ ใช้ GanttChart component ที่มีอยู่แล้ว -- 10/02/26
- [x] Create TimelinePage -- ดำเนินการแล้ว 10/02/26
- [x] Allow multi-project selection -- ดำเนินการแล้ว 10/02/26
- [x] Display tasks on timeline -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 5.3 User Groups & Project Groups
**Problem:** ต้องจัดกลุ่ม user และ project ได้

**Files modified/created:**
- `backend/prisma/schema.prisma` - เพิ่ม Group, GroupMember, GroupProject models + migration
- `backend/src/services/group.service.ts` (new) - Full CRUD + member/project management
- `backend/src/controllers/group.controller.ts` (new) - Request handlers with validation
- `backend/src/routes/group.routes.ts` (new) - Group routes (CRUD + members + projects)
- `backend/src/routes/index.ts` - Register /groups routes
- `frontend/src/services/groupService.ts` (new) - Group API client
- `frontend/src/pages/GroupsPage.tsx` (new) - Groups management UI
- `frontend/src/pages/GroupsPage.css` (new) - Groups page styles
- `frontend/src/App.tsx` - เพิ่ม /groups route
- `frontend/src/components/Sidebar.tsx` - เพิ่ม Groups menu item

**Actions:**
- [x] Create Group model (Group, GroupMember, GroupProject) -- ดำเนินการแล้ว 10/02/26
- [x] Create group management APIs (CRUD + member/project management) -- ดำเนินการแล้ว 10/02/26
- [x] Create Groups page UI -- ดำเนินการแล้ว 10/02/26
- [x] Allow tagging projects with groups -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

**Phase 5.1-5.3 Round Test Results (10/02/26):**
- Groups API: Create ✅ → Get All ✅ → Get By ID ✅ → Delete ✅
- Sub-tasks API: Create with parentTaskId ✅ → Get subtasks ✅ → Parent includes subTasks ✅ → Delete ✅
- `phase2-roundtest.test.ts`: **35/35 PASSED** (no regression)
- `task-management.test.ts`: **29/29 PASSED** (no regression)
- **Total: 64/64 tests PASSED (100%) — no regression**

---

### 5.4 Export Excel
**Library:** `xlsx@0.18.5`

**Files created/modified:**
- `frontend/src/utils/exportExcel.ts` (158 lines) - exportToExcel(), exportProjects(), exportTasks()
- `frontend/src/pages/ProjectsPage.tsx` - Export Excel button
- `frontend/src/pages/ProjectDetailPage.tsx` - Export Excel button (tasks)

**Actions:**
- [x] Install xlsx library -- ดำเนินการแล้ว 10/02/26
- [x] Create export utility function (3 functions) -- ดำเนินการแล้ว 10/02/26
- [x] Add Export Excel button (ProjectsPage + ProjectDetailPage) -- ดำเนินการแล้ว 10/02/26
- [x] Export filtered data (Projects 9 columns, Tasks 10 columns, Thai date format) -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 5.5 Save as PDF
**Libraries:** `jspdf@4.1.0` + `jspdf-autotable@5.0.7` + `html2canvas@1.4.1`

**Files created/modified:**
- `frontend/src/utils/exportPDF.ts` (135 lines) - exportProjectsPDF(), exportTasksPDF(), addHeader()
- `frontend/src/pages/ProjectsPage.tsx` - Save PDF button
- `frontend/src/pages/ProjectDetailPage.tsx` - Save PDF button (tasks)

**Actions:**
- [x] Install jspdf, jspdf-autotable, html2canvas -- ดำเนินการแล้ว 10/02/26
- [x] Create PDF export function (2 functions + header helper) -- ดำเนินการแล้ว 10/02/26
- [x] Add Save as PDF button (ProjectsPage + ProjectDetailPage) -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

### 5.6 Image Attachment in Notes
**Problem:** Notes ไม่สามารถแนบรูปภาพได้

**Files modified/created:**
- `backend/prisma/schema.prisma` - เพิ่ม Attachment model (ผูกกับ Comment, cascade delete)
- `backend/src/services/attachment.service.ts` (new) - CRUD attachments + ลบไฟล์จาก disk
- `backend/src/controllers/upload.controller.ts` (new) - upload/get/delete handlers
- `backend/src/routes/upload.routes.ts` (new) - multer config (images only, max 5MB, max 5 files)
- `backend/src/services/comment.service.ts` - include attachments ใน query
- `backend/src/app.ts` - serve /uploads as static files
- `backend/.gitignore` - เพิ่ม uploads/
- `frontend/src/services/commentService.ts` - เพิ่ม Attachment type, uploadImages(), deleteAttachment()
- `frontend/src/pages/TaskDetailModal.tsx` - ปุ่ม Attach Image, pending files Tag, image preview
- `docker-compose.yml` - เพิ่ม uploads volume mount

**APIs:**
- `POST /api/v1/comments/:commentId/attachments` - upload images
- `GET /api/v1/comments/:commentId/attachments` - get attachments
- `DELETE /api/v1/attachments/:id` - delete attachment

**Actions:**
- [x] Set up file upload (multer, local storage) -- ดำเนินการแล้ว 10/02/26
- [x] Create upload API (3 endpoints) -- ดำเนินการแล้ว 10/02/26
- [x] Add image picker in comment/note form -- ดำเนินการแล้ว 10/02/26
- [x] Display attached images (clickable preview) -- ดำเนินการแล้ว 10/02/26

**Status: ✅ Done**

---

## Phase 6: Performance & Polish

### 6.1 Rate Limiting Optimization
**Problem:** กด refresh รัวๆ จะ Failed

**Files to modify:**
- `backend/src/middlewares/rateLimit.ts`

**Actions:**
- [x] Increase rate limit for authenticated users -- ดำเนินการแล้ว 08/02/26
- [x] Add better error message -- ดำเนินการแล้ว 08/02/26
- [ ] Consider caching strategies

**Status: ✅ Done (ยกเว้น caching strategies - optional)**

---

## Summary Table

| Phase | Items | Status | Progress |
|-------|-------|--------|----------|
| Phase 1: Critical Fixes | 2 | ✅ Complete | 100% |
| Phase 2: Task Management | 3 | ✅ Complete | 100% |
| Phase 3: Status & Filtering | 3 | ✅ Complete | 100% |
| Phase 4: Views & UI | 3 | ✅ Complete | 100% |
| Phase 5: New Features | 6 | ✅ Complete | 100% |
| Phase 6: Performance | 1 | ✅ Complete | 100% |
| **Total** | **18** | **✅ All Phases Complete** | **100%** |

---

## Quick Wins (Can do immediately)

1. ~~**Label change:** Deadline → Finish (5 mins)~~ ✅ Done 10/02/26
2. ~~**Dashboard boxes clickable** (30 mins)~~ ✅ Done 10/02/26 (Phase 3.3)
3. ~~**Status dropdown in Create Task** (1 hr)~~ ✅ Done 10/02/26 (Phase 2.3)
4. ~~**Update Assignee/DueDate API** (2 hrs)~~ ✅ Done 10/02/26 (Phase 2.2)

---

**Created:** 2026-02-08
**Last Updated:** 2026-02-10
**Status:** ✅ All Phases Complete (Phase 1-6, 18/18 items)
**Round Test:** 64/64 tests PASSED (tharab@sena.co.th MEMBER + adinuna@sena.co.th ADMIN) — 10/02/26
