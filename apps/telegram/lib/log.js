const chalk = require("chalk");
const { pipe } = require("lodash/fp");

module.exports.success = pipe(chalk.green, console.log);

module.exports.info = pipe(chalk.blue, console.log);

module.exports.error = pipe(chalk.red, console.log);

module.exports.warn = pipe(chalk.yellow, console.log);
