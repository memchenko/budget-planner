const { exec } = require("node:child_process");
const { promisify } = require("node:util");

module.exports = {
  exec: promisify(exec),
};
