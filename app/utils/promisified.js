const { exec } = require("node:child_process");
const fs = require("node:fs");
const { promisify } = require("node:util");

module.exports = {
  exec: promisify(exec),
  rm: promisify(fs.rm),
};
