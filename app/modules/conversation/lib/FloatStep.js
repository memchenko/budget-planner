const { Step } = require("./Step");

class FloatStep extends Step {
  constructor() {
    super({ word: "Введите число в формате 99.999999" });
  }

  validate(text) {
    const num = Number(text);

    return !isNaN(num) && isFinite(num);
  }

  prepareResponse(text) {
    return Number(text);
  }
}

module.exports = { FloatStep };
