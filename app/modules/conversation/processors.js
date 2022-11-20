const gui = require("../gui");
const state = require("../../entities/state");
const scenario = require("./scenarios");

async function processCommand({ userId, command }) {
  await state.reset({ userId });
  await state.setState({ userId, state: command });

  return scenario[command].onCommand({ userId, command });
}

async function processMessage({ userId, text }) {
  const currentState = await state.find({ userId });
  const commandInProgress = currentState.state;
  const responsesLength = currentState.responsesList.length;

  if (commandInProgress === null) {
    return;
  }

  const currentProcessor =
    scenario[commandInProgress].onMessage[responsesLength];
  const isFormatValid = currentProcessor.validate(text);

  if (!isFormatValid) {
    const responseForInvalid = currentProcessor.responseForInvalid;

    await gui.respondWithMessage({ userId, text: responseForInvalid });
  } else if (currentProcessor.manualAddResponse) {
    const addResponse = () => state.addResponse({ userId, response: text });

    await currentProcessor.onSuccess({
      userId,
      text,
      addResponse,
    });
  } else {
    const newState = await state.addResponse({ userId, response: text });

    await currentProcessor.onSuccess({
      userId,
      text,
      newState,
    });
  }
}

async function processSelect({ userId, choice }) {
  return await processMessage({ userId, text: choice });
}

module.exports = {
  processCommand,
  processMessage,
  processSelect,
};
