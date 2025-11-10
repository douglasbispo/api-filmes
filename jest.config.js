module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/config/db.js",
    "!**/server.js",
    "!**/jest.config.js",
    "!**/eslint.config.mjs",
    "!**/nodels/filmes.js",
  ],
};