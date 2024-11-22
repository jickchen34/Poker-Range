const { BrowserWindow } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";
const AUTO_OPEN_DEVTOOLS = false;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    AUTO_OPEN_DEVTOOLS && mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../../dist/index.html"));
  }

  return mainWindow;
}

module.exports = {
  createWindow,
};
