const { Scenario } = require("../lib/Scenario");

const accountant = require("../../accountant");
const gui = require("../../gui");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.SPLIT_BALANCE_BY_PRIORITIES.command);

scenario.on(Scenario.COMPLETED, async ({ userId }) => {
  await accountant.shareBalanceBetweenFundsByPriorities({ userId });

  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
