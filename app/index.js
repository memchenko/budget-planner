require("./config");
require("./services/errors");

const { isString } = require("lodash/isString");
const { mediator, events } = require("./services/mediator");
const { setup } = require("./setup");
const { teardown } = require("./teardown");
const { error, warn } = require("./lib/log");

mediator.once(events.FATAL_ERROR, teardown);

mediator.once(events.SHUT_DOWN, teardown);

process.on("uncaughtException", (err) => {
  if (
    isString(err.message) &&
    err.message.includes("ETELEGRAM: 409 Conflict")
  ) {
    warn(err);
    return;
  }

  error(err);
  teardown();
});

setup();
