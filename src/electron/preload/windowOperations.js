const { ipcRenderer } = require("electron");

const windowOperations = {
  closeWindow: () => ipcRenderer.invoke("close-window"),
};

module.exports = windowOperations;
