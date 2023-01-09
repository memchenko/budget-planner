require("./config");
require("./services/errors");

const { mediator, events } = require("./services/mediator");
const { setup } = require("./setup");
const { teardown } = require("./teardown");
const { error } = require("./lib/log");

mediator.once(events.FATAL_ERROR, teardown);

mediator.once(events.SHUT_DOWN, teardown);

process.on("uncaughtException", (err) => {
  error(err);
  teardown();
});

setup();
