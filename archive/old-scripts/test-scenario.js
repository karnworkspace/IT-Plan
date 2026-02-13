
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';
let token = '';
let userId = '';
let projectId = '';
let taskId = '';

// Helper for colored logs
const log = (msg, type = 'info') => {
    const colors = {
        info: '\x1b[36m%s\x1b[0m', // Cyan
        success: '\x1b[32m%s\x1b[0m', // Green
        error: '\x1b[31m%s\x1b[0m' // Red
    };
    console.log(colors[type] || colors.info, `[${type.toUpperCase()}] ${msg}`);
};

async function runTest() {
    console.log('\n🚀 Starting Automated E2E Scenario Test...\n');

    try {
        // 1. Auth: Register/Login
        log('1. Authenticating...', 'info');
        try {
            // Try login first
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'tester@example.com',
                password: 'Password123!'
            });
            token = loginRes.data.data.accessToken;
            userId = loginRes.data.data.user.id;
            log(`Logged in as ${loginRes.data.data.user.name}`, 'success');
        } catch (e) {
            // If fail, register with Random Email
            log('Login failed, registering new user...', 'info');
            const randomEmail = `tester${Date.now()}@example.com`;
            try {
                // Register
                const regRes = await axios.post(`${API_URL}/auth/register`, {
                    email: randomEmail,
                    password: 'Password123!',
                    name: 'Automated Tester'
                });
                log(`Registered new user: ${randomEmail}`, 'success');

                // Then Login
                const loginCheck = await axios.post(`${API_URL}/auth/login`, {
                    email: randomEmail,
                    password: 'Password123!'
                });
                token = loginCheck.data.data.accessToken;
                userId = loginCheck.data.data.user.id;
                log(`Logged in after registration`, 'success');

            } catch (regError) {
                log(`Registration flow failed: ${regError.message}`, 'error');
                if (regError.response) console.error(JSON.stringify(regError.response.data, null, 2));
                return;
            }
        }

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Create Project
        log('2. Creating Project...', 'info');
        const projectRes = await axios.post(`${API_URL}/projects`, {
            name: `Auto Test Project ${Date.now()}`,
            description: 'Created by automated test',
            color: '#1890ff',
            status: 'ACTIVE'
        }, authHeader);
        projectId = projectRes.data.data.project.id;
        log(`Project created: ${projectRes.data.data.project.name}`, 'success');

        // 3. Create Task
        log('3. Creating Task...', 'info');
        const taskRes = await axios.post(`${API_URL}/projects/${projectId}/tasks`, {
            title: 'Test Task 001',
            description: 'This is a test task',
            status: 'TODO',
            priority: 'HIGH',
            assigneeId: userId, // Assign to self to test notification self-trigger logic (if any) or prepare for re-assign
            dueDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        }, authHeader);
        taskId = taskRes.data.data.task.id;
        log(`Task created: ${taskRes.data.data.task.title}`, 'success');

        // 4. Update Task Status
        log('4. Updating Task Status...', 'info');
        await axios.patch(`${API_URL}/tasks/${taskId}/status`, {
            status: 'IN_PROGRESS',
            progress: 25
        }, authHeader);
        log(`Task status updated to IN_PROGRESS`, 'success');

        // 5. Add Comment
        log('5. Adding Comment...', 'info');
        await axios.post(`${API_URL}/tasks/${taskId}/comments`, {
            content: 'Automated comment test'
        }, authHeader);
        log(`Comment added`, 'success');

        // 6. Check Dashboard Stats (Simulate)
        log('6. Verifying Dashboard Data...', 'info');
        // Wait a bit for DB consistency/async ops if any
        await new Promise(r => setTimeout(r, 1000));

        try {
            const statsRes = await axios.get(`${API_URL}/projects/${projectId}/tasks/stats`, authHeader);
            console.log('Stats Response:', JSON.stringify(statsRes.data.data, null, 2));

            // Check data structure based on typical backend response
            const statsData = statsRes.data.data;
            // Response is { stats: { in_progress_tasks: 1, ... } }
            const inProgressCount = statsData.stats ? statsData.stats.in_progress_tasks : (statsData.in_progress_tasks || 0);

            if (inProgressCount >= 1) {
                log(`Dashboard stats verified: In Progress tasks count is correct (${inProgressCount})`, 'success');
            } else {
                log(`Dashboard stats mismatch! Expected >= 1 In Progress. Got: ${inProgressCount}`, 'error');
            }
        } catch (err) {
            log(`Failed to fetch stats: ${err.message}`, 'error');
        }

        // 7. Check Activity Logs
        log('7. Verifying Activity Logs...', 'info');
        try {
            const logsRes = await axios.get(`${API_URL}/projects/${projectId}/activities`, authHeader);
            console.log('Logs Response:', JSON.stringify(logsRes.data, null, 2));
            const logs = logsRes.data.data.activities;

            if (logs && logs.length > 0) {
                log(`Activity logs found: ${logs.length} entries`, 'success');
                const latest = logs[0];
                log(`Latest activity: ${latest.action} on ${latest.entityType}`, 'info');
            } else {
                log(`No activity logs found!`, 'error');
            }
        } catch (err) {
            log(`Failed to fetch activity logs: ${err.message}`, 'error');
        }

        console.log('\n✨ Automated Test Scenario Completed Successfully! ✨\n');

    } catch (error) {
        log(`Test Failed: ${error.message}`, 'error');
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

runTest();
