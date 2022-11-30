const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.HELP.command);

scenario.on(Scenario.COMPLETED, async ({ userId }) => {
  gui.respondWithCommands({ userId });
});

module.exports = { scenario };
