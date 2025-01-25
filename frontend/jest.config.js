module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['./setup-jest.ts'],
    collectCoverage: true,
    coverageReporters: ['html', 'lcov'],
    collectCoverageFrom: [
        'src/app/**/*.ts',
        '!src/app/**/*.module.ts',
    ],
    coverageDirectory: './coverage'
};
