const fs = require("fs");
const path = require("path");
const { stdout } = process;

const textPath = path.join(__dirname, "text.txt");
const fileStream = fs.createReadStream(textPath, "utf8");

fileStream.on('data', data=> stdout.write(data))

// fs.promises
//   .readFile(textPath)
//   .then((data) => stdout.write(data.toString()))
//   .catch((err) => console.log("ERROR", err));
