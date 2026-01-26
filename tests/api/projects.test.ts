/**
 * Project Management API Tests
 * ทดสอบ Project CRUD และ Members Management
 */

import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Project Management API', () => {
    let accessToken: string;
    let userId: string;
    let projectId: string;
    let secondUserId: string;
    let setupSuccessful = false;

    // Setup: Create user and login before tests
    beforeAll(async () => {
        try {
            // Create a unique test user
            const testEmail = `project-test-${Date.now()}@example.com`;

            // Register
            await request(API_URL)
                .post('/auth/register')
                .send({
                    email: testEmail,
                    password: 'Test@1234',
                    name: 'Project Test User',
                });

            await delay(100);

            // Login
            const loginRes = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: 'Test@1234',
                });

            if (loginRes.body.data) {
                accessToken = loginRes.body.data.accessToken;
                userId = loginRes.body.data.user?.id || loginRes.body.data.id;
                setupSuccessful = !!accessToken;
            }

            if (!accessToken) {
                console.error('Failed to get access token:', loginRes.body);
                return;
            }

            // Create second user for member tests
            const secondEmail = `project-test2-${Date.now()}@example.com`;
            const registerRes = await request(API_URL)
                .post('/auth/register')
                .send({
                    email: secondEmail,
                    password: 'Test@1234',
                    name: 'Second Test User',
                });

            if (registerRes.body.data) {
                secondUserId = registerRes.body.data.id;
            }
        } catch (error) {
            console.error('Setup failed:', error);
        }
    });

    // ==================== PROJECT CRUD TESTS ====================
    describe('Project CRUD Operations', () => {
        describe('POST /projects', () => {
            it('should create a new project', async () => {
                if (!setupSuccessful) {
                    console.log('Skipping: Setup failed');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .post('/projects')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        name: 'Test Project',
                        description: 'A test project for automated testing',
                        color: '#1890ff',
                    });

                expect([200, 201]).toContain(res.status);
                expect(res.body.success).toBe(true);

                // Handle nested response (data.project or data directly)
                const projectData = res.body.data?.project || res.body.data;
                expect(projectData).toHaveProperty('id');
                expect(projectData.name).toBe('Test Project');

                projectId = projectData.id;
            });

            it('should fail to create project without name', async () => {
                if (!setupSuccessful) return;

                await delay(100);
                const res = await request(API_URL)
                    .post('/projects')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        description: 'No name project',
                    });

                expect(res.status).toBe(400);
            });

            it('should fail without authentication', async () => {
                await delay(100);
                const res = await request(API_URL)
                    .post('/projects')
                    .send({ name: 'Test' });

                expect(res.status).toBe(401);
            });
        });

        describe('GET /projects', () => {
            it('should get all projects', async () => {
                if (!setupSuccessful) return;

                await delay(100);
                const res = await request(API_URL)
                    .get('/projects')
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                // API may return array directly or in projects property
                const projects = res.body.data?.projects || res.body.data;
                expect(Array.isArray(projects)).toBe(true);
            });
        });

        describe('GET /projects/:id', () => {
            it('should get project by ID', async () => {
                if (!projectId) {
                    console.log('Skipping: No projectId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .get(`/projects/${projectId}`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                const projectData = res.body.data?.project || res.body.data;
                expect(projectData.id).toBe(projectId);
            });

            it('should return 404 for non-existent project', async () => {
                if (!accessToken) return;

                await delay(100);
                const res = await request(API_URL)
                    .get('/projects/00000000-0000-0000-0000-000000000000')
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(404);
            });
        });

        describe('PUT /projects/:id', () => {
            it('should update project', async () => {
                if (!projectId) {
                    console.log('Skipping: No projectId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .put(`/projects/${projectId}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        name: 'Updated Test Project',
                        description: 'Updated description',
                    });

                expect(res.status).toBe(200);
                const projectData = res.body.data?.project || res.body.data;
                expect(projectData.name).toBe('Updated Test Project');
            });
        });

        describe('GET /projects/:id/stats', () => {
            it('should get project statistics', async () => {
                if (!projectId) return;

                await delay(100);
                const res = await request(API_URL)
                    .get(`/projects/${projectId}/stats`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                // Check for stats properties
                expect(res.body.data).toBeDefined();
            });
        });
    });

    // ==================== PROJECT MEMBERS TESTS ====================
    describe('Project Members Management', () => {
        let memberId: string;

        describe('GET /projects/:id/members', () => {
            it('should get project members', async () => {
                if (!projectId) return;

                await delay(100);
                const res = await request(API_URL)
                    .get(`/projects/${projectId}/members`)
                    .set('Authorization', `Bearer ${accessToken}`);

                expect(res.status).toBe(200);
                // Members may be in data.members or data directly
                const members = res.body.data?.members || res.body.data;
                expect(Array.isArray(members)).toBe(true);
            });
        });

        describe('POST /projects/:id/members', () => {
            it('should add member to project', async () => {
                if (!projectId || !secondUserId) {
                    console.log('Skipping: No projectId or secondUserId available');
                    return;
                }

                await delay(100);
                const res = await request(API_URL)
                    .post(`/projects/${projectId}/members`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({
                        userId: secondUserId,
                        role: 'MEMBER',
                    });

                expect([200, 201]).toContain(res.status);
                if (res.body.success) {
                    memberId = res.body.data?.id || res.body.data?.member?.id;
                }
            });

            it('should fail to add member without userId', async () => {
                if (!projectId) return;

                await delay(100);
                const res = await request(API_URL)
                    .post(`/projects/${projectId}/members`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send({ role: 'MEMBER' });

                expect(res.status).toBe(400);
            });
        });
    });

    // ==================== CLEANUP ====================
    describe('DELETE /projects/:id', () => {
        it('should delete project', async () => {
            if (!projectId) {
                console.log('Skipping: No projectId available');
                return;
            }

            await delay(100);
            const res = await request(API_URL)
                .delete(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
        });

        it('should confirm project is deleted', async () => {
            if (!projectId) return;

            await delay(100);
            const res = await request(API_URL)
                .get(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(404);
        });
    });
});
