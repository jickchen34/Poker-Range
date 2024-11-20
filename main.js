const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;

// ...existing code...

// 添加文件读取处理
ipcMain.handle("read-range-file", async (event, filePath) => {
  try {
    const fullPath = path.join(__dirname, "demoRange", filePath);
    const content = await fs.readFile(fullPath, "utf-8");
    return content.trim();
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
});

// ...existing code...
