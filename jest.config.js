module.exports = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "\\.(ts|tsx)$": "ts-jest"
  },
  testRegex: "/tests/.*\\.(ts|tsx)$",
  moduleNameMapper: {
    "\\.(svg|jpeg)$": "<rootDir>/tests/setup/assetTransformer.js"
  }
}
