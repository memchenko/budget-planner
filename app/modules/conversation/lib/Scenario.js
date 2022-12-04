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

    this.registerStep = this.registerStep.bind(this);
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
      return this.complete({ userId });
    } else {
      return this.steps[0].initiate({ userId });
    }
  }

  async run({ userId, text }) {
    const { responsesList } = await state.find({ userId });
    const stepIndex = responsesList.length;
    const currentStep = this.steps[stepIndex];

    currentStep.run({ userId, text });
  }

  async complete({ userId }) {
    const { responsesList } = await state.find({ userId });

    await state.reset({ userId });

    this.emit(Scenario.COMPLETED, {
      userId,
      responsesList: responsesList.map((response) => JSON.parse(response)),
    });
  }

  async handleStepComplete({ userId }) {
    const stepIndex = await this.getNextStep({ userId });
    const nextStep = this.steps[stepIndex];

    if (isNil(nextStep)) {
      return this.complete({ userId });
    } else {
      return nextStep.initiate({ userId });
    }
  }

  async getNextStep({ userId }) {
    const { responsesList } = await state.find({ userId });
    const hasNext = responsesList.length < this.steps.length;

    return hasNext ? responsesList.length : null;
  }
}

module.exports = { Scenario };
