export default {
  roots: ['./src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  reporters: [
    'default', // Default Jest reporter
    [
      'jest-html-reporter', // Adding HTML reporter
      {
        pageTitle: 'Test Report', // Title of the report
        outputPath: 'test-report.html', // Path where the report will be saved
      },
    ],
  ],
};
