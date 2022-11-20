const { mediator, events } = require("./services/mediator");
const { setup } = require("./setup");
const { teardown } = require("./teardown");

mediator.once(events.FATAL_ERROR, teardown);

setup();
