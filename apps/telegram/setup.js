const { success } = require("./lib/log");
const user = require("./entities/user");
const telegram = require("./modules/telegram");
const { events, mediator } = require("./services/mediator");
const { appState } = require("./services/db");

async function setup() {
  require("./services/api");
  await require("./modules/conversation");

  const users = await user.findAll();

  const state = await appState.get();
  let isMaintenance = false;

  if (state.exists) {
    const stateData = await state.data();

    isMaintenance = stateData.isMaintenance;
  }

  if (isMaintenance) {
    users.forEach(({ tgId }) => {
      telegram
        .respondWithMessage({
          userId: tgId,
          text: "Бот восстановлен и вернулся к работе",
        })
        .catch((error) => {
          if (error.message.includes("bot was blocked by the user")) {
            mediator.emit(events.DELETE_USER, { tgId });
          }
        });
    });

    state.set({ isMaintenance: false });
  }

  success("Service started successfully!");
}

module.exports = {
  setup,
};
