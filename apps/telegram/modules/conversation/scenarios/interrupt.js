const { Scenario } = require("../lib/Scenario");

const telegram = require("../../telegram");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.INTERRUPT.command);

scenario.on(Scenario.COMPLETED, ({ userId }) => {
  telegram.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
