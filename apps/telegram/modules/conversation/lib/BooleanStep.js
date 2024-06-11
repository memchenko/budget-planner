const telegram = require("../../telegram");
const { Step } = require("./Step");

class BooleanStep extends Step {
  constructor() {
    super({ word: `Выберите "да" или "нет"` });
  }

  validate(text) {
    return text === "да" || text === "нет";
  }

  prepareResponse(text) {
    return text === "да";
  }

  async initiate({ userId }) {
    this.sendOptions({ userId });
  }

  async tryAgain({ userId, text }) {
    this.sendOptions({ userId, text });
  }

  sendOptions({ userId }) {
    const options = this.getOptions();

    telegram.respondWithList({
      userId,
      heading: this.word,
      options,
      page: 0,
    });
  }

  getOptions() {
    return [
      { id: "да", text: "да" },
      { id: "нет", text: "нет" },
    ];
  }
}

module.exports = { BooleanStep };
