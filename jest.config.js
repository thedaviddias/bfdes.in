module.exports = {
  collectCoverageFrom: ["src/**/*"],
  moduleDirectories: [".", "src", "node_modules"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  setupFiles: ["<rootDir>/jest/setup.js"],
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
    "\\.(svg|jpg|png)$": "<rootDir>/jest/assetTransformer.js",
  },
  testRegex: "/tests/.*\\.(ts|tsx)$",
};
