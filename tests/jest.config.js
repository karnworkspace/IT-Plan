/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/api', '<rootDir>/scenarios'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/setup/jest.setup.ts'],
    testTimeout: 30000,
    verbose: true,
    collectCoverageFrom: [
        'api/**/*.ts',
        '!api/**/*.d.ts',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    reporters: ['default'],
};

module.exports = config;
