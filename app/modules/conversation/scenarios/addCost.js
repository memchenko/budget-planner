const { Scenario } = require("../lib/Scenario");

const accountant = require("../../accountant");
const telegram = require("../../telegram");
const categories = require("../../../entities/categories");
const fund = require("../../../entities/fund");
const { commands } = require("../../../lib/commands");
const { FloatStep } = require("../lib/FloatStep");
const { ChoiceStep } = require("../lib/ChoiceStep");
const { Step } = require("../lib/Step");

const scenario = new Scenario(commands.ADD_COST.command);

const amountStep = new FloatStep();
const categoryStep = new ChoiceStep({
  word: "Выберите категорию расходов",
  entity: categories,
});
categoryStep.getItems = async function ({ userId }) {
  return this.entity.find({ userId, type: "cost" });
};
categoryStep.mapDataItemToOption = function (category) {
  return { id: category, text: category };
};
const fundStep = new ChoiceStep({ word: "Выберите фонд", entity: fund });
const noteStep = new Step({ word: `Введите заметку или просто "-"` });

scenario.registerMultipleSteps(amountStep, categoryStep, fundStep, noteStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [amount, category, fundId, note] = responsesList;

  await accountant.addCost({
    userId,
    fundId,
    note,
    category,
    amount,
  });

  telegram.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
