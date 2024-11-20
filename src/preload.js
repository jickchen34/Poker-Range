const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("electronAPI", {
  // ...existing code...

  getDirectories: async (source) =>
    ipcRenderer.invoke("get-directories", source),

  getFiles: async (source) => ipcRenderer.invoke("get-files", source),
});
