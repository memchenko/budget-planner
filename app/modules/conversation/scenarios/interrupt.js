const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.INTERRUPT.command);

scenario.on(Scenario.COMPLETED, ({ userId }) => {
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
