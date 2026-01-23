# Testing Guide - Task Management System

**Last Updated:** 2026-01-22 17:20
**Purpose:** Guide for testing the complete system end-to-end

---

## 🚀 Quick Start

### Prerequisites
- Backend running: `http://localhost:3000`
- Frontend running: `http://localhost:5173`
- Test user registered: `endtoend@test.com` / `password123`

### Test Data Already Created
- ✅ Project: "SENA 360 Revamp" (ID: bba8891c-329a-4b23-ba93-5901fbd31f59)
- ✅ Task: "Test Task for Daily Updates" (ID: a99a03fc-e907-4bc8-95ed-d4d4ccfdf831)

---

## 📋 Test Checklist

### 1. Authentication (5 min)

#### 1.1 Login with Email/Password
```
1. Open: http://localhost:5173/login
2. Click "Email Login" tab
3. Enter: endtoend@test.com
4. Enter: password123
5. Click "Login"
6. ✅ Verify: Redirected to Dashboard
```

#### 1.2 PIN Login (Optional)
```
1. Open: http://localhost:5173/login
2. Click "PIN Login" tab
3. Enter: Your 6-digit PIN (if set)
4. Click "Login"
5. ✅ Verify: Redirected to Dashboard
```

#### 1.3 Setup PIN (First time only)
```
1. If no PIN set, redirect to: http://localhost:5173/setup-pin
2. Enter 6-digit PIN (e.g., 123456)
3. Click "Setup PIN"
4. ✅ Verify: Redirected to Dashboard
```

---

### 2. Dashboard - Project API Integration (10 min)

#### 2.1 Load Projects
```
1. After login, wait for page to load
2. ✅ Verify: Projects appear in dropdown (not "Select a project")
3. ✅ Verify: "SENA 360 Revamp" project is visible
4. ✅ Verify: Project shows correct status (ACTIVE)
5. ✅ Verify: No loading spinner
```

#### 2.2 Project Overview Stats
```
1. Look at "Project Overview" section
2. ✅ Verify: Total Tasks shows correct number
3. ✅ Verify: Completed shows 0 (no completed tasks yet)
4. ✅ Verify: In Progress shows 1 (Test Task)
5. ✅ Verify: Progress bar shows correct percentage
6. ✅ Verify: No errors in console (F12)
```

#### 2.3 My Projects Overview
```
1. Look at "MY PROJECTS OVERVIEW" section
2. ✅ Verify: "SENA 360 Revamp" card is visible
3. ✅ Verify: Project status tag is correct
4. ✅ Verify: Task count is displayed
5. ✅ Verify: Hover effect works
```

#### 2.4 Task Board
```
1. Look at "TASK BOARD SECTION"
2. ✅ Verify: "Test Task for Daily Updates" is displayed
3. ✅ Verify: Task shows in "IN PROGRESS" column
4. ✅ Verify: Task assignee avatar is shown
5. ✅ Verify: Task progress bar is displayed
6. ✅ Verify: Priority tag is correct (HIGH/URGENT)
```

#### 2.5 Switch Projects
```
1. Click project selector dropdown
2. ✅ Verify: Project list shows all projects
3. ✅ Verify: Click to select different project
4. ✅ Verify: Task board updates for selected project
5. ✅ Verify: Project overview stats update
```

---

### 3. Network Requests Debugging (5 min)

#### 3.1 Check API Calls
```
1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Click "Fetch/XHR" filter
4. Look for requests to: http://localhost:3000
5. ✅ Verify: GET /api/v1/projects returns 200
6. ✅ Verify: GET /api/v1/projects/:id/stats returns 200
7. ✅ Verify: GET /api/v1/projects/:id/tasks returns 200
```

#### 3.2 Check Auth Token
```
1. In Network tab, find any API request
2. Click on request → Headers tab
3. ✅ Verify: Authorization header exists
4. ✅ Verify: Bearer token is present
5. ✅ Verify: No 401 Unauthorized errors
```

#### 3.3 Check Response Data
```
1. Click on API request → Response tab
2. ✅ Verify: Response has { "success": true }
3. ✅ Verify: data structure matches expected format
4. ✅ Verify: No error messages
```

---

### 4. Error Scenarios (5 min)

#### 4.1 API Down
```
1. Stop backend server (Ctrl+C in backend terminal)
2. Refresh dashboard page
3. ✅ Verify: Error message appears
4. ✅ Verify: "Failed to load projects" toast appears
5. Restart backend: cd backend && npm run dev
```

#### 4.2 Invalid Token
```
1. Open DevTools → Application → Local Storage
2. Clear accessToken
3. Refresh page
4. ✅ Verify: Redirected to login
5. ✅ Verify: Unauthorized error handling works
```

#### 4.3 Empty State
```
1. (Optional) Clear all projects from database
2. Refresh dashboard
3. ✅ Verify: "No projects" message appears
4. ✅ Verify: User sees friendly empty state
```

---

### 5. Backend API Testing (10 min)

#### 5.1 Create New Project
```bash
# Login first
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"endtoend@test.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# Create project
curl -s -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Project 2",
    "description": "Another test project",
    "color": "#52c41a",
    "status": "ACTIVE"
  }' | jq '.'
```

#### 5.2 Create New Task
```bash
PROJECT_ID="<your_project_id>"
curl -s -X POST "http://localhost:3000/api/v1/projects/$PROJECT_ID/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "New Test Task",
    "description": "Testing task creation",
    "priority": "HIGH",
    "status": "TODO"
  }' | jq '.'
```

#### 5.3 Create Daily Update
```bash
TASK_ID="<your_task_id>"
curl -s -X POST "http://localhost:3000/api/v1/tasks/$TASK_ID/updates" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "progress": 50,
    "status": "IN_PROGRESS",
    "notes": "Making good progress"
  }' | jq '.'
```

#### 5.4 Create Comment
```bash
TASK_ID="<your_task_id>"
curl -s -X POST "http://localhost:3000/api/v1/tasks/$TASK_ID/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Great progress! Keep it up."
  }' | jq '.'
```

#### 5.5 Create Notification
```bash
TASK_ID="<your_task_id>"
curl -s -X POST "http://localhost:3000/api/v1/notifications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "TASK_ASSIGNED",
    "title": "New Task",
    "message": "You have a new task"
  }' | jq '.'
```

---

### 6. Dashboard Functionality (5 min)

#### 6.1 Responsive Design
```
1. Resize browser window to tablet size (768px)
2. ✅ Verify: Layout adjusts correctly
3. Resize to mobile size (375px)
4. ✅ Verify: Sidebar collapses or adjusts
5. ✅ Verify: Cards stack vertically
```

#### 6.2 Loading States
```
1. Open DevTools → Network
2. Set throttling to "Slow 3G"
3. Refresh page
4. ✅ Verify: Spinners appear during loading
5. ✅ Verify: Skeleton screens work
6. ✅ Verify: No content flash
```

#### 6.3 Accessibility
```
1. Use Tab key to navigate
2. ✅ Verify: Keyboard navigation works
3. Use screen reader (optional)
4. ✅ Verify: Alt text exists
5. ✅ Verify: ARIA labels present
```

---

## ✅ Success Criteria

### Minimum Viable Product (MVP)
- [ ] User can login with email/password
- [ ] Dashboard loads projects from API
- [ ] Dashboard loads tasks from API
- [ ] Project stats display correctly
- [ ] Task board shows tasks in correct columns
- [ ] No console errors
- [ ] Network requests all return 200

### Complete System
- [ ] All above criteria
- [ ] Multiple projects can be created/switched
- [ ] Tasks can be created/updated
- [ ] Daily updates work
- [ ] Comments work
- [ ] Notifications display
- [ ] Error handling works for all edge cases
- [ ] Loading states work
- [ ] Responsive design works

---

## 🔧 Troubleshooting

### Common Issues

**1. Dashboard shows "Select a project"**
- Cause: No projects in database
- Fix: Create a project via API first
```bash
# Quick fix - create project
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"endtoend@test.com","password":"password123"}' \
  | jq -r '.data.accessToken')

curl -s -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Project","color":"#1890ff","status":"ACTIVE"}'
```

**2. "Failed to load projects" error**
- Cause: Backend not running or CORS error
- Fix: 
  1. Check backend is running: `cd backend && npm run dev`
  2. Check CORS config in backend
  3. Check browser console for specific error

**3. 401 Unauthorized errors**
- Cause: Token expired or invalid
- Fix: 
  1. Logout and login again
  2. Check localStorage for valid token
  3. Verify token refresh logic

**4. Tasks not appearing**
- Cause: Tasks not in database or API error
- Fix:
  1. Check Network tab for API response
  2. Verify task.projectId matches selected project
  3. Check for console errors

**5. Progress bar shows 0%**
- Cause: No completed tasks or API returns wrong data
- Fix:
  1. Check project stats API response
  2. Verify stats.done field exists
  3. Check TaskStats interface matches API response

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

✅ Authentication
  - Login with email: ____ / ____
  - Login with PIN: ____ / ____
  - Token storage: ____ / ____

✅ Dashboard
  - Load projects: ____ / ____
  - Load tasks: ____ / ____
  - Project stats: ____ / ____
  - Task board: ____ / ____

✅ API Integration
  - Project API: ____ / ____
  - Task API: ____ / ____
  - Stats API: ____ / ____

✅ UI/UX
  - Loading states: ____ / ____
  - Error handling: ____ / ____
  - Responsive design: ____ / ____

Overall Score: __ / 10

Notes:
- _________________________________________________
- _________________________________________________
- _________________________________________________
```

---

## 📝 Test Report Format

### Pass/Fail Summary
```
| Test Case | Expected | Actual | Status |
|-----------|----------|---------|--------|
| Login | Dashboard | Dashboard | ✅ |
| Load Projects | List appears | List appears | ✅ |
| Load Tasks | Tasks appear | Tasks appear | ✅ |
| Stats Display | Correct numbers | Correct numbers | ✅ |
```

### Issues Found
1. Description: _______________________
   Severity: Low/Medium/High
   Steps to reproduce:
   - _________________________
   - _________________________
   
---

## 🎯 Next Steps After Testing

1. **If All Tests Pass:**
   - Deploy to staging
   - Invite beta testers
   - Collect user feedback
   - Plan production deployment

2. **If Issues Found:**
   - Create bug tickets in issue tracker
   - Prioritize by severity
   - Fix critical issues first
   - Retest fixes
   - Update documentation

3. **Performance Testing:**
   - Test with 100+ projects
   - Test with 1000+ tasks
   - Measure API response times
   - Optimize slow queries

---

## 📞 Support

If you encounter issues not covered in this guide:

1. Check console errors (F12 → Console)
2. Check network failures (F12 → Network)
3. Review backend logs (terminal)
4. Check API documentation: `Doc/API-Specification.md`
5. Check project progress: `Doc/PROJECT-PROGRESS.md`

---

**Good luck with testing! 🚀**
