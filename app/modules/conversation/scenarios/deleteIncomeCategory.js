const { Scenario } = require("../lib/Scenario");

const telegram = require("../../telegram");
const categories = require("../../../entities/categories");
const { commands } = require("../../../lib/commands");
const { ChoiceStep } = require("../lib/ChoiceStep");

const scenario = new Scenario(commands.DELETE_INCOME_CATEGORY.command);

const categoriesStep = new ChoiceStep({
  word: "Выберите категорию",
  entity: categories,
});
categoriesStep.getItems = async function ({ userId }) {
  return this.entity.find({ userId, type: "income" });
};
categoriesStep.mapDataItemToOption = function (item) {
  return { id: item, text: item };
};

scenario.registerStep(categoriesStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [category] = responsesList;

  await categories.remove({ userId, type: "income", list: [category] });

  await telegram.respondWithMessage({
    userId,
    text: `Категория доходов "${category}" удалена`,
  });
  telegram.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
