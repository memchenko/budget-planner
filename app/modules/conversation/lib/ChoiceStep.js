const { Step } = require("./Step");

const telegram = require("../../telegram");

const paginationRegEx = new RegExp(`^${telegram.PAGINATION_PREFIX}\\.(\\d+)$`);

class ChoiceStep extends Step {
  constructor({ word, entity }) {
    super({ word });

    this.entity = entity;
  }

  async initiate({ userId }) {
    this.sendOptions({ userId });
  }

  async tryAgain({ userId, text }) {
    this.sendOptions({ userId, text });
  }

  async sendOptions({ userId, text = "" }) {
    const options = await this.getOptions({ userId });
    const page = this.getPage(text);

    telegram.respondWithList({
      userId,
      heading: this.word,
      options,
      page,
    });
  }

  async getOptions({ userId }) {
    const dataset = await this.getItems({ userId });
    const options = dataset.map(this.mapDataItemToOption);

    return options;
  }

  async getItems({ userId }) {
    return this.entity.findAll({ userId });
  }

  getPage(text) {
    const result = paginationRegEx.exec(text);

    return result ? Number(result[1]) : 0;
  }

  mapDataItemToOption({ id, title }) {
    return { id, text: title };
  }

  validate(text) {
    return !paginationRegEx.test(text);
  }
}

module.exports = { ChoiceStep };
