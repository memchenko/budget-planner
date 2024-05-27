const { Scenario } = require("../lib/Scenario");

const telegram = require("../../telegram");
const user = require("../../../entities/user");
const { commands } = require("../../../lib/commands");
const { FloatStep } = require("../lib/FloatStep");

const scenario = new Scenario(commands.UPDATE_BALANCE.command);

scenario.registerStep(new FloatStep());

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [balance] = responsesList;

  await user.update({ tgId: userId, balance });
  await telegram.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
