module.exports = {
  collectCoverageFrom: [
      "src/**/*"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  setupFiles: [
    "<rootDir>/jest/setup.js"
  ],
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
    "\\.(svg|jpeg|png)$": "<rootDir>/jest/assetTransformer.js"
  },
  testRegex: "/tests/.*\\.(ts|tsx)$"
}
