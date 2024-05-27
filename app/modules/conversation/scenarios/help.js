const { Scenario } = require("../lib/Scenario");

const telegram = require("../../telegram");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.HELP.command);

scenario.on(Scenario.COMPLETED, async ({ userId }) => {
  telegram.respondWithCommands({ userId });
});

module.exports = { scenario };
