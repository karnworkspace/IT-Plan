/**
 * Comprehensive API Test Suite
 * TaskFlow - Full Function Testing
 * Updated to match actual API response structure
 */

import request from 'supertest';

const BASE_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

// Test data storage
let accessToken: string = '';
let refreshToken: string = '';
let userId: string = '';
let testProjectId: string = '';
let testTaskId: string = '';
let testCommentId: string = '';
let testUpdateId: string = '';

// Test user credentials
const testUser = {
  email: 'tharab@sena.co.th',
  password: 'Sen@1775',
  pin: '112233'
};

describe('🔐 Authentication API Tests', () => {

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(BASE_URL)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
      userId = res.body.data.user.id;
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(BASE_URL)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong' });

      expect(res.status).toBe(401);
    });

    it('should fail with missing credentials', async () => {
      const res = await request(BASE_URL)
        .post('/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user info', async () => {
      const res = await request(BASE_URL)
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', testUser.email);
    });

    it('should fail without authentication', async () => {
      const res = await request(BASE_URL).get('/auth/me');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh access token', async () => {
      const res = await request(BASE_URL)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      if (res.body.data?.accessToken) {
        accessToken = res.body.data.accessToken;
      }
    });
  });
});

describe('📁 Project API Tests', () => {

  describe('GET /projects', () => {
    it('should get all projects with pagination', async () => {
      const res = await request(BASE_URL)
        .get('/projects')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('projects');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.projects)).toBe(true);
    });

    it('should support pagination params', async () => {
      const res = await request(BASE_URL)
        .get('/projects?page=1&limit=5')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.pagination).toBeDefined();
    });
  });

  describe('POST /projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: `Test Project ${Date.now()}`,
        description: 'Created by automated test',
        color: '#FF5733'
      };

      const res = await request(BASE_URL)
        .post('/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(projectData);

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('project');
      expect(res.body.data.project).toHaveProperty('id');

      testProjectId = res.body.data.project.id;
    });

    it('should fail without name', async () => {
      const res = await request(BASE_URL)
        .post('/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'No name' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get project by ID', async () => {
      const res = await request(BASE_URL)
        .get(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('project');
      expect(res.body.data.project.id).toBe(testProjectId);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(BASE_URL)
        .get('/projects/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /projects/:id', () => {
    it('should update project', async () => {
      const res = await request(BASE_URL)
        .put(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: `Updated Project ${Date.now()}` });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /projects/:id/stats', () => {
    it('should get project statistics', async () => {
      const res = await request(BASE_URL)
        .get(`/projects/${testProjectId}/stats`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /projects/:id/members', () => {
    it('should get project members', async () => {
      const res = await request(BASE_URL)
        .get(`/projects/${testProjectId}/members`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('📋 Task API Tests', () => {

  describe('POST /projects/:projectId/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: `Test Task ${Date.now()}`,
        description: 'Created by automated test',
        priority: 'HIGH',
        status: 'TODO'
      };

      const res = await request(BASE_URL)
        .post(`/projects/${testProjectId}/tasks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(taskData);

      // API returns 200 for create (with message "201")
      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('task');
      expect(res.body.data.task).toHaveProperty('id');

      testTaskId = res.body.data.task.id;
      console.log('Created task ID:', testTaskId);
    });

    it('should fail without title', async () => {
      const res = await request(BASE_URL)
        .post(`/projects/${testProjectId}/tasks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'No title' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /projects/:projectId/tasks', () => {
    it('should get all tasks in project', async () => {
      const res = await request(BASE_URL)
        .get(`/projects/${testProjectId}/tasks`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tasks');
      expect(Array.isArray(res.body.data.tasks)).toBe(true);
    });
  });

  describe('GET /my-tasks', () => {
    it('should get current user tasks', async () => {
      const res = await request(BASE_URL)
        .get('/my-tasks')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tasks');
      expect(Array.isArray(res.body.data.tasks)).toBe(true);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should get task by ID', async () => {
      const res = await request(BASE_URL)
        .get(`/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('task');
      expect(res.body.data.task.id).toBe(testTaskId);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task', async () => {
      const res = await request(BASE_URL)
        .put(`/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: `Updated Task ${Date.now()}` });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('should update task status to IN_PROGRESS', async () => {
      const res = await request(BASE_URL)
        .patch(`/tasks/${testTaskId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'IN_PROGRESS', progress: 30 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.status).toBe('IN_PROGRESS');
    });

    it('should update task status to DONE', async () => {
      const res = await request(BASE_URL)
        .patch(`/tasks/${testTaskId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'DONE', progress: 100 });

      expect(res.status).toBe(200);
      expect(res.body.data.task.status).toBe('DONE');
    });
  });

  describe('GET /projects/:projectId/tasks/stats', () => {
    it('should get task statistics', async () => {
      const res = await request(BASE_URL)
        .get(`/projects/${testProjectId}/tasks/stats`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('💬 Comment API Tests', () => {

  describe('POST /tasks/:taskId/comments', () => {
    it('should create a comment', async () => {
      const res = await request(BASE_URL)
        .post(`/tasks/${testTaskId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: `Test comment ${Date.now()}` });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('comment');
      expect(res.body.data.comment).toHaveProperty('id');

      testCommentId = res.body.data.comment.id;
    });
  });

  describe('GET /tasks/:taskId/comments', () => {
    it('should get task comments', async () => {
      const res = await request(BASE_URL)
        .get(`/tasks/${testTaskId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('comments');
      expect(Array.isArray(res.body.data.comments)).toBe(true);
    });
  });

  describe('GET /comments/:id', () => {
    it('should get comment by ID', async () => {
      const res = await request(BASE_URL)
        .get(`/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('comment');
    });
  });

  describe('PUT /comments/:id', () => {
    it('should update comment', async () => {
      const res = await request(BASE_URL)
        .put(`/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: `Updated comment ${Date.now()}` });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /user/comments', () => {
    it('should get user comments', async () => {
      const res = await request(BASE_URL)
        .get('/user/comments')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('📊 Daily Update API Tests', () => {

  describe('POST /tasks/:taskId/updates', () => {
    it('should create a daily update', async () => {
      const res = await request(BASE_URL)
        .post(`/tasks/${testTaskId}/updates`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          progress: 50,
          status: 'IN_PROGRESS',
          notes: 'Working on implementation'
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('update');
      expect(res.body.data.update).toHaveProperty('id');

      testUpdateId = res.body.data.update.id;
    });
  });

  describe('GET /tasks/:taskId/updates', () => {
    it('should get task updates', async () => {
      const res = await request(BASE_URL)
        .get(`/tasks/${testTaskId}/updates`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('updates');
      expect(Array.isArray(res.body.data.updates)).toBe(true);
    });
  });

  describe('GET /updates/:id', () => {
    it('should get update by ID', async () => {
      const res = await request(BASE_URL)
        .get(`/updates/${testUpdateId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('update');
    });
  });

  describe('PUT /updates/:id', () => {
    it('should update daily update', async () => {
      const res = await request(BASE_URL)
        .put(`/updates/${testUpdateId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ progress: 75, notes: 'Almost done' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('🔔 Notification API Tests', () => {

  describe('GET /notifications', () => {
    it('should get user notifications', async () => {
      const res = await request(BASE_URL)
        .get('/notifications')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('notifications');
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });
  });

  describe('GET /notifications/unread/count', () => {
    it('should get unread count', async () => {
      const res = await request(BASE_URL)
        .get('/notifications/unread/count')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('count');
    });
  });

  describe('PUT /notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      const res = await request(BASE_URL)
        .put('/notifications/read-all')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('🏁 Health Check', () => {

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(BASE_URL).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('TaskFlow API is running');
    });
  });
});

describe('🧹 Cleanup Tests', () => {

  describe('DELETE /comments/:id', () => {
    it('should delete comment', async () => {
      if (!testCommentId) return;
      const res = await request(BASE_URL)
        .delete(`/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /updates/:id', () => {
    it('should delete daily update', async () => {
      if (!testUpdateId) return;
      const res = await request(BASE_URL)
        .delete(`/updates/${testUpdateId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task', async () => {
      if (!testTaskId) return;
      const res = await request(BASE_URL)
        .delete(`/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete project', async () => {
      if (!testProjectId) return;
      const res = await request(BASE_URL)
        .delete(`/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
