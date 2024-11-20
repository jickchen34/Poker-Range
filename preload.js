const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readRangeFile: (filePath) => ipcRenderer.invoke("read-range-file", filePath),
});
