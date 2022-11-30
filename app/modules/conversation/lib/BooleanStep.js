const { Step } = require("./Step");

class BooleanStep extends Step {
  constructor() {
    super({ word: `Введите "да" или "нет"` });
  }

  validate(text) {
    return text === "да" || text === "нет";
  }

  prepareResponse(text) {
    return text === "да";
  }
}

module.exports = { BooleanStep };
