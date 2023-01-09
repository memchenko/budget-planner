const { info, error } = require("./lib/log");
const user = require("./entities/user");
const gui = require("./modules/gui");
const { appState } = require("./services/db");

async function teardown() {
  info("Begin graceful teardown");

  try {
    const users = await user.findAll();

    await Promise.all(
      users.map(({ tgId }) => {
        return gui.respondWithMessage({
          userId: tgId,
          text: "Бот временно не работает. Ожидайте уведомления о восстановлении работоспособности. Спасибо!",
        });
      })
    );
    await appState.set({ isMaintenance: true });
  } catch (err) {
    error("Failed to graceful teardown");
    error(err);
  } finally {
    info("End graceful teardown");

    process.exit(0);
  }
}

module.exports = {
  teardown,
};
