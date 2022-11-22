const EventEmitter = require("node:events");

const validateString = () => {};
const validateFloat = () => {};
const validateInteger = () => {};
const validateSelect = () => {};

class Scenario extends EventEmitter {
  constructor(name) {
    super();

    this.name = name;
    this.steps = [];
  }

  addStep(step) {
    this.steps.push(step);
  }

  run() {}

  complete() {}
}

class Step {
  static STRING = Symbol();
  static FLOAT = Symbol();
  static INTEGER = Symbol();
  static SELECT = Symbol();

  static of(props) {
    return new Step(props);
  }

  constructor({ type, word }) {
    this.type = type;
    this.word = word;

    this.isComplete = false;
  }

  run() {}

  runString() {}
}

module.exports = {
  Scenario,
  Step,
};
