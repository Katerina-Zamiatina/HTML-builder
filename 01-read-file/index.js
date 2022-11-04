const fs = require("fs").promises;
const path = require("path");
const { stdout } = process;

const textPath = path.join(__dirname, "text.txt");

fs.readFile(textPath)
  .then((data) => stdout.write(data.toString()))
  .catch((err) => console.log("ERROR", err));
