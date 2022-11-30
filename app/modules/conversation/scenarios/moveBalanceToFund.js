const { Scenario } = require("../lib/Scenario");

const accountant = require("../../accountant");
const gui = require("../../gui");
const fund = require("../../../entities/fund");
const { commands } = require("../../../lib/commands");
const { ChoiceStep } = require("../lib/ChoiceStep");

const scenario = new Scenario(commands.MOVE_BALANCE_TO_FUND.command);

const fundStep = new ChoiceStep({ word: "Выберите фонд", entity: fund });

scenario.registerStep(fundStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [fundId] = responsesList;

  await accountant.moveWholeBalanceToFund({
    userId,
    fundId,
  });

  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
