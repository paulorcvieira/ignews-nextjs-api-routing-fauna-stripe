module.exports = {
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  bail: 1,
  clearMocks: true,
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(scss|css|sass)": "identity-obj-proxy"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.(jsx|tsx)',
    '<rootDir>/src/tests/**/*.(jsx|tsx)',
    '!<rootDir>/src/**/**/*.spec.(jsx|tsx)',
    '!<rootDir>/src/**/**/*.spec.(jsx|tsx)',
    '!<rootDir>/src/**/**/_app.(jsx|tsx)',
    '!<rootDir>/src/**/**/_document.(jsx|tsx)',
  ],
  coverageReporters: ['lcov', 'text', 'json'],
};