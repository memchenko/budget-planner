const { Step } = require("./Step");

const integerRegEx = /^\d+$/;

class IntegerStep extends Step {
  constructor() {
    super({ word: "Введите целое число в формате 99" });
  }

  validate(text) {
    return integerRegEx.test(text);
  }

  prepareResponse(text) {
    return Number(text);
  }
}

module.exports = { IntegerStep };
