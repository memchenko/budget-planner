const path = require("node:path");

const bot = require("../../services/telegram-bot");
const log = require("../../lib/log");
const { ScenariosRouter } = require("./lib/ScenariosRouter");

const scenariosPath = path.join(__dirname, "./scenarios");

const scenarioRouter = new ScenariosRouter(scenariosPath);

bot.subscribeToCommand(scenarioRouter.handleCommand);
bot.subscribeToMessage(scenarioRouter.handleMessage);
bot.subscribeToSelect(scenarioRouter.handleChoice);
