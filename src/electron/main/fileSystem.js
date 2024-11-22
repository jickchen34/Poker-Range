const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises; // 添加 promises API
const os = require("os");
const { exec } = require("child_process");

const isDev = process.env.NODE_ENV === "development";

function getDemoRangePath() {
  return path.join(
    __dirname,
    isDev ? "../../../src/demoRange" : "../../demoRange"
  );
}

async function getDirectories(source) {
  const rootPath = getDemoRangePath();
  const sourcePath = source.replace("@/", "");
  const fullPath = path.join(rootPath, sourcePath);

  try {
    const items = await fsPromises.readdir(fullPath, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
  } catch (error) {
    console.error("Error reading directories:", error);
    return [];
  }
}

async function getFiles(source) {
  const rootPath = isDev
    ? path.join(__dirname, "../../../src")
    : path.join(__dirname, "../../");
  const sourcePath = source.replace("@/", "");
  const fullPath = path.join(rootPath, sourcePath);

  try {
    const items = await fsPromises.readdir(fullPath, { withFileTypes: true });
    return items.filter((item) => item.isFile()).map((file) => file.name);
  } catch (error) {
    console.error("Error reading files:", error);
    return [];
  }
}

async function readFile(filePath, encoding = "utf8") {
  try {
    const data = await fsPromises.readFile(filePath, encoding);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function writeFile(filePath, content, encoding = "utf8") {
  try {
    await fsPromises.writeFile(filePath, content, encoding);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function exists(filePath) {
  try {
    const exists = await fsPromises
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    return { success: true, exists };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function findDirectories(dirPath) {
  try {
    const items = await fsPromises.readdir(dirPath, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function findFiles(dirPath) {
  try {
    const items = await fsPromises.readdir(dirPath, { withFileTypes: true });
    return items.filter((item) => item.isFile()).map((file) => file.name);
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getDemoRangeFolders() {
  const demoRangePath = getDemoRangePath();
  try {
    const items = await fsPromises.readdir(demoRangePath, {
      withFileTypes: true,
    });
    return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
  } catch (error) {
    console.error("Error reading demoRange folders:", error);
    return [];
  }
}

//获取一个路径下的所有文件和目录
async function getFilesAndFolders(dirPath) {
  try {
    const items = await fsPromises.readdir(dirPath, { withFileTypes: true });
    return items.map((item) => ({
      name: item.name,
      isFile: item.isFile(),
      isFolder: item.isDirectory(),
    }));
  } catch (error) {
    console.error("Error reading files and folders:", error);
    return [];
  }
}

async function readRangeFile(filePath) {
  const fullPath = path.join(
    __dirname,
    isDev ? "../../../src/demoRange" : "../../demoRange",
    filePath
  );
  try {
    const content = await fsPromises.readFile(fullPath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading range file:", error);
    return "";
  }
}

async function openFolder(folderPath) {
  return new Promise((resolve, reject) => {
    try {
      if (!folderPath || !fs.existsSync(folderPath)) {
        return reject(new Error("文件夹不存在"));
      }

      const command =
        os.platform() === "win32"
          ? `start "" "${folderPath}"`
          : os.platform() === "darwin"
          ? `open "${folderPath}"`
          : `xdg-open "${folderPath}"`;

      exec(command, (error) => {
        if (error) {
          return reject(new Error(`无法打开文件夹: ${error.message}`));
        }
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = openFolder;

module.exports = {
  getDirectories,
  getFiles,
  getDemoRangeFolders,
  readRangeFile,
  readFile,
  writeFile,
  exists,
  findDirectories,
  findFiles,
  getFilesAndFolders,
  getDemoRangePath,
  openFolder,
};
