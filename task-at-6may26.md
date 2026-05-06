# Task Plan at 6 May 2026 — Phase 22 UAT Feedback Fix

เอกสารนี้ใช้เป็น execution plan ให้ Claude Code ทำงาน และใช้เป็น checklist ให้ Codex ตรวจสอบงานหลังทำแต่ละชุด

## Context

- Project: IT Project System / TaskFlow
- Current date: 2026-05-06
- Current repo state: clean after commit `fc24856 chore: cleanup repo`
- Source of truth:
  - `Doc/TASKFLOW-KNOWLEDGE-BASE.md`
  - `Doc/UAT-FEEDBACK-29APR2026.md`
  - `Doc/PROJECT-PROGRESS.md`
  - `Doc/CODE-SCHEMA.md`
- Main goal: Fix UAT round 2 issues from 29 Apr 2026, starting with Sprint A critical bugs and permission defects

## Roles

### Claude Code

- Execute implementation.
- Keep changes scoped by task group.
- Commit only after build/test passes or after clearly documenting why verification could not run.
- Update docs when behavior, commands, or status changes.

### Codex

- Review implementation after each task group.
- Check behavior, permission logic, regression risk, and test/build output.
- Request fixes before moving to the next task group when critical issues remain.

## Ground Rules

- Do not use Prisma migrations. Use `prisma db push` only when schema sync is required.
- Put business rules in backend service layer first, then align frontend UI.
- Do not rely on frontend-only permission hiding for data protection.
- Keep `_not-used/` ignored and do not use it unless explicitly needed for reference.
- Do not touch unrelated cleanup/refactor while fixing UAT items.
- Prefer small commits per task group.
- Use Thai labels where the current UI already uses Thai, and English labels where the page currently uses English.
- Preserve SENA design system colors:
  - Primary: `#32BCAD`
  - Secondary/Completed: `#2E7D9B`
  - Warning/Hold: `#E8A838`
  - Danger/Delay: `#D94F4F`
  - Neutral/Cancelled: `#77787B`

## Recommended Verification Commands

Run what is relevant after each task group:

```bash
cd backend && npm run build
cd frontend && npm run build
```

If Docker/dev server is available:

```bash
docker-compose up -d
curl http://localhost:3002/api/v1/health
```

If test suite is restored/available:

```bash
cd tests && npm test
```

Manual test accounts from knowledge base:

- Admin: `adinuna@sena.co.th` / `123456`
- Manager: `tharab@sena.co.th` / `123456`
- Member: `chanonk@sena.co.th` / `123456`

## Sprint A Execution Order

### A0 — Baseline Check

Purpose: Confirm current app builds before changes.

Files likely involved:

- `frontend/package.json`
- `backend/package.json`
- `docker-compose.yml`

Tasks:

- [ ] Run backend build.
- [ ] Run frontend build.
- [ ] Record any existing failures before changing code.
- [ ] Confirm API port used by Docker/local docs because docs mention both `3001` and `3002`.

Acceptance:

- Build status is known.
- Any existing failure is documented separately from new code changes.

Codex review:

- Verify no code change was mixed into baseline commit unless needed to unblock build.

### A1 — Role Visibility Foundation

UAT issues: `#3`, `#13`, `#17`, `#18`, `#24`, `#25`, `#34`, `#38`

Purpose: Make role-based data visibility consistent and secure.

Expected behavior:

- `ADMIN`: sees all projects and tasks.
- `MANAGER`: sees projects where they are owner/member and tasks inside those projects.
- `MEMBER`: sees only projects where they are member, and only tasks assigned to them via `assigneeId` or `taskAssignees`.

Files likely involved:

- `backend/src/services/project.service.ts`
- `backend/src/services/task.service.ts`
- `backend/src/services/activityLog.service.ts`
- `backend/src/controllers/project.controller.ts`
- `backend/src/controllers/task.controller.ts`
- `frontend/src/pages/dashboard/DashboardPage.tsx`
- `frontend/src/pages/project/MyProjectsPage.tsx`
- `frontend/src/pages/project/ProjectDetailPage.tsx`
- `frontend/src/pages/task/MyTasksPage.tsx`
- `frontend/src/services/projectService.ts`
- `frontend/src/services/taskService.ts`
- `frontend/src/types/index.ts`

Tasks:

- [ ] Audit existing role filtering in project and task services.
- [ ] Add or fix reusable query filters for user visibility.
- [ ] Ensure project list APIs return only allowed projects for Manager/Member.
- [ ] Ensure project detail task list filters Member tasks to assigned tasks only.
- [ ] Ensure My Tasks API returns Admin all tasks, Manager scoped tasks, Member assigned tasks.
- [ ] Ensure Dashboard stats and recent/activity data use the same backend visibility rules.
- [ ] Keep frontend filters aligned with backend response, but do not use frontend filtering as the only protection.

Acceptance:

- Admin dashboard counts all relevant projects/tasks.
- Member dashboard counts only allowed projects/tasks.
- Member cannot see unassigned tasks in Project Detail board.
- Member cannot see unrelated projects in My Projects.
- My Tasks differs correctly between Admin and Member.

Codex review:

- Inspect service-layer filters for auth bypass.
- Check both `assigneeId` and `taskAssignees` are handled.
- Check no sensitive all-project/task endpoint is still used directly by Member pages.

### A2 — Member UI Permission Controls

UAT issues: `#32`, partial `#70`

Purpose: Hide actions that Member should not perform, while backend remains authoritative.

Files likely involved:

- `frontend/src/pages/project/ProjectDetailPage.tsx`
- `frontend/src/pages/project/MyProjectsPage.tsx`
- `frontend/src/pages/task/TaskDetailModal.tsx`
- `backend/src/services/project.service.ts`
- `backend/src/services/task.service.ts`

Tasks:

- [ ] Hide project edit/delete/member management buttons for `MEMBER`.
- [ ] Keep allowed task update actions available for assigned Member where appropriate.
- [ ] Verify backend rejects forbidden project management actions for Member.
- [ ] Confirm Manager can still manage internal projects and project members where intended.

Acceptance:

- Member does not see Add Member/Edit/Delete project controls.
- Direct API calls by Member cannot manage projects beyond allowed permission.
- Admin/Manager controls still appear.

Codex review:

- Check no functionality is only hidden in CSS.
- Check backend permission error shape follows existing API response convention.

### A3 — Daily Update and Attachments

UAT issues: `#44`, `#47`, `#48`, `#49`

Purpose: Fix update creation failure and restore attachment flow.

Expected behavior:

- Daily Update can be created from Task Detail.
- Attachment button is visible where required.
- Multiple files can be attached per note/update/comment as designed.
- Total upload size per note/update is limited to 20MB.
- Image preview works.
- File download works in Docker/local path.

Files likely involved:

- `frontend/src/pages/task/TaskDetailModal.tsx`
- `frontend/src/services/dailyUpdateService.ts`
- `frontend/src/services/commentService.ts`
- `backend/src/services/dailyUpdate.service.ts`
- `backend/src/controllers/dailyUpdate.controller.ts`
- `backend/src/services/attachment.service.ts`
- `backend/src/controllers/upload.controller.ts`
- `backend/src/routes/upload.routes.ts`
- `backend/src/app.ts`
- `backend/uploads/`
- `docker-compose.yml`
- `docker-compose.prod.yml`

Tasks:

- [ ] Reproduce or inspect cause of "Failed to add update".
- [ ] Fix API contract mismatch between frontend and backend.
- [ ] Restore attachment button in update/comment UI.
- [ ] Validate multiple files and 20MB total limit.
- [ ] Fix static serving/download route for uploaded files.
- [ ] Confirm Docker volume mapping does not break file paths.

Acceptance:

- Create update succeeds.
- Refresh page still shows update.
- Upload image then preview renders.
- Upload PDF/Excel/video then file card appears.
- Download returns the uploaded file.
- Oversized attachment is rejected with clear message.

Codex review:

- Check upload path handling does not expose arbitrary files.
- Check file size validation happens before persistence where possible.
- Check frontend handles backend error messages safely.

### A4 — My Projects Export and Navigation Fixes

UAT issues: `#27`, `#31`, `#14`, `#15`

Purpose: Restore missing export controls and fix broken/incorrect links.

Files likely involved:

- `frontend/src/pages/project/MyProjectsPage.tsx`
- `frontend/src/utils/exportExcel.ts`
- `frontend/src/utils/exportPDF.ts`
- `frontend/src/pages/project/ProjectDetailPage.tsx`
- `frontend/src/pages/dashboard/DashboardPage.tsx`

Tasks:

- [ ] Restore Export Excel button in My Projects.
- [ ] Restore Save PDF button in My Projects.
- [ ] Ensure exported data respects current user visibility and filters.
- [ ] Fix Back to Projects behavior to return to previous page/context.
- [ ] Make Dashboard stat cards route consistently to My Projects with appropriate status filter.
- [ ] Fix Team Members link so it shows member list/modal instead of navigating incorrectly.

Acceptance:

- My Projects exports current visible data.
- Member export does not include unrelated projects.
- Back button from Project Detail returns to the originating list when possible.
- Dashboard cards route consistently.

Codex review:

- Check export does not refetch all projects ignoring role filters.
- Check route state/query params are stable after refresh where practical.

### A5 — Gantt Critical Bugs

UAT issues: `#61`, `#63`, `#64`, plus verify `#60` scope

Purpose: Fix broken Gantt behavior in Project Detail. Do not add MyTasks Gantt because issue `#60` is explicitly skipped for now.

Files likely involved:

- `frontend/src/components/project/GanttChart.tsx`
- `frontend/src/pages/project/ProjectDetailPage.tsx`
- `frontend/src/pages/project/ProjectDetailPage.css`

Tasks:

- [ ] Confirm Gantt tab exists in Project Detail.
- [ ] Fix missing tasks in Gantt, including tasks with missing start/due dates if business rule allows default display.
- [ ] Fix drag/resize event so it does not switch back to Board tab.
- [ ] Fix status filter boxes click behavior.
- [ ] Do not implement Gantt inside MyTasksPage in this sprint.

Acceptance:

- Project Detail Gantt opens.
- Gantt task count matches expected visible project tasks.
- Dragging/resizing bar does not change active tab.
- Status filter boxes filter Gantt rows.

Codex review:

- Check event propagation and tab state handling.
- Check visible tasks still respect role visibility from A1.

### A6 — Small Critical/UI Fixes

UAT issues: `#1`, `#2`, `#16`, `#30`

Purpose: Close low-risk bugs from Sprint A.

Files likely involved:

- `frontend/index.html`
- `frontend/src/pages/auth/LoginPage.tsx`
- `frontend/src/constants/index.ts`
- relevant CSS files

Tasks:

- [ ] Change browser title to `IT Project System`.
- [ ] Hide Forgot Password link until email/password reset route is ready.
- [ ] Fix completed status dot shape to circle.
- [ ] Ensure all statuses display and completed uses SENA blue.

Acceptance:

- Browser tab title is correct.
- Login page has no broken Forgot Password link.
- Status dots are circular.
- Completed status color is blue consistently.

Codex review:

- Check no route removal breaks existing forgot/reset pages if they are still used elsewhere.

## Sprint B Preview

Start only after Sprint A is reviewed.

- Dashboard layout overflow: move Quick Access and Team Activity lower.
- Sidebar collapse button clear.
- My Tasks table/list view with sorting.
- Multi-filter: status, priority, tags.
- Subtask count on task cards.
- Daily Updates section placement.
- Subtask start/due dates and assignee.
- Gantt sticky columns and hover activity.
- Project Detail stat cards clickable.
- My Projects group/sort by status.
- Task card shows assignee/owner.
- Hold/Cancelled progress/time logic.

## Documentation Updates

After Sprint A:

- [ ] Update `Doc/PROJECT-PROGRESS.md` with completed task groups and verification status.
- [ ] Update `Doc/UAT-FEEDBACK-29APR2026.md` status markers if this file is being used as live tracker.
- [ ] Add notes for any skipped item or changed scope.

## Commit Strategy

Recommended commit sequence:

1. `chore: record sprint a baseline`
2. `fix(authz): enforce role visibility for projects and tasks`
3. `fix(authz): hide member-only restricted project controls`
4. `fix(updates): restore daily updates and attachment flow`
5. `fix(projects): restore exports and navigation behavior`
6. `fix(gantt): repair project gantt interactions`
7. `fix(ui): close sprint a small uat defects`
8. `docs: update phase 22 progress`

If changes are too large, split commits by backend/frontend but keep each commit buildable when practical.

## Review Handoff Template

Claude Code should report after each task group:

```text
Task group:
Issues covered:
Files changed:
Behavior changed:
Verification run:
Known gaps:
Commit:
```

Codex review result should use:

```text
Review result: pass / needs fixes
Findings:
Required fixes:
Residual risk:
Next recommended task group:
```

