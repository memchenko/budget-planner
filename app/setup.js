const { success } = require("./lib/log");

function setup() {
  require("./modules/conversation");

  success("Service started successfully!");
}

module.exports = {
  setup,
};
