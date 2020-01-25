// Ref: https://github.com/facebook/jest/issues/2663
const path = require("path");

module.exports = {
  process(_, filename) {
    return "module.exports = " + JSON.stringify(path.basename(filename)) + ";";
  }
};
