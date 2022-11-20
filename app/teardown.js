function teardown() {
  console.error("Begin graceful teardown");

  // TODO send message to users like "Maintenance. Sorry for inconvenience"
  // TODO write somewhere state that the server was shut down
  // TODO disconnect from DB
  // TODO stop the process

  console.error("End graceful teardown");
}

module.exports = {
  teardown,
};
