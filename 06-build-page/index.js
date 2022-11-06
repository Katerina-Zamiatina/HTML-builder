const fs = require("fs");
const path = require("path");

const projectDistPath = path.join(__dirname, "project-dist");

fs.promises.mkdir(projectDistPath, { recursive: true });

// Copy assets to project-dist/assets

const assetsDirPath = path.resolve(__dirname, "assets");
const assetsCopyPath = path.join(__dirname, "project-dist/assets");

async function copyDirectory(source, destination) {
  try {
    const entryFiles = await fs.promises.readdir(source, {
      withFileTypes: true,
    });
    await fs.promises.mkdir(destination, { recursive: true });

    entryFiles.forEach(async (entry) => {
      const entryPath = path.join(source, entry.name);
      const assetsCopyPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(entryPath, assetsCopyPath);
      } else {
        await fs.promises.copyFile(entryPath, assetsCopyPath);
      }
    });
  } catch (error) {
    console.error("ERROR", error);
  }
}

copyDirectory(assetsDirPath, assetsCopyPath);

// Combine styles to project-dist/style.css

const stylePath = path.join(__dirname, "styles");
const distPath = path.join(__dirname, "project-dist/style.css");

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
    console.error("ERROR", error);
  }
}

createBundleCss(stylePath);

// Create index.html from template.html

const templatePath = path.join(__dirname, "template.html");
const htmlDistPath = path.join(projectDistPath, "index.html");
const componentsPath = path.join(__dirname, "components");

let str = "";

async function createHtml() {
  try {
    const data = fs.createReadStream(templatePath, "utf8");
    const htmlDist = fs.createWriteStream(htmlDistPath);
    const components = await fs.promises.readdir(componentsPath, {
      withFileTypes: true,
    });

    data.on("data", (data) => {
      str = data.toString();
      const arr = [];
      components.forEach((file) => {
        const fileName = file.name.split(".").slice(0, 1).join(".");
        const filePath = path.join(componentsPath, file.name);
        const content = fs.createReadStream(filePath, "utf8");
        arr.push(`{{${fileName}}}`);

        content.forEach((file, idx) => {
          const fileStream = fs.createReadStream(filePath, "utf8");
          console.log(fileStream);
          fileStream.on("data", (data) => {
            if (str.includes(fileName)) {
              str = str.replace(`{{${fileName}}}`, data);
            }
            console.log("STRING", str);
            if (!arr.find((el) => str.includes(el))) {
              htmlDist.write(str);
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("ERROR: ", error);
  }
}

createHtml();
