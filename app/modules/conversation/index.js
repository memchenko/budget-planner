const bot = require("../../services/telegram-bot");
const log = require("../../lib/log");
const {
  processCommand,
  processMessage,
  processSelect,
} = require("./processors");

bot.subscribeToCommand(async (...args) => {
  try {
    await processCommand(...args);
  } catch (err) {
    log.error(`Error processing command`);
    log.error(`Context: ${JSON.stringify(args)}`);
    log.error(err.stack);
    log.error(err.cause);
  }
});

bot.subscribeToMessage(async (...args) => {
  try {
    await processMessage(...args);
  } catch (err) {
    log.error(`Error processing message`);
    log.error(`Context: ${JSON.stringify(args)}`);
    log.error(err.stack);
    log.error(err.cause);
  }
});

bot.subscribeToSelect(async (...args) => {
  try {
    await processSelect(...args);
  } catch (err) {
    log.error(`Error processing select`);
    log.error(`Context: ${JSON.stringify(args)}`);
    log.error(err.stack);
    log.error(err.cause);
  }
});
