/**
 * E2E Workflow Scenario Tests
 * TaskFlow - Complete User Workflows
 *
 * Tests realistic user scenarios from start to finish
 */

import request from 'supertest';

const BASE_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

// Store test data across scenarios
const testData = {
  accessToken: '',
  userId: '',
  projectId: '',
  taskIds: [] as string[],
  commentIds: [] as string[]
};

const testUser = {
  email: 'tharab@sena.co.th',
  password: 'Sen@1775',
  pin: '112233'
};

// Helper
const auth = () => request(BASE_URL).set('Authorization', `Bearer ${testData.accessToken}`);

describe('📋 Scenario 1: Complete Project Lifecycle', () => {

  it('Step 1: User logs in', async () => {
    const res = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    testData.accessToken = res.body.data.accessToken;
    testData.userId = res.body.data.user.id;
  });

  it('Step 2: User creates a new project', async () => {
    const res = await auth()
      .post('/projects')
      .send({
        name: 'Workflow Test Project',
        description: 'Testing complete project lifecycle',
        color: '#3498db'
      });

    expect(res.status).toBe(201);
    testData.projectId = res.body.data.id;
  });

  it('Step 3: User creates multiple tasks', async () => {
    const tasks = [
      { title: 'Design UI mockups', priority: 'HIGH', status: 'TODO' },
      { title: 'Implement backend API', priority: 'HIGH', status: 'TODO' },
      { title: 'Write unit tests', priority: 'MEDIUM', status: 'TODO' },
      { title: 'Deploy to staging', priority: 'LOW', status: 'TODO' }
    ];

    for (const task of tasks) {
      const res = await auth()
        .post(`/projects/${testData.projectId}/tasks`)
        .send(task);

      expect(res.status).toBe(201);
      testData.taskIds.push(res.body.data.id);
    }

    expect(testData.taskIds.length).toBe(4);
  });

  it('Step 4: User starts working on first task', async () => {
    const res = await auth()
      .patch(`/tasks/${testData.taskIds[0]}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('IN_PROGRESS');
  });

  it('Step 5: User adds daily update', async () => {
    const res = await auth()
      .post(`/tasks/${testData.taskIds[0]}/updates`)
      .send({
        progress: 30,
        status: 'IN_PROGRESS',
        notes: 'Started wireframing'
      });

    expect(res.status).toBe(201);
  });

  it('Step 6: User adds comment to task', async () => {
    const res = await auth()
      .post(`/tasks/${testData.taskIds[0]}/comments`)
      .send({
        content: 'Need to discuss color scheme with team'
      });

    expect(res.status).toBe(201);
    testData.commentIds.push(res.body.data.id);
  });

  it('Step 7: User completes first task', async () => {
    // Add final update
    await auth()
      .post(`/tasks/${testData.taskIds[0]}/updates`)
      .send({
        progress: 100,
        status: 'DONE',
        notes: 'All mockups approved'
      });

    // Update status
    const res = await auth()
      .patch(`/tasks/${testData.taskIds[0]}/status`)
      .send({ status: 'DONE' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('DONE');
  });

  it('Step 8: User checks project statistics', async () => {
    const res = await auth().get(`/projects/${testData.projectId}/stats`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Step 9: User checks their task list', async () => {
    const res = await auth().get('/my-tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('Step 10: Cleanup - Delete project', async () => {
    const res = await auth().delete(`/projects/${testData.projectId}`);

    expect(res.status).toBe(200);
  });
});

describe('📋 Scenario 2: Daily Task Management', () => {

  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    // Login
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    testData.accessToken = loginRes.body.data.accessToken;
  });

  it('Morning: Review pending tasks', async () => {
    const res = await auth().get('/my-tasks?status=TODO');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Morning: Create urgent task', async () => {
    // First create a project
    const projectRes = await auth()
      .post('/projects')
      .send({ name: 'Daily Management Test' });
    projectId = projectRes.body.data.id;

    const res = await auth()
      .post(`/projects/${projectId}/tasks`)
      .send({
        title: 'Urgent: Fix production bug',
        priority: 'URGENT',
        status: 'TODO',
        dueDate: new Date().toISOString()
      });

    expect(res.status).toBe(201);
    taskId = res.body.data.id;
  });

  it('Mid-day: Start working on urgent task', async () => {
    const res = await auth()
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
  });

  it('Mid-day: Add progress update', async () => {
    const res = await auth()
      .post(`/tasks/${taskId}/updates`)
      .send({
        progress: 50,
        status: 'IN_PROGRESS',
        notes: 'Identified root cause, working on fix'
      });

    expect(res.status).toBe(201);
  });

  it('Evening: Complete task', async () => {
    // Final update
    await auth()
      .post(`/tasks/${taskId}/updates`)
      .send({
        progress: 100,
        status: 'DONE',
        notes: 'Bug fixed and deployed'
      });

    // Complete
    const res = await auth()
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'DONE' });

    expect(res.status).toBe(200);
  });

  it('Evening: Check completed tasks', async () => {
    const res = await auth().get('/my-tasks?status=DONE');

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // Cleanup
    await auth().delete(`/projects/${projectId}`);
  });
});

describe('📋 Scenario 3: Team Collaboration', () => {

  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    testData.accessToken = loginRes.body.data.accessToken;
  });

  it('Create shared project', async () => {
    const res = await auth()
      .post('/projects')
      .send({
        name: 'Team Collaboration Test',
        description: 'Testing team features'
      });

    expect(res.status).toBe(201);
    projectId = res.body.data.id;
  });

  it('Create task for team review', async () => {
    const res = await auth()
      .post(`/projects/${projectId}/tasks`)
      .send({
        title: 'Code Review: New Feature',
        status: 'IN_REVIEW'
      });

    expect(res.status).toBe(201);
    taskId = res.body.data.id;
  });

  it('Add review comments', async () => {
    const comments = [
      'Looks good overall',
      'Please add more unit tests',
      'Consider edge cases for null input'
    ];

    for (const content of comments) {
      const res = await auth()
        .post(`/tasks/${taskId}/comments`)
        .send({ content });

      expect(res.status).toBe(201);
    }
  });

  it('View all task comments', async () => {
    const res = await auth().get(`/tasks/${taskId}/comments`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it('Request changes - set to blocked', async () => {
    const res = await auth()
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'BLOCKED' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('BLOCKED');
  });

  it('Address feedback - back to in progress', async () => {
    const res = await auth()
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
  });

  it('Complete review and approve', async () => {
    const res = await auth()
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'DONE' });

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await auth().delete(`/projects/${projectId}`);
  });
});

describe('📋 Scenario 4: PIN Authentication Flow', () => {

  it('Login with password', async () => {
    const res = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    testData.accessToken = res.body.data.accessToken;
  });

  it('Quick re-login with PIN', async () => {
    const res = await request(BASE_URL)
      .post('/auth/login-pin')
      .send({ email: testUser.email, pin: testUser.pin });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('Access protected resource with new token', async () => {
    const res = await auth().get('/auth/me');

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });
});

describe('📋 Scenario 5: Notification Management', () => {

  beforeAll(async () => {
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    testData.accessToken = loginRes.body.data.accessToken;
  });

  it('Check notification count', async () => {
    const res = await auth().get('/notifications/unread/count');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('count');
  });

  it('View all notifications', async () => {
    const res = await auth().get('/notifications');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('Mark all as read', async () => {
    const res = await auth().put('/notifications/read-all');

    expect(res.status).toBe(200);
  });

  it('Verify count is zero', async () => {
    const res = await auth().get('/notifications/unread/count');

    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(0);
  });
});

describe('📋 Scenario 6: Error Handling', () => {

  it('Handle 401 - Unauthorized access', async () => {
    const res = await request(BASE_URL).get('/projects');

    expect(res.status).toBe(401);
  });

  it('Handle 404 - Resource not found', async () => {
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const res = await request(BASE_URL)
      .get('/projects/non-existent-id')
      .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`);

    expect(res.status).toBe(404);
  });

  it('Handle 400 - Bad request', async () => {
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const res = await request(BASE_URL)
      .post('/projects')
      .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
      .send({}); // Missing required name

    expect(res.status).toBe(400);
  });
});
