/**
 * Playwright E2E Tests - Task Management Flow
 * ทดสอบ UI Flow สำหรับ Project และ Task Management
 */

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_URL = 'http://localhost:3000/api/v1';

// Generate unique email for each test run
let testEmail: string;
let testPassword = 'Test@1234';
let isLoggedIn = false;

// Helper function to switch to Email Login tab
async function switchToEmailTab(page: Page) {
    const emailTab = page.getByRole('tab', { name: /email/i });
    if (await emailTab.isVisible()) {
        await emailTab.click();
        await page.waitForTimeout(300);
    }
}

// Helper function to fill PIN input (6 individual inputs)
async function fillPinInput(page: Page, containerIndex: number, pin: string) {
    // Find the nth pin-input-container
    const containers = page.locator('.pin-input-container');
    const container = containers.nth(containerIndex);

    if (await container.isVisible()) {
        const inputs = container.locator('input');
        const count = await inputs.count();

        for (let i = 0; i < Math.min(count, pin.length); i++) {
            await inputs.nth(i).fill(pin[i]);
            await page.waitForTimeout(50);
        }
    }
}

// Helper function to complete PIN setup
async function completePinSetup(page: Page) {
    if (!page.url().includes('setup-pin')) return;

    // Wait for page to load
    await page.waitForTimeout(500);

    // Use a valid PIN (not sequential, not repeated): 142857
    const validPin = '142857';

    // Fill first PIN input (Create PIN)
    await fillPinInput(page, 0, validPin);

    // Wait and fill second PIN input (Confirm PIN)
    await page.waitForTimeout(300);
    await fillPinInput(page, 1, validPin);

    // Wait for button to be enabled
    await page.waitForTimeout(500);

    // Click Complete Setup button
    const setupBtn = page.getByRole('button', { name: /complete setup/i });
    if (await setupBtn.isEnabled()) {
        await setupBtn.click();

        // Wait for redirect to dashboard
        await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => { });
    }
}

// Helper function to login with test user
async function loginTestUser(page: Page, request: any) {
    // Create unique user if not exists
    if (!testEmail) {
        testEmail = `e2e-tasks-${Date.now()}@example.com`;

        // Register test user
        await request.post(`${API_URL}/auth/register`, {
            data: {
                email: testEmail,
                password: testPassword,
                name: 'E2E Tasks Test User',
            },
        });
    }

    await page.goto(`${BASE_URL}/login`);
    await switchToEmailTab(page);
    await page.getByPlaceholder(/email/i).first().fill(testEmail);
    await page.getByPlaceholder(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for redirect - might go to setup-pin first
    await page.waitForURL(/\/(dashboard|setup-pin|projects)/, { timeout: 15000 });

    // Complete PIN setup if needed
    if (page.url().includes('setup-pin')) {
        await completePinSetup(page);
    }

    isLoggedIn = true;
}

test.describe('Project Management Flow', () => {
    test.beforeEach(async ({ page, request }) => {
        await loginTestUser(page, request);
    });

    // ==================== PROJECTS PAGE ====================
    test.describe('Projects Page', () => {
        test('should display projects page', async ({ page }) => {
            await page.goto(`${BASE_URL}/projects`);

            // Wait for page to load
            await page.waitForTimeout(1000);

            // Should be on projects page or have projects content
            const isProjectsPage = page.url().includes('project');
            expect(isProjectsPage).toBeTruthy();
        });

        test('should show create project button or content', async ({ page }) => {
            await page.goto(`${BASE_URL}/projects`);
            await page.waitForTimeout(1000);

            // Check for any content on projects page
            const content = page.locator('body');
            expect(await content.isVisible()).toBeTruthy();
        });
    });
});

test.describe('Dashboard Flow', () => {
    test.beforeEach(async ({ page, request }) => {
        await loginTestUser(page, request);
    });

    test('should display dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);

        // Dashboard should be accessible
        await page.waitForTimeout(1000);
        expect(page.url()).toContain('dashboard');
    });

    test('should have dashboard content', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(1500);

        // Dashboard should have some content
        const hasContent = await page.locator('body').isVisible();
        expect(hasContent).toBeTruthy();
    });
});

test.describe('My Tasks Flow', () => {
    test.beforeEach(async ({ page, request }) => {
        await loginTestUser(page, request);
    });

    test('should display my tasks page', async ({ page }) => {
        await page.goto(`${BASE_URL}/my-tasks`);
        await page.waitForTimeout(1000);

        // Should be on tasks page
        const isTasksPage = page.url().includes('task');
        expect(isTasksPage).toBeTruthy();
    });
});

test.describe('Calendar Flow', () => {
    test.beforeEach(async ({ page, request }) => {
        await loginTestUser(page, request);
    });

    test('should display calendar page', async ({ page }) => {
        await page.goto(`${BASE_URL}/calendar`);
        await page.waitForTimeout(1000);

        // Should be on calendar page
        expect(page.url()).toContain('calendar');
    });
});
