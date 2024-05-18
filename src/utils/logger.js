import chalk from "chalk";
import terminalLink from "terminal-link";
import { config } from "../../config.js";
const { IS_TEST } = config;

function logIfNotTest(message) {
  if (IS_TEST) {
    return;
  }
  console.log(message);
}

export function logGrey(message) {
  logIfNotTest(chalk.grey(message));
}

export function logYellow(message) {
  logIfNotTest(chalk.yellow(message));
}

export function logRed(message) {
  logIfNotTest(chalk.red(message));
}

export function logGreen(message) {
  logIfNotTest(chalk.green(message));
}

export function logBlue(message) {
  logIfNotTest(chalk.blue(message));
}

export function logLink(url, anchorText, message, duration) {
  if (IS_TEST) {
    return;
  }
  logGrey("-----------");
  let text = "";
  if (duration) {
    text += chalk.green.bold(`Took (${duration.toLocaleString()} ms).`);
  }
  if (message) {
    text += chalk.blue.bold(message);
  }
  if (anchorText) {
    text += chalk.yellow(` ` + anchorText);
  }
  console.log(terminalLink(text, url));
  logGrey("-----------");
}
