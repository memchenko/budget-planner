const { groupBy, capitalize, isNil, round } = require("lodash");

const bot = require("../../services/telegram-bot");
const { commands, categoriesOrder } = require("../../lib/commands");
const accountant = require("../accountant");

const PAGE_SIZE = 10;

const gui = {
  PAGINATION_PREFIX: "page",
};

const getPageChoiceData = (page) => `${gui.PAGINATION_PREFIX}.${page}`;

const listOfCommands = (() => {
  const commandsGroupedByCategory = groupBy(
    commands,
    (command) => command.category
  );
  const commandsSectionsSorted = categoriesOrder.map(
    (category) => commandsGroupedByCategory[category]
  );

  return commandsSectionsSorted
    .reduce((acc, commandsSection) => {
      const section = capitalize(commandsSection[0].category);
      const list = commandsSection
        .reduce(
          (acc, command) =>
            `${acc}\n/${command.command} - ${command.description}`,
          ""
        )
        .trim();

      return `${acc}\n\n__${section}__\n${list}`;
    }, "")
    .trim();
})();

gui.getOptionsList = (options, page) => {
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, options.length);
  const lastPage = Math.floor(options.length / PAGE_SIZE);
  const pageOptions = options.slice(start, end);
  const optionsList = pageOptions.map(({ id, text }) => [
    {
      text,
      callback_data: id,
    },
  ]);

  if (options.length <= PAGE_SIZE) {
    return optionsList;
  } else if (page === 0) {
    optionsList.push([
      { text: ">>", callback_data: getPageChoiceData(page + 1) },
      { text: "В конец", callback_data: getPageChoiceData(lastPage) },
    ]);
  } else if (end === options.length) {
    optionsList.push([
      { text: "В начало", callback_data: getPageChoiceData(0) },
      { text: "<<", callback_data: getPageChoiceData(page - 1) },
    ]);
  } else {
    optionsList.push([
      { text: "<<", callback_data: getPageChoiceData(page - 1) },
      { text: ">>", callback_data: getPageChoiceData(page + 1) },
    ]);
  }

  return optionsList;
};

gui.respondWithCurrentBudgetState = async ({ userId }) => {
  const budget = await accountant.getBudget({ userId });
  const reserveText = `**Кошелек**: __${budget.reserve}__`;
  const fundsText = budget.funds
    .map(({ title, balance, capacity, dailyLimit, priority }) => {
      const base = `**(${priority}) ${title}**: ${balance} / ${capacity}`;

      return isNil(dailyLimit) ? base : `${base} (${round(dailyLimit, 2)}/д)`;
    })
    .join("\n");
  const totalText = `**Всего**: __${round(budget.total, 2)}__`;
  const text = `${reserveText}\n\n${fundsText}\n\n${totalText}`;

  bot.sendText({ chatId: userId, text });
};

gui.respondWithCommands = ({ userId }) => {
  const text = `**Список всех команд**:\n\n${listOfCommands}`;

  return bot.sendText({ chatId: userId, text });
};

gui.respondWithMessage = ({ userId, text }) => {
  return bot.sendText({ chatId: userId, text });
};

gui.respondWithList = ({ userId, heading, options, page }) => {
  const optionsMarkup = gui.getOptionsList(options, page);

  return bot.sendSelect({ chatId: userId, heading, options: optionsMarkup });
};

module.exports = gui;
