async function runInSequence(promisesFactories) {
  const factory = promisesFactories.shift();

  if (!factory) {
    return;
  }

  await factory();

  return await runInSequence(promisesFactories);
}

module.exports = {
  runInSequence,
};
