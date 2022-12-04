const { success } = require("./lib/log");

async function setup() {
  await require("./modules/conversation");

  success("Service started successfully!");
}

module.exports = {
  setup,
};
