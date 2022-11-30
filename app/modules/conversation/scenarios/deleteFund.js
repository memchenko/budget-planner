const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const fund = require("../../../entities/fund");
const { commands } = require("../../../lib/commands");
const { ChoiceStep } = require("../lib/ChoiceStep");

const scenario = new Scenario(commands.DELETE_FUND.command);

const fundsStep = new ChoiceStep({ word: "Выберите фонд", entity: fund });

scenario.registerStep(fundsStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [fundId] = responsesList;

  const deletedFund = await fund.find({ userId, id: fundId });

  await fund.delete({ userId, id: fundId });
  await user.updateBalanceBy({
    tgId: userId,
    amount: deletedFund.balance,
  });
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
