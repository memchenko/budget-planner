const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const categories = require("../../../entities/categories");
const { commands } = require("../../../lib/commands");
const { ChoiceStep } = require("../lib/ChoiceStep");

const scenario = new Scenario(commands.DELETE_INCOME_CATEGORY.command);

const categoriesStep = new ChoiceStep({
  word: "Выберите категорию",
  entity: categories,
});
categories.getItems = async function () {
  return this.entity.find({ userId, type: "income" });
};
categories.mapDataItemToOption = function (item) {
  return { id: item, text: item };
};

scenario.registerStep(categoriesStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [category] = responsesList;

  await categories.remove({ userId, type: "income", list: [category] });

  await gui.respondWithMessage({
    userId,
    text: `Категория доходов "${category}" удалена`,
  });
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
