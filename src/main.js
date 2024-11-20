import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

createApp(App).mount("#app");

const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs").promises;
const path = require("path");

// ...existing code...

ipcMain.handle("get-directories", async (event, source) => {
  const items = await fs.readdir(path.join(__dirname, source), {
    withFileTypes: true,
  });
  return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
});

ipcMain.handle("get-files", async (event, source) => {
  const items = await fs.readdir(path.join(__dirname, source), {
    withFileTypes: true,
  });
  return items.filter((item) => item.isFile()).map((file) => file.name);
});

// ...existing code...
