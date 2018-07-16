/* eslint-disable no-console */
const chalk = require('chalk');

const { log } = console;

module.exports = {
  error: msg => log(chalk.bold.red(msg)),
  info: msg => log(chalk.white(msg)),
  warn: msg => log(chalk.yellow(msg)),
  title: msg => log(chalk.bold.magenta.bgWhite(`\n\t  ${msg}  \n`)),
  message: msg => log(chalk.green(msg)),
};
