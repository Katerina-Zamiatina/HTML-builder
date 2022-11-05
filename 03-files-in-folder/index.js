const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const folderPath = path.join(__dirname, "secret-folder");

async function showFileList() {
  try {
    await fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
      data.forEach((file) => {
        const filePath = path.resolve(__dirname, "secret-folder", file.name);
        fs.stat(filePath, (err, stats) => {
          let fileInfo = [];
          const fileName = file.name.split(".").slice(0, 1).join(".");
          const extension = path.extname(file.name).slice(1);
          const size = stats.size;
          fileInfo.push(fileName, extension, size);

          console.log(chalk.green(fileInfo.join(" - ")));
        });
      });
    });
  } catch (err) {
    console.error(chalk.red("ERROR: \n"), err.message);
  }
}

showFileList();
