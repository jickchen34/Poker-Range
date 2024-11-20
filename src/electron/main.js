const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs").promises;

// 添加配置项
const isDev = process.env.NODE_ENV === "development";
const AUTO_OPEN_DEVTOOLS = false; // 控制是否自动打开开发者工具

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 注册快捷键
  app.whenReady().then(() => {
    // 注册 Command/Control + Shift + I 快捷键
    globalShortcut.register("CommandOrControl+Shift+I", () => {
      // 如果开发者工具打开则关闭，如果关闭则打开
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools();
      }
    });
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    // 根据配置决定是否打开开发者工具
    AUTO_OPEN_DEVTOOLS && mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 在应用退出时注销所有快捷键
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("some-channel", (event, arg) => {
  console.log(arg);
  event.reply("some-channel-reply", "pong");
});

// 移除 get-range-folders 和 get-range-files 的handler
ipcMain.handle("get-directories", async (event, source) => {
  const rootPath = isDev
    ? path.join(__dirname, "../../src")
    : path.join(__dirname, "../");
  const sourcePath = source.replace("@/", "");
  const fullPath = path.join(rootPath, sourcePath);

  try {
    const items = await fs.readdir(fullPath, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
  } catch (error) {
    console.error("Error reading directories:", error);
    return [];
  }
});

ipcMain.handle("get-files", async (event, source) => {
  const rootPath = isDev
    ? path.join(__dirname, "../../src")
    : path.join(__dirname, "../");
  const sourcePath = source.replace("@/", "");
  const fullPath = path.join(rootPath, sourcePath);

  try {
    const items = await fs.readdir(fullPath, { withFileTypes: true });
    return items.filter((item) => item.isFile()).map((file) => file.name);
  } catch (error) {
    console.error("Error reading files:", error);
    return [];
  }
});

// 保留新的IPC处理程序
ipcMain.handle("get-demorange-folders", async () => {
  const demoRangePath = path.join(
    __dirname,
    isDev ? "../../src/demoRange" : "../demoRange"
  );
  try {
    const items = await fs.readdir(demoRangePath, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
  } catch (error) {
    console.error("Error reading demoRange folders:", error);
    return [];
  }
});

ipcMain.handle("get-demorange-files", async (event, folder) => {
  const folderPath = path.join(
    __dirname,
    isDev ? "../../src/demoRange" : "../demoRange",
    folder
  );
  try {
    const files = await fs.readdir(folderPath);
    return files.filter((file) => file.endsWith(".txt"));
  } catch (error) {
    console.error("Error reading demoRange files:", error);
    return [];
  }
});

// 使用这个新的统一的read-range-file handler
ipcMain.handle("read-range-file", async (event, filePath) => {
  const fullPath = path.join(
    __dirname,
    isDev ? "../../src/demoRange" : "../demoRange",
    filePath
  );
  try {
    const content = await fs.readFile(fullPath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading range file:", error);
    return "";
  }
});

// 添加处理关闭窗口的 IPC 处理程序
ipcMain.handle("close-window", () => {
  app.quit();
});
