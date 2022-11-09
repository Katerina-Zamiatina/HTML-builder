const fs = require("fs").promises;
const path = require("path");

const copyDirPath = path.join(__dirname, "files-copy");
const sourceDirPath = path.resolve(__dirname, "files");

async function copyDirectory(source, destination) {
  try {
    const entryFiles = await fs.readdir(source, { withFileTypes: true });
    await fs.mkdir(destination, { recursive: true });
    const copy = await fs.readdir(copyDirPath);

    if (copy) {
        copy.forEach(async (file) => {
          const filePath = path.join(destination, file);
          await fs.unlink(filePath);
        });
      }

    entryFiles.forEach(async (entry) => {
      const entryPath = path.join(source, entry.name);
      const copyFilePath = path.join(destination, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(entryPath, copyFilePath);
      } else {
        await fs.copyFile(entryPath, copyFilePath);
      }
    });
  } catch (error) {
    console.error("ERROR", error);
  }
}

copyDirectory(sourceDirPath, copyDirPath);

// delete copyDir

// fs.unlink("files in directory", ()=>{
//  fs.rmdir("directory")
// })
