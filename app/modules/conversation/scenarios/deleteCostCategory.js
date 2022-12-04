const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const categories = require("../../../entities/categories");
const { commands } = require("../../../lib/commands");
const { ChoiceStep } = require("../lib/ChoiceStep");

const scenario = new Scenario(commands.DELETE_COST_CATEGORY.command);

const categoriesStep = new ChoiceStep({
  word: "Выберите категорию",
  entity: categories,
});
categoriesStep.getItems = async function ({ userId }) {
  return this.entity.find({ userId, type: "cost" });
};
categoriesStep.mapDataItemToOption = function (item) {
  return { id: item, text: item };
};

scenario.registerStep(categoriesStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [category] = responsesList;

  await categories.remove({ userId, type: "cost", list: [category] });

  await gui.respondWithMessage({
    userId,
    text: `Категория расходов "${category}" удалена`,
  });
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
