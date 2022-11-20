const state = require("../../entities/state");
const categories = require("../../entities/categories");
const user = require("../../entities/user");
const fund = require("../../entities/fund");
const accountant = require("../accountant");
const gui = require("../gui");
const {
  PUT_NUMBER_RESPONSE,
  PUT_TITLE_RESPONSE,
  PUT_BOOLEAN_RESPONSE,
  NUMBER_INVALID_RESPONSE,
  TEXT_INVALID_RESPONSE,
  INTEGER_INVALID_RESPONSE,
  BOOLEAN_INVALID_RESPONSE,
} = require("./constants");
const { isNumber, isInteger, isString, isBoolean } = require("./utils");

const { commands } = require("../../lib/commands");

const scenario = {};

scenario[commands.START.command] = {
  onCommand: async ({ userId }) => {
    const existingUser = await user.find({ tgId: userId });

    if (!existingUser) {
      await user.create({ tgId: userId, balance: 0 });
    }

    await state.reset({ userId });

    gui.respondWithCommands({ userId });
  },
};

scenario[commands.HELP.command] = {
  onCommand: async ({ userId }) => {
    await state.reset({ userId });

    gui.respondWithCommands({ userId });
  },
};

scenario[commands.INTERRUPT.command] = {
  onCommand: async ({ userId }) => {
    await state.reset({ userId });
    await gui.respondWithCurrentBudgetState({ userId });
  },
};

scenario[commands.UPDATE_BALANCE.command] = {
  onCommand: ({ userId }) => {
    gui.respondWithMessage({ userId, text: PUT_NUMBER_RESPONSE });
  },
  onMessage: [
    {
      responseForInvalid: NUMBER_INVALID_RESPONSE,
      validate: isNumber,
      onSuccess: async ({ userId, text }) => {
        const num = Number(text);

        await user.update({ tgId: userId, balance: num });
        await state.reset({ userId });
        await gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.ADD_FUND.command] = {
  onCommand: async ({ userId }) => {
    await gui.respondWithMessage({
      userId,
      text: `${PUT_TITLE_RESPONSE} фонда`,
    });
  },
  onMessage: [
    {
      responseForInvalid: TEXT_INVALID_RESPONSE,
      validate: isString,
      onSuccess: ({ userId }) => {
        gui.respondWithMessage({ userId, text: "Введите размер фонда" });
      },
    },
    {
      responseForInvalid: NUMBER_INVALID_RESPONSE,
      validate: isNumber,
      onSuccess: ({ userId }) => {
        gui.respondWithMessage({
          userId,
          text: "Введите приоритет фонда (целое число)",
        });
      },
    },
    {
      responseForInvalid: INTEGER_INVALID_RESPONSE,
      validate: isInteger,
      onSuccess: ({ userId }) => {
        gui.respondWithMessage({
          userId,
          text: `Рассчитывать дневной лимит для этого фонда? (${PUT_BOOLEAN_RESPONSE})`,
        });
      },
    },
    {
      responseForInvalid: BOOLEAN_INVALID_RESPONSE,
      validate: isBoolean,
      onSuccess: async ({ userId, newState }) => {
        const [title, capacity, priority, calculateDailyLimit] =
          newState.responsesList;

        await fund.create({
          userId,
          title,
          balance: 0,
          priority: Number(priority),
          capacity: Number(capacity),
          calculateDailyLimit: calculateDailyLimit === "да",
        });
        await state.reset({ userId });

        gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.DELETE_FUND.command] = {
  onCommand: async ({ userId }) => {
    const funds = await fund.findAll({ userId });
    const options = funds.map(({ id, title }) => ({ id, text: title }));

    gui.respondWithList({ userId, heading: "Выберите фонд", options, page: 0 });
  },
  onMessage: [
    {
      responseForInvalid: "Неверный формат. Выберите существующий фонд",
      validate: (text) => isString(text) || isInteger(text),
      onSuccess: async ({ userId, text }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const funds = await fund.findAll({ userId });
          const options = funds.map(({ id, title }) => ({ id, text: title }));

          gui.respondWithList({
            userId,
            heading: "Выберите фонд",
            options,
            page: Number(text),
          });
        } else {
          const deletedFund = await fund.find({ userId, id: text });

          await fund.delete({ userId, id: text });
          await user.updateBalanceBy({
            tgId: userId,
            amount: deletedFund.balance,
          });
          await state.reset({ userId });
          gui.respondWithCurrentBudgetState({ userId });
        }
      },
    },
  ],
};

scenario[commands.CHANGE_FUND_BALANCE.command] = {
  onCommand: async ({ userId }) => {
    const funds = await fund.findAll({ userId });
    const options = funds.map(({ id, title }) => ({ id, text: title }));

    gui.respondWithList({
      userId,
      heading: "Выберите фонд",
      options,
      page: 0,
    });
  },
  onMessage: [
    {
      responseForInvalid: "Неверный формат. Выберите фонд",
      manualAddResponse: true,
      validate: (text) => isInteger(text) || isString(text),
      onSuccess: async ({ userId, text, addResponse }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const funds = await fund.findAll({ userId });
          const options = funds.map(({ id, title }) => ({ id, text: title }));

          gui.respondWithList({
            userId,
            heading: "Выберите фонд",
            options,
            page: Number(text),
          });
        } else {
          await addResponse(text);

          gui.respondWithMessage({
            userId,
            text: "Введите новый баланс в формате 99.99",
          });
        }
      },
    },
    {
      responseForInvalid: NUMBER_INVALID_RESPONSE,
      validate: isNumber,
      onSuccess: async ({ userId, newState }) => {
        const [fundId, balance] = newState.responsesList;

        await fund.update({ userId, id: fundId, balance: Number(balance) });

        gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.ADD_COST_CATEGORY.command] = {
  onCommand: ({ userId }) => {
    gui.respondWithMessage({ userId, text: PUT_TITLE_RESPONSE });
  },
  onMessage: [
    {
      responseForInvalid: TEXT_INVALID_RESPONSE,
      validate: isString,
      onSuccess: async ({ userId, text }) => {
        await categories.add({ userId, type: "cost", list: [text] });

        gui.respondWithMessage({
          userId,
          text: `Категория расходов "${text}" успешно добавлена`,
        });

        await state.reset({ userId });

        gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.ADD_INCOME_CATEGORY.command] = {
  onCommand: async ({ userId }) => {
    gui.respondWithMessage({ userId, text: PUT_TITLE_RESPONSE });
  },
  onMessage: [
    {
      responseForInvalid: TEXT_INVALID_RESPONSE,
      validate: isString,
      onSuccess: async ({ userId, text }) => {
        await categories.add({ userId, type: "income", list: [text] });

        gui.respondWithMessage({
          userId,
          text: `Категория доходов "${text}" успешно добавлена`,
        });

        await state.reset({ userId });

        gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.DELETE_COST_CATEGORY.command] = {
  onCommand: async ({ userId }) => {
    const costCategories = await categories.find({ userId, type: "cost" });
    const options = costCategories.map((category) => ({
      id: category,
      text: category,
    }));

    gui.respondWithList({
      userId,
      heading: "Выберите категорию",
      options,
      page: 0,
    });
  },
  onMessage: [
    {
      responseForInvalid: "Неверный формат ответа. Выберите категорию",
      validate: (text) => isString(text) || isNumber(text),
      onSuccess: async ({ userId, text }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const costCategories = await categories.find({
            userId,
            type: "cost",
          });
          const options = costCategories.map((category) => ({
            id: category,
            text: category,
          }));

          gui.respondWithList({
            userId,
            heading: "Выберите категорию",
            options,
            page: Number(text),
          });
        } else {
          await categories.remove({ userId, type: "cost", list: [text] });
          await state.reset({ userId });

          await gui.respondWithMessage({
            userId,
            text: `Категория расходов "${text}" удалена`,
          });
          gui.respondWithCurrentBudgetState({ userId });
        }
      },
    },
  ],
};

scenario[commands.DELETE_INCOME_CATEGORY.command] = {
  onCommand: async ({ userId }) => {
    const incomeCategories = await categories.find({ userId, type: "income" });
    const options = incomeCategories.map((category) => ({
      id: category,
      text: category,
    }));

    gui.respondWithList({
      userId,
      heading: "Выберите категорию",
      options,
      page: 0,
    });
  },
  onMessage: [
    {
      responseForInvalid: "Неверный формат ответа. Выберите категорию",
      validate: (text) => isString(text) || isNumber(text),
      onSuccess: async ({ userId, text }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const incomeCategories = await categories.find({
            userId,
            type: "income",
          });
          const options = incomeCategories.map((category) => ({
            id: category,
            text: category,
          }));

          gui.respondWithList({
            userId,
            heading: "Выберите категорию",
            options,
            page: Number(text),
          });
        } else {
          await categories.remove({ userId, type: "income", list: [text] });
          await state.reset({ userId });

          await gui.respondWithMessage({
            userId,
            text: `Категория доходов "${text}" удалена`,
          });
          gui.respondWithCurrentBudgetState({ userId });
        }
      },
    },
  ],
};

scenario[commands.ADD_COST.command] = {
  onCommand: async ({ userId }) => {
    gui.respondWithMessage({ userId, text: PUT_NUMBER_RESPONSE });
  },
  onMessage: [
    {
      responseForInvalid: NUMBER_INVALID_RESPONSE,
      validate: isNumber,
      onSuccess: async ({ userId }) => {
        const costCategories = await categories.find({ userId, type: "cost" });
        const options = costCategories.map((category) => ({
          id: category,
          text: category,
        }));

        gui.respondWithList({
          userId,
          heading: "Выберите категорию расходов",
          options,
          page: 0,
        });
      },
    },
    {
      responseForInvalid: "Неверный формат. Введите категорию расходов",
      validate: (text) => isString(text) || isInteger(text),
      manualAddResponse: true,
      onSuccess: async ({ userId, text, addResponse }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const costCategories = await categories.find({
            userId,
            type: "cost",
          });
          const options = costCategories.map((category) => ({
            id: category,
            text: category,
          }));

          gui.respondWithList({
            userId,
            heading: "Выберите категорию расходов",
            options,
            page: Number(text),
          });
        } else {
          await addResponse(text);

          const funds = await fund.findAll({ userId });
          const options = funds.map(({ id, title }) => ({ id, text: title }));

          gui.respondWithList({
            userId,
            heading: "Выберите фонд",
            options,
            page: 0,
          });
        }
      },
    },
    {
      responseForInvalid: "Неверный формат. Выберите фонд",
      validate: (text) => isString(text) || isInteger(text),
      manualAddResponse: true,
      onSuccess: async ({ userId, text, addResponse }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const funds = await fund.findAll({ userId });
          const options = funds.map(({ id, title }) => ({ id, text: title }));

          gui.respondWithList({
            userId,
            heading: "Выберите фонд",
            options,
            page: Number(text),
          });
        } else {
          await addResponse(text);

          gui.respondWithMessage({
            userId,
            text: "Введите заметку или просто '-'",
          });
        }
      },
    },
    {
      responseForInvalid: TEXT_INVALID_RESPONSE,
      validate: isString,
      onSuccess: async ({ userId, newState }) => {
        const [amount, category, fundId, note] = newState.responsesList;

        await accountant.addCost({
          userId,
          fundId,
          note,
          category,
          amount: Number(amount),
        });
        await state.reset({ userId });

        gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.ADD_INCOME.command] = {
  onCommand: async ({ userId }) => {
    gui.respondWithMessage({ userId, text: PUT_NUMBER_RESPONSE });
  },
  onMessage: [
    {
      responseForInvalid: NUMBER_INVALID_RESPONSE,
      validate: isNumber,
      onSuccess: async ({ userId }) => {
        const incomeCategories = await categories.find({
          userId,
          type: "income",
        });
        const options = incomeCategories.map((category) => ({
          id: category,
          text: category,
        }));

        gui.respondWithList({
          userId,
          heading: "Выберите категорию доходов",
          options,
          page: 0,
        });
      },
    },
    {
      responseForInvalid: "Неверный формат. Введите категорию доходов",
      validate: (text) => isString(text) || isInteger(text),
      manualAddResponse: true,
      onSuccess: async ({ userId, text, addResponse }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const incomeCategories = await categories.find({
            userId,
            type: "income",
          });
          const options = incomeCategories.map((category) => ({
            id: category,
            text: category,
          }));

          gui.respondWithList({
            userId,
            heading: "Выберите категорию доходов",
            options,
            page: Number(text),
          });
        } else {
          await addResponse(text);

          gui.respondWithMessage({
            userId,
            text: "Введите заметку или просто '-'",
          });
        }
      },
    },
    {
      responseForInvalid: TEXT_INVALID_RESPONSE,
      validate: isString,
      onSuccess: async ({ userId, text, newState }) => {
        const [amount, category, note] = newState.responsesList;

        await accountant.addIncome({
          userId,
          category,
          amount: Number(amount),
          note,
        });
        await state.reset({ userId });

        gui.respondWithCurrentBudgetState({ userId });
      },
    },
  ],
};

scenario[commands.MOVE_BALANCE_TO_FUND.command] = {
  onCommand: async ({ userId }) => {
    const funds = await fund.findAll({ userId });
    const options = funds.map(({ id, title }) => ({ id, text: title }));

    gui.respondWithList({ userId, heading: "Выберите фонд", options, page: 0 });
  },
  onMessage: [
    {
      responseForInvalid: "Неверный формат. Выберите фонд",
      validate: (text) => isString(text) || isInteger(text),
      onSuccess: async ({ userId, text }) => {
        const isPagination = isInteger(text);

        if (isPagination) {
          const funds = await fund.findAll({ userId });
          const options = funds.map(({ id, title }) => ({ id, text: title }));

          gui.respondWithList({
            userId,
            heading: "Выберите фонд",
            options,
            page: Number(text),
          });
        } else {
          await accountant.moveWholeBalanceToFund({ userId, fundId: text });
          await state.reset({ userId });

          gui.respondWithCurrentBudgetState({ userId });
        }
      },
    },
  ],
};

scenario[commands.SPLIT_BALANCE_BY_PRIORITIES.command] = {
  onCommand: async ({ userId }) => {
    await accountant.shareBalanceBetweenFundsByPriorities({ userId });
    await state.reset({ userId });

    gui.respondWithCurrentBudgetState({ userId });
  },
};

scenario[commands.SPLIT_BALANCE_EQUALLY.command] = {
  onCommand: async ({ userId }) => {
    await accountant.shareBalanceBetweenFundsEqually({ userId });
    await state.reset({ userId });

    gui.respondWithCurrentBudgetState({ userId });
  },
};

module.exports = scenario;
