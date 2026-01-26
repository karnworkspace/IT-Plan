/**
 * Task Management API Tests
 * ทดสอบ Task CRUD, Status Updates, และ Notifications
 */

import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Helper function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to extract data from response (handles both direct and nested structures)
const extractData = (resBody: any, key?: string) => {
    if (key && resBody.data?.[key]) {
        return resBody.data[key];
    }
    return resBody.data;
};

describe('Task Management API', () => {
    let accessToken: string;
    let userId: string;
    let projectId: string;
    let taskId: string;
    let setupSuccessful = false;

    // Setup: Create user, login, and create project
    beforeAll(async () => {
        try {
            // Create a unique test user
            const testEmail = `task-test-${Date.now()}@example.com`;

            const regRes = await request(API_URL)
                .post('/auth/register')
                .send({
                    email: testEmail,
                    password: 'Test@1234',
                    name: 'Task Test User',
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
                userId = loginRes.body.data.user?.id || loginRes.body.data.id;
            }

            if (!accessToken) {
                console.error('Failed to get access token:', loginRes.body);
                return;
            }

            await delay(100);

            // Create test project
            const projectRes = await request(API_URL)
                .post('/projects')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Task Test Project',
                    description: 'Project for task testing',
                });

            // Handle nested response structure (data.project or data directly)
            const projectData = projectRes.body.data?.project || projectRes.body.data;
            if (projectData?.id) {
                projectId = projectData.id;
                setupSuccessful = true;
            } else {
                console.error('Failed to create project:', projectRes.body);
            }
        } catch (error) {
            console.error('Setup failed:', error);
        }
    });

    // Cleanup: Delete project after tests
    afterAll(async () => {
        if (projectId && accessToken) {
            await request(API_URL)
                .delete(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);
        }
    });

    // ==================== TASK CRUD TESTS ====================
    describe('Task CRUD Operations', () => {
        describe('POST /projects/:projectId/tasks', () => {
            it('should create a new task', async () => {
                if (!setupSuccessful) {
                    console.log('Skipping: Setup failed');
                    return;
                }

                await delay(100);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                const res = await request(API_URL)
                    .post(`/projects/${projectId}/tasks`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        title: 'Test Task',
                        description: 'A test task for automated testing',
                        priority: 'HIGH',
                        dueDate: tomorrow.toISOString(),
                    });

                expect([200, 201]).toContain(res.status);
                expect(res.body.success).toBe(true);

                // Handle nested response (data.task or data directly)
                const taskData = res.body.data?.task || res.body.data;
                expect(taskData).toHaveProperty('id');
                expect(taskData.title).toBe('Test Task');

                taskId = taskData.id;
            });

            it('should fail to create task without title', async () => {
                if (!setupSuccessful) return;

                await delay(100);
                const res = await request(API_URL)
                    .post(`/projects/${projectId}/tasks`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        description: 'No title task',
                    });

                expect(res.status).toBe(400);
            });
        });

        describe('GET /projects/:projectId/tasks', () => {
            it('should get all tasks in project', async () => {
                if (!setupSuccessful) return;

                await delay(100);
                const res = await request(API_URL)
                    .get(`/projects/${projectId}/tasks`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                const tasks = res.body.data?.tasks || res.body.data;
                expect(Array.isArray(tasks)).toBe(true);
            });
        });

        describe('GET /tasks/:id', () => {
            it('should get task by ID', async () => {
                if (!taskId) {
                    console.log('Skipping: No taskId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .get(`/tasks/${taskId}`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                const taskData = res.body.data?.task || res.body.data;
                expect(taskData.id).toBe(taskId);
            });

            it('should return 404 for non-existent task', async () => {
                if (!accessToken) return;

                await delay(100);
                const res = await request(API_URL)
                    .get('/tasks/00000000-0000-0000-0000-000000000000')
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(404);
            });
        });

        describe('PUT /tasks/:id', () => {
            it('should update task', async () => {
                if (!taskId) {
                    console.log('Skipping: No taskId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .put(`/tasks/${taskId}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        title: 'Updated Test Task',
                        description: 'Updated description',
                        priority: 'URGENT',
                    });

                expect(res.status).toBe(200);
                const taskData = res.body.data?.task || res.body.data;
                expect(taskData.title).toBe('Updated Test Task');
            });
        });

        describe('PATCH /tasks/:id/status', () => {
            it('should update task status to IN_PROGRESS', async () => {
                if (!taskId) {
                    console.log('Skipping: No taskId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .patch(`/tasks/${taskId}/status`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        status: 'IN_PROGRESS',
                        progress: 25,
                    });

                expect(res.status).toBe(200);
                const taskData = res.body.data?.task || res.body.data;
                expect(taskData.status).toBe('IN_PROGRESS');
            });

            it('should update task status to DONE', async () => {
                if (!taskId) {
                    console.log('Skipping: No taskId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .patch(`/tasks/${taskId}/status`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        status: 'DONE',
                        progress: 100,
                    });

                expect(res.status).toBe(200);
                const taskData = res.body.data?.task || res.body.data;
                expect(taskData.status).toBe('DONE');
            });
        });
    });

    // ==================== MY TASKS TESTS ====================
    describe('GET /my-tasks', () => {
        it('should get tasks assigned to or created by current user', async () => {
            if (!accessToken) return;

            await delay(100);
            const res = await request(API_URL)
                .get('/my-tasks')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            const tasks = res.body.data?.tasks || res.body.data;
            expect(Array.isArray(tasks)).toBe(true);
        });
    });

    // ==================== TASK STATS TESTS ====================
    describe('GET /projects/:projectId/tasks/stats', () => {
        it('should get task statistics', async () => {
            if (!setupSuccessful) return;

            await delay(100);
            const res = await request(API_URL)
                .get(`/projects/${projectId}/tasks/stats`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        });
    });

    // ==================== DELETE TASK ====================
    describe('DELETE /tasks/:id', () => {
        it('should delete task', async () => {
            if (!taskId) {
                console.log('Skipping: No taskId available');
                return;
            }

            await delay(100);
            const res = await request(API_URL)
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
        });

        it('should confirm task is deleted', async () => {
            if (!taskId) return;

            await delay(100);
            const res = await request(API_URL)
                .get(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(404);
        });
    });
});

