/**
 * Test Data Factory
 * สร้างข้อมูลทดสอบสำหรับ AI Agent
 */

// ==================== USER DATA ====================
export const testUsers = {
    admin: {
        email: 'admin@example.com',
        password: 'Admin@1234',
        name: 'Admin User',
        pin: '123456',
    },
    member: {
        email: 'member@example.com',
        password: 'Member@1234',
        name: 'Member User',
        pin: '654321',
    },
    newUser: () => ({
        email: `test-${Date.now()}@example.com`,
        password: 'Test@1234',
        name: `Test User ${Date.now()}`,
        pin: '111111',
    }),
};

// ==================== PROJECT DATA ====================
export const testProjects = {
    basic: () => ({
        name: `Test Project ${Date.now()}`,
        description: 'Automated test project',
        color: '#1890ff',
        status: 'ACTIVE',
    }),
    withDetails: () => ({
        name: `Detailed Project ${Date.now()}`,
        description: 'A project with all fields filled',
        color: '#52c41a',
        icon: '📊',
        status: 'ACTIVE',
    }),
};

// ==================== TASK DATA ====================
export const testTasks = {
    basic: () => ({
        title: `Test Task ${Date.now()}`,
        description: 'An automated test task',
        priority: 'MEDIUM',
        status: 'TODO',
    }),
    urgent: () => ({
        title: `Urgent Task ${Date.now()}`,
        description: 'This is an urgent task',
        priority: 'URGENT',
        status: 'TODO',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    }),
    inProgress: () => ({
        title: `In Progress Task ${Date.now()}`,
        description: 'This task is in progress',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        progress: 50,
    }),
    completed: () => ({
        title: `Completed Task ${Date.now()}`,
        description: 'This task is done',
        priority: 'LOW',
        status: 'DONE',
        progress: 100,
    }),
    overdue: () => ({
        title: `Overdue Task ${Date.now()}`,
        description: 'This task is overdue',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    }),
};

// ==================== DAILY UPDATE DATA ====================
export const testDailyUpdates = {
    basic: () => ({
        progress: 50,
        status: 'IN_PROGRESS',
        notes: `Update at ${new Date().toISOString()}`,
    }),
    complete: () => ({
        progress: 100,
        status: 'DONE',
        notes: 'Task completed!',
    }),
};

// ==================== COMMENT DATA ====================
export const testComments = {
    basic: () => ({
        content: `Test comment at ${Date.now()}`,
    }),
    detailed: () => ({
        content: `This is a detailed comment with more information. Created at ${new Date().toLocaleString()}`,
    }),
};

// ==================== NOTIFICATION DATA ====================
export const testNotifications = {
    taskAssigned: (userId: string) => ({
        userId,
        type: 'TASK_ASSIGNED' as const,
        title: 'New Task Assigned',
        message: 'You have been assigned to a new task',
    }),
    taskCompleted: (userId: string) => ({
        userId,
        type: 'TASK_COMPLETED' as const,
        title: 'Task Completed',
        message: 'A task you created has been completed',
    }),
    taskDueSoon: (userId: string) => ({
        userId,
        type: 'TASK_DUE_SOON' as const,
        title: 'Task Due Soon',
        message: 'You have a task due tomorrow',
    }),
};

// ==================== HELPER FUNCTIONS ====================
export function randomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
}

export function randomEmail(): string {
    return `test-${randomString()}@example.com`;
}

export function randomDate(daysFromNow: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
}

export function waitMs(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== PRIORITY ORDER ====================
export const priorityOrder = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export function comparePriority(a: string, b: string): number {
    return priorityOrder.indexOf(a) - priorityOrder.indexOf(b);
}

// ==================== STATUS TRANSITIONS ====================
export const validStatusTransitions: Record<string, string[]> = {
    'TODO': ['IN_PROGRESS', 'BLOCKED'],
    'IN_PROGRESS': ['IN_REVIEW', 'BLOCKED', 'TODO'],
    'IN_REVIEW': ['DONE', 'IN_PROGRESS'],
    'DONE': ['TODO', 'IN_PROGRESS'],
    'BLOCKED': ['TODO', 'IN_PROGRESS'],
};

export function isValidTransition(from: string, to: string): boolean {
    return validStatusTransitions[from]?.includes(to) ?? false;
}

// ==================== EXPORT ALL ====================
export default {
    testUsers,
    testProjects,
    testTasks,
    testDailyUpdates,
    testComments,
    testNotifications,
    randomString,
    randomEmail,
    randomDate,
    waitMs,
    priorityOrder,
    comparePriority,
    validStatusTransitions,
    isValidTransition,
};
