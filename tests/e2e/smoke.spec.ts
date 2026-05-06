import { test, expect } from '@playwright/test';

const ADMIN = { email: 'test-admin@test.com', password: 'Test123!' };
const MEMBER = { email: 'test-member@test.com', password: 'Test123!' };

async function login(page, user: { email: string; password: string }) {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: /sign in|login/i }).click();
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10_000 });
}

// ─── Auth ───

test('Login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByText('IT Project System')).toBeVisible();
});

test('Admin login → Dashboard', async ({ page }) => {
  await login(page, ADMIN);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

// ─── Dashboard ───

test('Dashboard shows stats and projects', async ({ page }) => {
  await login(page, ADMIN);
  await expect(page.getByText('Total Projects')).toBeVisible();
  await expect(page.getByText('Recent Projects')).toBeVisible();
});

// ─── My Projects ───

test('My Projects page loads', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await expect(page.getByRole('heading', { name: /My Projects/i })).toBeVisible();
  // Should see Smoke Test Project
  await expect(page.getByText('Smoke Test Project')).toBeVisible({ timeout: 10_000 });
});

// ─── Project Detail ───

test('Project Detail loads task board', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await page.getByText('Smoke Test Project').click();
  // Wait for project detail
  await expect(page.getByText('Board View')).toBeVisible({ timeout: 10_000 });
  // Should see both tasks
  await expect(page.getByText('Smoke Task Assigned')).toBeVisible();
  await expect(page.getByText('Smoke Task Unassigned')).toBeVisible();
});

// ─── Task Detail Modal ───

test('Open task detail modal', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await page.getByText('Smoke Test Project').click();
  await page.getByText('Smoke Task Assigned').click();
  // Modal should open with task title
  await expect(page.getByText('Daily Updates')).toBeVisible({ timeout: 10_000 });
});

test('Add Daily Update (notes only)', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await page.getByText('Smoke Test Project').click();
  await page.getByText('Smoke Task Assigned').click();
  await expect(page.getByText('Daily Updates')).toBeVisible({ timeout: 10_000 });

  // Click Add Daily Update
  await page.getByRole('button', { name: /Add Daily Update/i }).click();
  // Fill notes
  await page.getByPlaceholder('What did you accomplish today?').fill('E2E test update');
  // Submit
  await page.getByRole('button', { name: 'Update' }).click();
  // Should see success
  await expect(page.getByText('Update added')).toBeVisible({ timeout: 5_000 });
});

test('Add comment', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await page.getByText('Smoke Test Project').click();
  await page.getByText('Smoke Task Assigned').click();
  await expect(page.getByRole('heading', { name: /Comments/i })).toBeVisible({ timeout: 10_000 });

  // Type comment
  const commentInput = page.getByPlaceholder(/comment|write/i).first();
  await commentInput.fill('E2E test comment');
  // Send
  await page.getByRole('button', { name: /send|post|comment/i }).first().click();
  await expect(page.getByText('Comment added')).toBeVisible({ timeout: 5_000 });
});

// ─── Calendar ───

test('Calendar page loads', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/calendar');
  await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
});

// ─── Gantt ───

test('Gantt tab loads in Project Detail', async ({ page }) => {
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await page.getByText('Smoke Test Project').click();
  await expect(page.getByText('Board View')).toBeVisible({ timeout: 10_000 });
  // Switch to Gantt tab
  await page.getByText('Gantt View').click();
  // Should see task name column
  await expect(page.getByText('Task Name')).toBeVisible({ timeout: 5_000 });
});

// ─── Member role scoping ───

test('Member sees only assigned project/task', async ({ page }) => {
  await login(page, MEMBER);

  // Go to My Projects
  await page.goto('/my-projects');
  await expect(page.getByText('Smoke Test Project')).toBeVisible({ timeout: 10_000 });

  // Open project
  await page.getByText('Smoke Test Project').click();
  await expect(page.getByText('Board View')).toBeVisible({ timeout: 10_000 });

  // Should see assigned task
  await expect(page.getByText('Smoke Task Assigned')).toBeVisible();
  // Should NOT see unassigned task
  await expect(page.getByText('Smoke Task Unassigned')).not.toBeVisible();
});

// ─── Gantt drag (skip if flaky) ───

test.skip('Gantt drag updates task dates', async ({ page }) => {
  // TODO: Implement when drag interaction is stable in headless mode
  // Gantt drag requires precise mouse positioning on bar elements
  // which can be flaky in CI/headless environments.
  await login(page, ADMIN);
  await page.goto('/my-projects');
  await page.getByText('Smoke Test Project').click();
  await page.getByText('Gantt View').click();
  // Would need to: locate bar, dragTo new position, verify success message
});
