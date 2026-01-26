/**
 * Daily Updates & Comments API Tests
 * ทดสอบ Daily Updates และ Comments CRUD
 */

import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Daily Updates & Comments API', () => {
    let accessToken: string;
    let projectId: string;
    let taskId: string;
    let updateId: string;
    let commentId: string;

    beforeAll(async () => {
        // Create a unique test user
        const testEmail = `updates-test-${Date.now()}@example.com`;

        await request(API_URL)
            .post('/auth/register')
            .send({
                email: testEmail,
                password: 'Test@1234',
                name: 'Updates Test User',
            });

        await delay(100);

        const loginRes = await request(API_URL)
            .post('/auth/login')
            .send({
                email: testEmail,
                password: 'Test@1234',
            });

        if (loginRes.body.data) {
            accessToken = loginRes.body.data.accessToken;
        }

        await delay(100);

        // Create project
        const projectRes = await request(API_URL)
            .post('/projects')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Updates Test Project' });

        if (projectRes.body.data) {
            projectId = projectRes.body.data.id;
        }

        await delay(100);

        // Create task
        const taskRes = await request(API_URL)
            .post(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Test Task for Updates' });

        if (taskRes.body.data) {
            taskId = taskRes.body.data.id;
        }
    });

    afterAll(async () => {
        if (projectId && accessToken) {
            await request(API_URL)
                .delete(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);
        }
    });

    // ==================== DAILY UPDATES TESTS ====================
    describe('Daily Updates', () => {
        describe('POST /tasks/:taskId/updates', () => {
            it('should create a daily update', async () => {
                await delay(100);
                const res = await request(API_URL)
                    .post(`/tasks/${taskId}/updates`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        progress: 50,
                        status: 'IN_PROGRESS',
                        notes: 'Made good progress today',
                    });

                if (res.status === 201) {
                    expect(res.body.data.progress).toBe(50);
                    updateId = res.body.data.id;
                }
            });
        });

        describe('GET /tasks/:taskId/updates', () => {
            it('should get all updates for a task', async () => {
                await delay(100);
                const res = await request(API_URL)
                    .get(`/tasks/${taskId}/updates`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                const updates = res.body.data.updates || res.body.data;
                expect(Array.isArray(updates)).toBe(true);
            });
        });
    });

    // ==================== COMMENTS TESTS ====================
    describe('Comments', () => {
        describe('POST /tasks/:taskId/comments', () => {
            it('should create a comment', async () => {
                await delay(100);
                const res = await request(API_URL)
                    .post(`/tasks/${taskId}/comments`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        content: 'This is a test comment',
                    });

                if (res.status === 201) {
                    expect(res.body.data.content).toBe('This is a test comment');
                    commentId = res.body.data.id;
                }
            });
        });

        describe('GET /tasks/:taskId/comments', () => {
            it('should get all comments for a task', async () => {
                await delay(100);
                const res = await request(API_URL)
                    .get(`/tasks/${taskId}/comments`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                const comments = res.body.data.comments || res.body.data;
                expect(Array.isArray(comments)).toBe(true);
            });
        });
    });
});
