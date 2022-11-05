const fs = require("fs").promises;
// const fsProm = fs.promises;
const path = require("path");
const chalk = require("chalk");

const folderPath = path.join(__dirname, "secret-folder");

// showFilesList refactor

async function showFilesList() {
  try {
    const data = await fs.readdir(folderPath, { withFileTypes: true });

    data.forEach(async (file) => {
      if (!file.isDirectory()) {
        let fileData = [];
        const filePath = path.resolve(__dirname, "secret-folder", file.name);
        const fileName = file.name.split(".").slice(0, 1).join(".");
        const extension = path.extname(file.name).slice(1);

        const stats = await fs.stat(filePath);
        const size = (Number(stats.size) / 2000).toFixed(3) + "kb";
        fileData.push(fileName, extension, size);
        console.log(chalk.green(fileData.join(" - ")));
      }
    });
  } catch (error) {
    console.error(chalk.red("ERROR: \n"), err.message);
  }
}

showFilesList();

// async function showFileList() {
//   try {
//     await fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
//       data.forEach((file) => {

//         if (file.isFile()) {
//           const filePath = path.resolve(__dirname, "secret-folder", file.name);
//           fs.stat(filePath, (err, stats) => {
//             let fileInfo = [];
//             const fileName = file.name.split(".").slice(0, 1).join(".");
//             const extension = path.extname(file.name).slice(1);
//             const size = stats.size;

//             fileInfo.push(fileName, extension, size);

//             console.log(chalk.green(fileInfo.join(" - ")));
//           });
//         }
//       });
//     });
//   } catch (err) {
//     console.error(chalk.red("ERROR: \n"), err.message);
//   }
// }

// showFileList();
