const { success } = require("./lib/log");
const user = require("./entities/user");
const gui = require("./modules/gui");

async function setup() {
  require("./services/api");
  await require("./modules/conversation");

  const users = await user.findAll();

  users.forEach(({ tgId }) => {
    gui.respondWithMessage({
      userId: tgId,
      text: "Бот восстановлен и вернулся к работе",
    });
  });

  success("Service started successfully!");
}

module.exports = {
  setup,
};
