const categories = {
  CONTROL: "контроль разговора",
  MAIN: "основное",
  CATEGORIES_MANAGEMENT: "управление категориями",
  FUNDS_MANAGEMENT: "управление фондами",
};

module.exports.categories = categories;
module.exports.categoriesOrder = [
  categories.CONTROL,
  categories.FUNDS_MANAGEMENT,
  categories.CATEGORIES_MANAGEMENT,
  categories.MAIN,
];

module.exports.commands = {
  START: {
    command: "start",
    description: "",
    category: "",
  },

  // to reset current conversation state
  INTERRUPT: {
    command: "interrupt",
    description: "прекратить текущее общение с ботом",
    category: categories.CONTROL,
  },
  HELP: {
    command: "help",
    description: "вывести список всех команд",
    category: categories.CONTROL,
  },

  UPDATE_BALANCE: {
    command: "updatebalance",
    description: "изменить баланс кошелька",
    category: categories.MAIN,
  },

  ADD_FUND: {
    command: "addfund",
    description: "добавить новый фонд",
    category: categories.FUNDS_MANAGEMENT,
  },
  DELETE_FUND: {
    command: "deletefund",
    description: "удалить фонд",
    category: categories.FUNDS_MANAGEMENT,
  },
  CHANGE_FUND_BALANCE: {
    command: "changefundbalance",
    description: "изменить баланс фонда",
    category: categories.FUNDS_MANAGEMENT,
  },

  ADD_COST_CATEGORY: {
    command: "addcostcategory",
    description: "добавить категорию для расходов",
    category: categories.CATEGORIES_MANAGEMENT,
  },
  ADD_INCOME_CATEGORY: {
    command: "addincomecategory",
    description: "добавить категорию для доходов",
    category: categories.CATEGORIES_MANAGEMENT,
  },
  DELETE_COST_CATEGORY: {
    command: "deletecostcategory",
    description: "удалить категорию расходов",
    category: categories.CATEGORIES_MANAGEMENT,
  },
  DELETE_INCOME_CATEGORY: {
    command: "deleteincomecategory",
    description: "удалить категорию доходов",
    category: categories.CATEGORIES_MANAGEMENT,
  },

  ADD_COST: {
    command: "addcost",
    description: "добавить расход",
    category: categories.MAIN,
  },
  ADD_INCOME: {
    command: "addincome",
    description: "добавить пополнение",
    category: categories.MAIN,
  },

  MOVE_BALANCE_TO_FUND: {
    command: "movebalancetofund",
    description: "перенести весь баланс в определенный фонд",
    category: categories.FUNDS_MANAGEMENT,
  },
  SPLIT_BALANCE_BY_PRIORITIES: {
    command: "splitbalancebypriorities",
    description: "разделить баланс по фондам, учитывая приоритет",
    category: categories.FUNDS_MANAGEMENT,
  },
  SPLIT_BALANCE_EQUALLY: {
    command: "splitbalanceequally",
    description: "разделить баланс по фондам поровну",
    category: categories.FUNDS_MANAGEMENT,
  },
};
