const EventEmitter = require("node:events");
const { isNil, isEmpty } = require("lodash");

const state = require("../../../entities/state");
const { Step } = require("./Step");

class Scenario extends EventEmitter {
  static COMPLETED = "COMPLETED";

  constructor(name) {
    super();

    this.name = name;
    this.steps = [];
  }

  registerMultipleSteps(...steps) {
    steps.forEach(this.registerStep);
  }

  registerStep(step) {
    this.steps.push(step);

    step.on(Step.COMPLETED, this.handleStepComplete.bind(this));
  }

  async initiate({ userId }) {
    await state.reset({ userId });
    await state.setState({ userId, state: this.name });

    if (isEmpty(this.steps)) {
      this.complete({ userId });
    } else {
      this.steps[0].initiate({ userId });
    }
  }

  async run({ userId, text }) {
    const { responsesList } = await state.find({ userId });
    const currentStep = this.steps[responsesList.length - 1];

    currentStep.run({ userId, text });
  }

  async complete({ userId }) {
    const { responsesList } = await state.find({ userId });

    await state.reset({ userId });

    this.emit(Scenario.COMPLETED, { userId, responsesList });
  }

  async handleStepComplete({ userId }) {
    const nextStep = await this.getNextStep({ userId });

    if (isNil(nextStep)) {
      this.complete({ userId });
    } else {
      nextStep.initiate({ userId });
    }
  }

  async getNextStep({ userId }) {
    const { responsesList } = await state.find({ userId });
    const hasNext = responsesList.length < this.steps.length;

    return hasNext ? responsesList.length : null;
  }
}

module.exports = { Scenario };
