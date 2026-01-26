/**
 * Authentication API Tests
 * ทดสอบ Authentication Flow ทั้งหมด
 */

import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Authentication API', () => {
    let accessToken: string;
    let refreshToken: string;
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Test@1234',
        name: 'Test User',
    };

    // ==================== REGISTER TESTS ====================
    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(API_URL)
                .post('/auth/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            // API returns data directly, not data.user
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.email).toBe(testUser.email);
        });

        it('should fail to register with existing email', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/register')
                .send(testUser);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail to register with invalid email', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'Test@1234',
                    name: 'Test',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('email');
        });

        it('should fail to register without required fields', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/register')
                .send({});

            expect(res.status).toBe(400);
        });
    });

    // ==================== LOGIN TESTS ====================
    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
            expect(res.body.data).toHaveProperty('user');

            accessToken = res.body.data.accessToken;
            refreshToken = res.body.data.refreshToken;
        });

        it('should fail with invalid password', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail with non-existent email', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Test@1234',
                });

            expect(res.status).toBe(401);
        });
    });

    // ==================== SETUP PIN TESTS ====================
    describe('POST /auth/setup-pin', () => {
        it('should setup PIN successfully', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/setup-pin')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    pin: '142536',
                    confirmPin: '142536',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should fail with mismatched PIN', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/setup-pin')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    pin: '142536',
                    confirmPin: '635241',
                });

            expect(res.status).toBe(400);
        });

        it('should fail without authentication', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/setup-pin')
                .send({
                    pin: '142536',
                    confirmPin: '142536',
                });

            expect(res.status).toBe(401);
        });
    });

    // ==================== LOGIN WITH PIN TESTS ====================
    describe('POST /auth/login-pin', () => {
        it('should login with PIN successfully', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/login-pin')
                .send({
                    email: testUser.email,
                    pin: '142536',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
        });

        it('should fail with wrong PIN', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/login-pin')
                .send({
                    email: testUser.email,
                    pin: 'wrongpin',
                });

            expect(res.status).toBe(401);
        });
    });

    // ==================== GET CURRENT USER TESTS ====================
    describe('GET /auth/me', () => {
        it('should get current user with valid token', async () => {
            await delay(100);
            const res = await request(API_URL)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(testUser.email);
        });

        it('should fail without token', async () => {
            await delay(100);
            const res = await request(API_URL).get('/auth/me');

            expect(res.status).toBe(401);
        });

        it('should fail with invalid token', async () => {
            await delay(100);
            const res = await request(API_URL)
                .get('/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.status).toBe(401);
        });
    });

    // ==================== REFRESH TOKEN TESTS ====================
    describe('POST /auth/refresh', () => {
        it('should refresh access token', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/refresh')
                .send({ refreshToken });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('accessToken');
        });

        it('should fail with invalid refresh token', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/refresh')
                .send({ refreshToken: 'invalid-token' });

            expect(res.status).toBe(401);
        });
    });

    // ==================== LOGOUT TESTS ====================
    describe('POST /auth/logout', () => {
        it('should logout successfully', async () => {
            await delay(100);
            const res = await request(API_URL)
                .post('/auth/logout')
                .send({ refreshToken });

            expect(res.status).toBe(200);
        });
    });
});
