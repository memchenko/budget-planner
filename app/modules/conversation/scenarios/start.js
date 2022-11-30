const { Scenario } = require("../lib/Scenario");

const gui = require("../../gui");
const user = require("../../../entities/user");
const { commands } = require("../../../lib/commands");

const scenario = new Scenario(commands.START.command);

scenario.on(Scenario.COMPLETED, async ({ userId }) => {
  const existingUser = await user.find({ tgId: userId });

  if (!existingUser) {
    await user.create({ tgId: userId, balance: 0 });
  }

  gui.respondWithCommands({ userId });
});

module.exports = { scenario };
