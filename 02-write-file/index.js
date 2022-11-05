const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;
const chalk = require("chalk");

const textPath = path.join(__dirname, "text.txt");

const newStream = fs.createWriteStream(textPath);
stdout.write(chalk.redBright("\nWrite what you want\n"));

stdin.on("data", (data) => {
  let inputData = data.toString();
  if (inputData.trim() === "exit") {
    process.exit();
  }
  newStream.write(inputData);
});

process.on("SIGINT", () => {
  process.exit();
});

process.on("exit", () => stdout.write(chalk.yellowBright("\n  GOOD LUCK!  \n")));
