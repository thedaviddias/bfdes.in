module.exports = {
  collectCoverageFrom: [
      "src/**/*"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
    "\\.(svg|jpeg|png)$": "<rootDir>/tests/setup/assetTransformer.js"
  },
  testRegex: "/tests/.*\\.(ts|tsx)$"
}
