const { EventEmitter } = require("node:events");

const events = require("./constants");

module.exports = {
  events,
  mediator: new EventEmitter(),
};
