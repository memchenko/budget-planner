const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const categories = require("../../../entities/categories");
const { commands } = require("../../../lib/commands");
const { Step } = require("../lib/Step");

const scenario = new Scenario(commands.ADD_COST_CATEGORY.command);

const titleStep = new Step({
  word: "Введите название новой категории расходов",
});

scenario.registerStep(titleStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [title] = responsesList;

  await categories.add({ userId, type: "cost", title });

  gui.respondWithMessage({
    userId,
    text: `Категория расходов "${title}" успешно добавлена`,
  });
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
