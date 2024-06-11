const TelegramBot = require("node-telegram-bot-api");
const { isNil } = require("lodash");

const { commands } = require("../../lib/commands");
const { events, mediator } = require("../mediator");
const { telegram } = require("../../config");

const bot = new TelegramBot(telegram.token, { polling: true });

const service = {};
const commandsOptionsString = Object.values(commands)
  .map(({ command }) => command)
  .join("|");
const commandsOptionsRegEx = new RegExp(`^\/(${commandsOptionsString})$`);

service.sendText = ({ chatId, text }) => {
  return bot.sendMessage(chatId, text, {
    parse_mode: "Markdown",
  });
};

service.sendSelect = ({ chatId, heading = "", options }) => {
  return bot.sendMessage(chatId, heading, {
    reply_markup: {
      inline_keyboard: options,
    },
  });
};

service.subscribeToCommand = (cb) => {
  return mediator.on(events.COMMAND, ({ userId, command }) => {
    cb({ userId, command });
  });
};

service.subscribeToMessage = (cb) => {
  return mediator.on(events.MESSAGE, ({ userId, text }) => {
    cb({ userId, text });
  });
};

service.subscribeToSelect = (cb) => {
  return mediator.on(events.SELECT, ({ userId, choice }) => {
    cb({ userId, choice });
  });
};

bot.onText(/(.*)/, (msg, match) => {
  const userId = msg.chat.id;
  const message = match[1];
  const command = commandsOptionsRegEx.exec(message);

  if (isNil(command)) {
    mediator.emit(events.MESSAGE, { userId, text: message });
  } else {
    mediator.emit(events.COMMAND, {
      userId,
      command: command[0].replace("/", ""),
    });
  }
});

bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;

  await bot.answerCallbackQuery(callbackQuery.id);

  mediator.emit(events.SELECT, {
    userId: msg.chat.id,
    choice: callbackQuery.data,
  });
});

module.exports = service;
