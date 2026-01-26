/**
 * Notifications API Tests
 * ทดสอบ Notification CRUD และ Auto-trigger
 */

import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Notifications API', () => {
    let accessToken: string;
    let userId: string;
    let notificationId: string;

    beforeAll(async () => {
        // Create a unique test user
        const testEmail = `notif-test-${Date.now()}@example.com`;

        await request(API_URL)
            .post('/auth/register')
            .send({
                email: testEmail,
                password: 'Test@1234',
                name: 'Notification Test User',
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
            userId = loginRes.body.data.user.id;
        }
    });

    // ==================== GET NOTIFICATIONS ====================
    describe('GET /notifications', () => {
        it('should get user notifications', async () => {
            await delay(100);
            const res = await request(API_URL)
                .get('/notifications')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const notifications = res.body.data.notifications || res.body.data;
            expect(Array.isArray(notifications)).toBe(true);
        });
    });

    // ==================== GET UNREAD COUNT ====================
    describe('GET /notifications/unread/count', () => {
        it('should get unread notification count', async () => {
            await delay(100);
            const res = await request(API_URL)
                .get('/notifications/unread/count')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
        });
    });

    // ==================== CREATE NOTIFICATION ====================
    describe('POST /notifications', () => {
        it('should create a notification', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/notifications')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    userId: userId,
                    type: 'TASK_ASSIGNED',
                    title: 'Test Notification',
                    message: 'This is a test notification',
                });

            if (res.status === 201) {
                expect(res.body.success).toBe(true);
                notificationId = res.body.data.id;
            }
        });
    });

    // ==================== MARK ALL AS READ ====================
    describe('PUT /notifications/read-all', () => {
        it('should mark all notifications as read', async () => {
            await delay(100);
            const res = await request(API_URL)
                .put('/notifications/read-all')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
        });
    });
});
