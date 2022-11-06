const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const stylePath = path.join(__dirname, "styles");
const distPath = path.join(__dirname, "project-dist/bundle.css");
const bundleStream = fs.createWriteStream(distPath);

async function createBundleCss(source) {
  try {
    const files = await fs.promises.readdir(source, {
      withFileTypes: true,
    });

    files.forEach(async (file) => {
      const filePath = path.join(source, file.name);
      const fileName = file.name;
      const ext = path.extname(fileName).slice(1);

      if (file.isDirectory()) {
        await createBundleCss(filePath);
      }

      if (ext === "css") {
        const fileContent = fs.createReadStream(filePath);
        fileContent.on("data", (data) => {
          let content = data.toString() + "\n";
          bundleStream.write(content);
        });
      }
    });
  } catch (error) {
    console.error(chalk.red("ERROR", error));
  }
}

createBundleCss(stylePath);
