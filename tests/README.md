# 🤖 Automated Test Suite

## Task Management System - Automated Testing

ชุด Test Scripts สำหรับ AI Agent ทดสอบระบบอัตโนมัติ

---

## 📁 โครงสร้างไฟล์

```
tests/
├── api/                          # API Tests (Jest + Supertest)
│   ├── auth.test.ts              # Authentication tests
│   ├── projects.test.ts          # Project management tests
│   ├── tasks.test.ts             # Task management tests
│   ├── notifications.test.ts     # Notification tests
│   └── updates-comments.test.ts  # Daily Updates & Comments tests
│
├── e2e/                          # E2E Tests (Playwright)
│   ├── auth.spec.ts              # Authentication UI flow
│   └── tasks.spec.ts             # Task management UI flow
│
├── setup/                        # Test setup files
│   └── jest.setup.ts             # Jest configuration
│
├── reports/                      # Test reports (auto-generated)
│
├── package.json                  # Dependencies
├── jest.config.js                # Jest configuration
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🚀 Quick Start

### 1. ติดตั้ง Dependencies

```bash
cd tests
npm install
npx playwright install
```

### 2. เตรียม Environment

```bash
# ต้องรัน Backend ก่อน
cd ../backend
npm run dev

# ต้องรัน Frontend ก่อน (terminal ใหม่)
cd ../frontend
npm run dev
```

### 3. รัน Tests

```bash
cd tests

# รัน API Tests ทั้งหมด
npm run test:api

# รัน E2E Tests ทั้งหมด
npm run test:e2e

# รันทั้ง API และ E2E
npm run test
```

---

## 📋 Test Commands

### API Tests (Jest)

```bash
# รัน tests ทั้งหมด
npm run test:api

# รัน tests แบบ watch mode
npm run test:api:watch

# รัน tests พร้อม coverage report
npm run test:api:coverage

# รันเฉพาะไฟล์
npx jest api/auth.test.ts

# รันเฉพาะ test case
npx jest -t "should login successfully"
```

### E2E Tests (Playwright)

```bash
# รัน tests ทั้งหมด
npm run test:e2e

# รัน tests พร้อม UI
npm run test:e2e:ui

# รัน tests แบบเห็น browser
npm run test:e2e:headed

# รัน tests แบบ debug
npm run test:e2e:debug

# ดู test report
npm run test:report

# รันเฉพาะไฟล์
npx playwright test e2e/auth.spec.ts

# รันเฉพาะ test case
npx playwright test -g "should login successfully"

# รันเฉพาะ browser
npx playwright test --project=chromium
```

---

## 🧪 Test Coverage

### API Tests (51 total) ✅

| Module | Tests | Status |
|--------|-------|--------|
| **auth.test.ts** | 18 | ✅ 100% |
| **projects.test.ts** | 13 | ✅ 100% |
| **tasks.test.ts** | 12 | ✅ 100% |
| **notifications.test.ts** | 4 | ✅ 100% |
| **updates-comments.test.ts** | 4 | ✅ 100% |

### E2E Tests (14 total) ✅

| Flow | Tests | Status |
|------|-------|--------|
| **auth.spec.ts** | 8 | ✅ 100% |
| **tasks.spec.ts** | 6 | ✅ 100% |

---

## ⚙️ Environment Variables

```bash
# API Tests
API_URL=http://localhost:3001/api

# E2E Tests
FRONTEND_URL=http://localhost:5173
```

---

## 📊 Test Reports

หลังรัน tests จะได้ reports ที่:

- **API Tests:** `tests/reports/api-test-report.html`
- **E2E Tests:** `tests/reports/e2e/index.html`
- **Coverage:** `tests/coverage/lcov-report/index.html`

---

## 🤖 AI Agent Usage

### สำหรับ AI Agent ทดสอบอัตโนมัติ

```bash
# Full Test Suite
cd /path/to/YTY\ Project/tests
npm run setup
npm run test

# ตรวจสอบผลลัพธ์
cat reports/e2e-results.json
```

### Expected Output

```
✅ API Tests: 51 passed
✅ E2E Tests: 14 passed
📊 Total: 65 tests (100%)
```

---

## 🔧 Troubleshooting

### 1. Backend not running

```bash
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Solution:** รัน backend ก่อน:
```bash
cd backend && npm run dev
```

### 2. Frontend not running

```bash
Error: page.goto: net::ERR_CONNECTION_REFUSED
```

**Solution:** รัน frontend ก่อน:
```bash
cd frontend && npm run dev
```

### 3. Playwright browsers not installed

```bash
Error: Executable doesn't exist
```

**Solution:** ติดตั้ง browsers:
```bash
npx playwright install
```

### 4. Database not seeded

```bash
Error: User not found
```

**Solution:** Seed database:
```bash
cd backend
npx prisma db seed
```

---

## 📝 Writing New Tests

### API Test Template

```typescript
import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

describe('My Feature API', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Login
    const res = await request(API_URL)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin@1234' });
    accessToken = res.body.data.accessToken;
  });

  it('should do something', async () => {
    const res = await request(API_URL)
      .get('/my-endpoint')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-page`);
    
    await expect(page.getByText('Expected Text')).toBeVisible();
    
    await page.getByRole('button', { name: 'Click Me' }).click();
    
    await expect(page.getByText('Result')).toBeVisible();
  });
});
```

---

## ✅ Checklist for AI Agent

- [ ] Backend running at `localhost:3001`
- [ ] Frontend running at `localhost:5173`
- [ ] Database seeded with test data
- [ ] Run `npm run setup` (first time only)
- [ ] Run `npm run test`
- [ ] Check reports in `tests/reports/`

---

*สร้างเมื่อ: 2026-01-23 | Version: 2.0*
*อัพเดทล่าสุด: 2026-01-26 - ผ่าน 100% (65/65 tests)*
