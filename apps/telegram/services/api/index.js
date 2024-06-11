const fastify = require("fastify");

const { events, mediator } = require("../mediator");
const { api } = require("../../config");

const server = fastify({ logger: true });

server.get("/shutdown", () => {
  mediator.emit(events.SHUT_DOWN);
  return null;
});

async function start() {
  try {
    await server.listen({ port: api.port });
  } catch (err) {
    fastify.log.error(err);
    mediator.emit(events.FATAL_ERROR);
  }
}

module.exports = start();
