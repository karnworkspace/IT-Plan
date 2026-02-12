/**
 * Task Management Enhancement Tests - Phase 2
 * TaskFlow - Task CRUD, Status, Dates, Assignee Testing
 */

import request from 'supertest';

const BASE_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

// Test data storage
let authToken: string = '';
let testProjectId: string = '';
let testTaskId: string = '';
let testUserId: string = '';
let projectMemberIds: string[] = [];

// Test user - use existing admin user
const testUser = {
    email: 'monchiant@sena.co.th',
    password: 'Sen@1775',
};

// Helper to get auth token
const getAuthToken = async () => {
    if (authToken) return authToken;
    const res = await request(BASE_URL)
        .post('/auth/login')
        .send(testUser);
    authToken = res.body.data?.accessToken || '';
    testUserId = res.body.data?.user?.id || '';
    return authToken;
};

// Helper for authenticated requests
const authGet = async (url: string) => {
    const token = await getAuthToken();
    return request(BASE_URL).get(url).set('Authorization', `Bearer ${token}`);
};

const authPost = async (url: string, body: any) => {
    const token = await getAuthToken();
    return request(BASE_URL).post(url).set('Authorization', `Bearer ${token}`).send(body);
};

const authPut = async (url: string, body: any) => {
    const token = await getAuthToken();
    return request(BASE_URL).put(url).set('Authorization', `Bearer ${token}`).send(body);
};

const authPatch = async (url: string, body: any) => {
    const token = await getAuthToken();
    return request(BASE_URL).patch(url).set('Authorization', `Bearer ${token}`).send(body);
};

const authDelete = async (url: string) => {
    const token = await getAuthToken();
    return request(BASE_URL).delete(url).set('Authorization', `Bearer ${token}`);
};

describe('Phase 2: Task Management Enhancements', () => {

    // Setup: Login and get a project to work with
    beforeAll(async () => {
        await getAuthToken();

        // Get first available project
        const projectsRes = await authGet('/projects');
        const projects = projectsRes.body.data?.projects || [];
        if (projects.length > 0) {
            testProjectId = projects[0].id;

            // Get project details for members
            const projectDetail = await authGet(`/projects/${testProjectId}`);
            const members = projectDetail.body.data?.project?.members || [];
            projectMemberIds = members.map((m: any) => m.user?.id).filter(Boolean);
        }
    }, 30000);

    // ============================================
    // 2.1 Start Date & Finish Date Tests
    // ============================================
    describe('2.1 Start Date & Finish Date', () => {

        it('should create task with startDate and dueDate (finish date)', async () => {
            const startDate = new Date('2026-03-01').toISOString();
            const dueDate = new Date('2026-03-15').toISOString();

            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Task with dates',
                description: 'Testing start and finish dates',
                priority: 'MEDIUM',
                startDate,
                dueDate,
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.task).toBeDefined();
            expect(res.body.data.task.startDate).toBeTruthy();
            expect(res.body.data.task.dueDate).toBeTruthy();

            testTaskId = res.body.data.task.id;
        });

        it('should create task with only startDate', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Task with start only',
                startDate: new Date('2026-03-01').toISOString(),
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.startDate).toBeTruthy();
            expect(res.body.data.task.dueDate).toBeNull();
        });

        it('should create task with only dueDate (finish date)', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Task with finish only',
                dueDate: new Date('2026-04-01').toISOString(),
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.dueDate).toBeTruthy();
        });

        it('should reject task where startDate is after dueDate', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Invalid dates',
                startDate: new Date('2026-04-15').toISOString(),
                dueDate: new Date('2026-03-01').toISOString(),
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should update task dates', async () => {
            if (!testTaskId) return;

            const newStart = new Date('2026-03-05').toISOString();
            const newDue = new Date('2026-03-20').toISOString();

            const res = await authPut(`/tasks/${testTaskId}`, {
                startDate: newStart,
                dueDate: newDue,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.startDate).toBeTruthy();
            expect(res.body.data.task.dueDate).toBeTruthy();
        });

        it('should reject invalid date format', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Bad date',
                startDate: 'not-a-date',
            });

            expect(res.status).toBe(400);
        });

        it('should reject invalid dueDate format', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Bad due date',
                dueDate: 'invalid',
            });

            expect(res.status).toBe(400);
        });
    });

    // ============================================
    // 2.2 Update Assignee & Due Date Tests
    // ============================================
    describe('2.2 Update Assignee & Due Date', () => {

        it('should create task with assigneeId', async () => {
            const assigneeId = projectMemberIds.length > 0 ? projectMemberIds[0] : testUserId;

            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Assigned task',
                assigneeId,
                dueDate: new Date('2026-04-01').toISOString(),
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.assigneeId).toBe(assigneeId);
        });

        it('should update task assignee', async () => {
            if (!testTaskId) return;

            const newAssignee = projectMemberIds.length > 1 ? projectMemberIds[1] : testUserId;

            const res = await authPut(`/tasks/${testTaskId}`, {
                assigneeId: newAssignee,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.assigneeId).toBe(newAssignee);
        });

        it('should update task dueDate', async () => {
            if (!testTaskId) return;

            const newDueDate = new Date('2026-05-01').toISOString();

            const res = await authPut(`/tasks/${testTaskId}`, {
                dueDate: newDueDate,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.dueDate).toBeTruthy();
        });

        it('should reject update with invalid assigneeId', async () => {
            if (!testTaskId) return;

            const res = await authPut(`/tasks/${testTaskId}`, {
                assigneeId: 'non-existent-user-id',
            });

            expect(res.status).toBe(404);
        });

        it('should update both assignee and dueDate simultaneously', async () => {
            if (!testTaskId) return;

            const assigneeId = testUserId;
            const dueDate = new Date('2026-06-01').toISOString();

            const res = await authPut(`/tasks/${testTaskId}`, {
                assigneeId,
                dueDate,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.assigneeId).toBe(assigneeId);
            expect(res.body.data.task.dueDate).toBeTruthy();
        });
    });

    // ============================================
    // 2.3 Task Status Options Tests
    // ============================================
    describe('2.3 Task Status Options (HOLD, CANCELLED)', () => {

        it('should create task with status TODO (default)', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Default status task',
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.status).toBe('TODO');
        });

        it('should create task with custom status IN_PROGRESS', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] In progress task',
                status: 'IN_PROGRESS',
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.status).toBe('IN_PROGRESS');
        });

        it('should create task with status HOLD', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Hold task',
                status: 'HOLD',
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.status).toBe('HOLD');
        });

        it('should create task with status CANCELLED', async () => {
            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Cancelled task',
                status: 'CANCELLED',
            });

            expect(res.status).toBe(201);
            expect(res.body.data.task.status).toBe('CANCELLED');
        });

        it('should update task status to HOLD', async () => {
            if (!testTaskId) return;

            const res = await authPut(`/tasks/${testTaskId}`, {
                status: 'HOLD',
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.status).toBe('HOLD');
        });

        it('should update task status to CANCELLED', async () => {
            if (!testTaskId) return;

            const res = await authPut(`/tasks/${testTaskId}`, {
                status: 'CANCELLED',
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.status).toBe('CANCELLED');
        });

        it('should update task status to DONE via status endpoint', async () => {
            if (!testTaskId) return;

            const res = await authPatch(`/tasks/${testTaskId}/status`, {
                status: 'DONE',
                progress: 100,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.status).toBe('DONE');
        });

        it('should update task status to HOLD via status endpoint', async () => {
            if (!testTaskId) return;

            const res = await authPatch(`/tasks/${testTaskId}/status`, {
                status: 'HOLD',
                progress: 50,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.status).toBe('HOLD');
        });

        it('should update task status to CANCELLED via status endpoint', async () => {
            if (!testTaskId) return;

            const res = await authPatch(`/tasks/${testTaskId}/status`, {
                status: 'CANCELLED',
                progress: 0,
            });

            expect(res.status).toBe(200);
            expect(res.body.data.task.status).toBe('CANCELLED');
        });

        it('should reject invalid status value', async () => {
            if (!testTaskId) return;

            const res = await authPut(`/tasks/${testTaskId}`, {
                status: 'INVALID_STATUS',
            });

            expect(res.status).toBe(400);
        });

        it('should reject invalid status via status endpoint', async () => {
            if (!testTaskId) return;

            const res = await authPatch(`/tasks/${testTaskId}/status`, {
                status: 'NOT_A_STATUS',
                progress: 50,
            });

            expect(res.status).toBe(400);
        });

        it('should get task stats including hold and cancelled counts', async () => {
            const res = await authGet(`/projects/${testProjectId}/tasks/stats`);

            expect(res.status).toBe(200);
            expect(res.body.data.stats).toBeDefined();
            expect(res.body.data.stats).toHaveProperty('total_tasks');
            expect(res.body.data.stats).toHaveProperty('hold_tasks');
            expect(res.body.data.stats).toHaveProperty('cancelled_tasks');
            expect(res.body.data.stats).toHaveProperty('completion_rate');
        });
    });

    // ============================================
    // Combined / Integration Tests
    // ============================================
    describe('Integration: Full Task Lifecycle', () => {

        let lifecycleTaskId: string = '';

        it('should create a fully specified task', async () => {
            const assigneeId = projectMemberIds.length > 0 ? projectMemberIds[0] : testUserId;

            const res = await authPost(`/projects/${testProjectId}/tasks`, {
                title: '[Test] Full lifecycle task',
                description: 'A task to test the full lifecycle',
                priority: 'HIGH',
                status: 'TODO',
                assigneeId,
                startDate: new Date('2026-03-01').toISOString(),
                dueDate: new Date('2026-03-31').toISOString(),
            });

            expect(res.status).toBe(201);
            lifecycleTaskId = res.body.data.task.id;

            const task = res.body.data.task;
            expect(task.title).toBe('[Test] Full lifecycle task');
            expect(task.priority).toBe('HIGH');
            expect(task.status).toBe('TODO');
            expect(task.assigneeId).toBe(assigneeId);
            expect(task.startDate).toBeTruthy();
            expect(task.dueDate).toBeTruthy();
        });

        it('should move task through status lifecycle: TODO → IN_PROGRESS → HOLD → IN_PROGRESS → DONE', async () => {
            if (!lifecycleTaskId) return;

            // TODO → IN_PROGRESS
            let res = await authPatch(`/tasks/${lifecycleTaskId}/status`, {
                status: 'IN_PROGRESS',
                progress: 30,
            });
            expect(res.body.data.task.status).toBe('IN_PROGRESS');

            // IN_PROGRESS → HOLD
            res = await authPatch(`/tasks/${lifecycleTaskId}/status`, {
                status: 'HOLD',
                progress: 30,
            });
            expect(res.body.data.task.status).toBe('HOLD');

            // HOLD → IN_PROGRESS
            res = await authPatch(`/tasks/${lifecycleTaskId}/status`, {
                status: 'IN_PROGRESS',
                progress: 60,
            });
            expect(res.body.data.task.status).toBe('IN_PROGRESS');

            // IN_PROGRESS → DONE
            res = await authPatch(`/tasks/${lifecycleTaskId}/status`, {
                status: 'DONE',
                progress: 100,
            });
            expect(res.body.data.task.status).toBe('DONE');
        });

        it('should update assignee and dates mid-lifecycle', async () => {
            if (!lifecycleTaskId) return;

            const res = await authPut(`/tasks/${lifecycleTaskId}`, {
                assigneeId: testUserId,
                startDate: new Date('2026-03-05').toISOString(),
                dueDate: new Date('2026-04-05').toISOString(),
            });

            expect(res.status).toBe(200);
        });

        // Cleanup
        afterAll(async () => {
            if (lifecycleTaskId) {
                await authDelete(`/tasks/${lifecycleTaskId}`);
            }
        });
    });

    // ============================================
    // Cleanup: Delete test tasks
    // ============================================
    describe('Cleanup', () => {
        it('should clean up test tasks', async () => {
            // Get all tasks and delete test ones
            const res = await authGet(`/projects/${testProjectId}/tasks?pageSize=200`);
            const tasks = res.body.data?.tasks || [];
            const testTasks = tasks.filter((t: any) => t.title?.startsWith('[Test]'));

            for (const task of testTasks) {
                await authDelete(`/tasks/${task.id}`);
            }

            console.log(`Cleaned up ${testTasks.length} test tasks`);
            expect(true).toBe(true);
        });
    });
});

describe('Test Summary', () => {
    it('should log Phase 2 test summary', () => {
        console.log('\n=== Phase 2: Task Management Enhancement Tests ===');
        console.log('2.1 Start/Finish Dates: Create, Update, Validate');
        console.log('2.2 Assignee & DueDate: Assign, Reassign, Combined Update');
        console.log('2.3 Status Options: HOLD, CANCELLED + lifecycle transitions');
        console.log('Integration: Full task lifecycle test');
        console.log('===================================================\n');
        expect(true).toBe(true);
    });
});
