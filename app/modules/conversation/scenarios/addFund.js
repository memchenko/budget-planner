const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const fund = require("../../../entities/fund");
const { commands } = require("../../../lib/commands");
const { Step } = require("../lib/Step");
const { FloatStep } = require("../lib/FloatStep");
const { IntegerStep } = require("../lib/IntegerStep");
const { BooleanStep } = require("../lib/BooleanStep");

const scenario = new Scenario(commands.ADD_FUND.command);

const titleStep = new Step({
  word: "Введите название фонда",
});

const capacityStep = new FloatStep();
capacityStep.word = `Введите размер фонда (${capacityStep.word.toLowerCase()})`;

const priorityStep = new IntegerStep();
priorityStep.word = `Введите приоритет фонда (${priorityStep.word.toLowerCase()})`;

const dailyLimitStep = new BooleanStep();
dailyLimitStep.word = `Рассчитывать дневной лимит для этого фонда? (${dailyLimitStep.word.toLowerCase()})`;

scenario.registerMultipleSteps(
  titleStep,
  capacityStep,
  priorityStep,
  dailyLimitStep
);

scenario.on(Scenario.COMPLETED, async ({ userId, responsesList }) => {
  const [title, capacity, priority, calculateDailyLimit] = responsesList;

  await fund.create({
    userId,
    title,
    balance: 0,
    priority,
    capacity,
    calculateDailyLimit,
  });
  gui.respondWithCurrentBudgetState({ userId });
});

module.exports = { scenario };
