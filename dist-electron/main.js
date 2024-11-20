"use strict";
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const isDev = process.env.NODE_ENV === "development";
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });
  app.whenReady().then(() => {
    globalShortcut.register("CommandOrControl+Shift+I", () => {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools();
      }
    });
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
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
ipcMain.handle("get-directories", async (event, source) => {
  const rootPath = isDev ? path.join(__dirname, "../../src") : path.join(__dirname, "../");
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
  const rootPath = isDev ? path.join(__dirname, "../../src") : path.join(__dirname, "../");
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
ipcMain.handle("close-window", () => {
  app.quit();
});
