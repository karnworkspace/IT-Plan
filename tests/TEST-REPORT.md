# TaskFlow API Test Report

**Generated:** 2026-02-08 21:35 (UTC+7)
**Environment:** Docker Development
**API URL:** http://localhost:3001/api/v1
**Status:** ✅ **ALL TESTS PASSED**

---

## 📊 Test Summary

| Category | Passed | Total | Rate |
|----------|--------|-------|------|
| **Authentication** | 6 | 6 | ✅ 100% |
| **Projects** | 9 | 9 | ✅ 100% |
| **Tasks** | 10 | 10 | ✅ 100% |
| **Comments** | 5 | 5 | ✅ 100% |
| **Daily Updates** | 4 | 4 | ✅ 100% |
| **Notifications** | 3 | 3 | ✅ 100% |
| **Health Check** | 1 | 1 | ✅ 100% |
| **Cleanup** | 4 | 4 | ✅ 100% |
| **TOTAL** | **41** | **41** | **✅ 100%** |

---

## ✅ All Tests Passed (41/41)

### 🔐 Authentication (6 tests)
- ✅ Login with valid credentials
- ✅ Fail login with invalid credentials
- ✅ Fail login with missing credentials
- ✅ Get current user info
- ✅ Fail without authentication
- ✅ Refresh access token

### 📁 Projects (9 tests)
- ✅ Get all projects with pagination
- ✅ Support pagination params
- ✅ Create a new project
- ✅ Fail without name (validation)
- ✅ Get project by ID
- ✅ Return 404 for non-existent project
- ✅ Update project
- ✅ Get project statistics
- ✅ Get project members

### 📋 Tasks (10 tests)
- ✅ Create a new task
- ✅ Fail without title (validation)
- ✅ Get all tasks in project
- ✅ Get current user tasks (my-tasks)
- ✅ Get task by ID
- ✅ Update task
- ✅ Update task status to IN_PROGRESS
- ✅ Update task status to DONE
- ✅ Get task statistics

### 💬 Comments (5 tests)
- ✅ Create a comment
- ✅ Get task comments
- ✅ Get comment by ID
- ✅ Update comment
- ✅ Get user comments

### 📊 Daily Updates (4 tests)
- ✅ Create a daily update
- ✅ Get task updates
- ✅ Get update by ID
- ✅ Update daily update

### 🔔 Notifications (3 tests)
- ✅ Get user notifications
- ✅ Get unread count
- ✅ Mark all as read

### 🏁 Health Check (1 test)
- ✅ Return health status

### 🧹 Cleanup (4 tests)
- ✅ Delete comment
- ✅ Delete daily update
- ✅ Delete task
- ✅ Delete project

---

## 📋 Test Files

| File | Description | Tests |
|------|-------------|-------|
| `api/comprehensive-api.test.ts` | Full API endpoint tests | 41 |
| `scenarios/workflow.test.ts` | E2E workflow scenarios | 30+ |

---

## 🔧 Test Commands

```bash
cd tests

# Run comprehensive API tests
npm run test:api

# Run scenario tests
npm run test:scenarios

# Run all tests
npm test

# Run with coverage
npm run test:api:coverage
```

---

## 📁 Test Structure

```
tests/
├── api/
│   ├── comprehensive-api.test.ts    # Full API tests ✅
│   ├── auth.test.ts                 # Auth tests
│   ├── projects.test.ts             # Project tests
│   ├── tasks.test.ts                # Task tests
│   ├── notifications.test.ts        # Notification tests
│   └── updates-comments.test.ts     # Updates & Comments
├── scenarios/
│   └── workflow.test.ts             # E2E workflows
├── setup/
│   ├── jest.setup.ts                # Jest setup
│   └── test-data.ts                 # Test data
├── jest.config.js                   # Jest configuration
├── run-full-test.sh                 # Full test runner
└── TEST-REPORT.md                   # This report
```

---

## 📋 API Coverage

| Module | Endpoints Tested |
|--------|-----------------|
| Auth | `/login`, `/me`, `/refresh` |
| Projects | CRUD + `/stats`, `/members` |
| Tasks | CRUD + `/status`, `/stats`, `/my-tasks` |
| Comments | CRUD + `/user/comments` |
| Daily Updates | CRUD |
| Notifications | List + `/unread/count`, `/read-all` |
| Health | `/health` |

---

## 🔍 Test Credentials

| Field | Value |
|-------|-------|
| Email | `tharab@sena.co.th` |
| Password | `Sen@1775` |
| PIN | `112233` |

---

## 📝 Notes

- All tests run against Docker development environment
- Tests automatically clean up created resources
- Rate limiting may affect rapid test runs

```bash
# Reset rate limiter if needed
docker restart taskflow-backend
```

---

## ✅ Test Result

```
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        0.898 s
```

---

**Last Updated:** 2026-02-08
**Status:** ✅ All 41 tests passing (100%)
