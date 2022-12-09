const { mediator, events } = require("./services/mediator");
const { setup } = require("./setup");
const { teardown } = require("./teardown");
const { backup } = require("./scripts/backup");

mediator.once(events.FATAL_ERROR, teardown);

mediator.once(events.SHUT_DOWN, teardown);

mediator.once(events.BACKUP, backup);

setup();
