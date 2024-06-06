const { Scenario } = require("../lib/Scenario");

const telegram = require("../../telegram");
const fund = require("../../../entities/fund");
const { commands } = require("../../../lib/commands");
const { ChoiceStep } = require("../lib/ChoiceStep");
const { FloatStep } = require("../lib/FloatStep");

const scenario = new Scenario(commands.CHANGE_FUND_BALANCE.command);

const fundsStep = new ChoiceStep({ word: "Выберите фонд", entity: fund });
const newBalanceStep = new FloatStep();
newBalanceStep.word = `Введите новый баланс ${newBalanceStep.word.toLowerCase()}`;

scenario.registerMultipleSteps(fundsStep, newBalanceStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [fundId, balance] = responsesList;

  await fund.update({ userId, id: fundId, balance });

  telegram.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
