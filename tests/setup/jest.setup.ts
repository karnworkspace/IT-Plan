/**
 * Jest Setup File
 * Configuration และ global setup สำหรับ API tests
 */

// Increase timeout for all tests
jest.setTimeout(30000);

// Global test configuration
beforeAll(async () => {
    console.log('🚀 Starting API Tests...');
    console.log(`📡 API URL: ${process.env.API_URL || 'http://localhost:3001/api'}`);
});

afterAll(async () => {
    console.log('✅ API Tests completed!');
});

// Custom matchers
expect.extend({
    toBeValidUUID(received: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const pass = uuidRegex.test(received);
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid UUID`
                : `expected ${received} to be a valid UUID`,
        };
    },

    toBeISO8601Date(received: string) {
        const date = new Date(received);
        const pass = !isNaN(date.getTime());
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid ISO 8601 date`
                : `expected ${received} to be a valid ISO 8601 date`,
        };
    },
});

// Extend Jest types
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toBeValidUUID(): R;
            toBeISO8601Date(): R;
        }
    }
}

export { };
