const fs = require("node:fs");
const path = require("node:path");

const { isNil } = require("lodash");

const state = require("../../../entities/state");
const log = require("../../../lib/log");
const gui = require("../../gui");

class ScenariosRouter {
  constructor(scenariosPath) {
    this.scenariosPath = scenariosPath;
    this.scenarios = {};

    this.handleCommand = this.handleCommand.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
  }

  async init() {
    return this.loadScenarios();
  }

  async getScenarioInProgress({ userId }) {
    const { state: currentState } = await state.find({ userId });

    return currentState;
  }

  async loadScenarios() {
    log.info("Initiating scenarios...");

    const scenariosFiles = fs.readdirSync(this.scenariosPath);

    scenariosFiles.forEach((file) => {
      const fullPath = path.resolve(this.scenariosPath, file);
      const { scenario } = require(fullPath);

      this.scenarios[scenario.name] = scenario;
    });

    log.success("Scenarios successfully loaded!");
  }

  async handleCommand({ userId, command }) {
    try {
      const scenario = this.scenarios[command];

      if (isNil(scenario)) {
        return gui.respondWithMessage({
          userId,
          text: "Мне неизвестна такая команда",
        });
      } else {
        return scenario.initiate({ userId });
      }
    } catch (err) {
      log.error(`Error processing command`);
      log.error(`Context: ${JSON.stringify({ userId, command })}`);
      log.error(err.stack);
      log.error(err.cause);
    }
  }

  async handleMessage({ userId, text }) {
    try {
      const key = await this.getScenarioInProgress({ userId });
      const scenario = this.scenarios[key];

      if (isNil(scenario)) {
        return;
      } else {
        return scenario.run({ userId, text });
      }
    } catch (err) {
      log.error(`Error processing message`);
      log.error(`Context: ${JSON.stringify({ userId, text })}`);
      log.error(err.stack);
      log.error(err.cause);
    }
  }

  async handleChoice({ userId, choice }) {
    try {
      return this.handleMessage({ userId, text: choice });
    } catch (err) {
      log.error(`Error processing select`);
      log.error(`Context: ${JSON.stringify({ userId })}`);
      log.error(err.stack);
      log.error(err.cause);
    }
  }
}

module.exports = { ScenariosRouter };
