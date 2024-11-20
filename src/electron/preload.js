const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readRangeFile: (filePath) => ipcRenderer.invoke("read-range-file", filePath),
  getDemoRangeFolders: () => ipcRenderer.invoke("get-demorange-folders"),
  getDemoRangeFiles: (folder) =>
    ipcRenderer.invoke("get-demorange-files", folder),
  closeWindow: () => ipcRenderer.invoke("close-window"),
  getDirectories: async (source) =>
    ipcRenderer.invoke("get-directories", source),
  getFiles: async (source) => ipcRenderer.invoke("get-files", source),
});
