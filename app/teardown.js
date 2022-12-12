const { info } = require("./lib/log");
const user = require("./entities/user");
const gui = require("./modules/gui");

async function teardown() {
  info("Begin graceful teardown");

  const users = await user.findAll();

  await Promise.all(
    users.map(({ tgId }) => {
      return gui.respondWithMessage({
        userId: tgId,
        text: "Бот временно не работает. Ожидайте уведомления о восстановлении работоспособности. Спасибо!",
      });
    })
  );

  info("End graceful teardown");

  process.exit(0);
}

module.exports = {
  teardown,
};
