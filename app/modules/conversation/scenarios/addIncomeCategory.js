const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const categories = require("../../../entities/categories");
const { commands } = require("../../../lib/commands");
const { Step } = require("../lib/Step");

const scenario = new Scenario(commands.ADD_INCOME_CATEGORY.command);

const titleStep = new Step({
  word: "Введите название новой категории доходов",
});

scenario.registerStep(titleStep);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [title] = responsesList;

  await categories.add({ userId, type: "income", title });

  gui.respondWithMessage({
    userId,
    text: `Категория доходов "${title}" успешно добавлена`,
  });
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
