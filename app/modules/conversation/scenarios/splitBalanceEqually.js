const { Scenario } = require("../lib/Scenario");

const accountant = require("../../accountant");
const gui = require("../../gui");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.SPLIT_BALANCE_EQUALLY.command);

scenario.on(Scenario.COMPLETED, async ({ userId }) => {
  await accountant.shareBalanceBetweenFundsEqually({ userId });

  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
