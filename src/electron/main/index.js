const { app, ipcMain, globalShortcut } = require("electron");
const { createWindow } = require("./window");
const {
  getDirectories,
  getFiles,
  getDemoRangeFolders,
  readRangeFile,
  readFile,
  writeFile,
  exists,
  findDirectories,
  findFiles,
  getDemoRangePath,
  getFilesAndFolders,
  openFolder,
} = require("./fileSystem");

function registerShortcuts(mainWindow) {
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    mainWindow.webContents.isDevToolsOpened()
      ? mainWindow.webContents.closeDevTools()
      : mainWindow.webContents.openDevTools();
  });
}

function setupIPC() {
  ipcMain.handle(
    "get-files-and-folders",
    async (event, dirPath) => await getFilesAndFolders(dirPath)
  );
  ipcMain.handle(
    "get-directories",
    async (event, source) => await getDirectories(source)
  );
  ipcMain.handle("get-files", async (event, source) => await getFiles(source));
  ipcMain.handle("get-demorange-path", () => getDemoRangePath()); // 移除 async
  ipcMain.handle(
    "get-demorange-folders",
    async () => await getDemoRangeFolders()
  );
  ipcMain.handle(
    "read-range-file",
    async (event, filePath) => await readRangeFile(filePath)
  );

  ipcMain.handle(
    "fs:readFile",
    async (event, filePath, encoding) => await readFile(filePath, encoding)
  );
  ipcMain.handle(
    "fs:writeFile",
    async (event, filePath, content, encoding) =>
      await writeFile(filePath, content, encoding)
  );
  ipcMain.handle(
    "fs:exists",
    async (event, filePath) => await exists(filePath)
  );
  ipcMain.handle(
    "fs:findDirectories",
    async (event, dirPath) => await findDirectories(dirPath)
  );
  ipcMain.handle(
    "fs:findFiles",
    async (event, dirPath) => await findFiles(dirPath)
  );
  ipcMain.handle("open-folder", async (event, path) => await openFolder(path));

  ipcMain.handle("close-window", () => app.quit());
}

app.whenReady().then(() => {
  const mainWindow = createWindow();
  registerShortcuts(mainWindow);
  setupIPC();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
