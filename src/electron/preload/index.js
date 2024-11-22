const { contextBridge } = require("electron");
const fileOperations = require("./fileOperations");
const directoryOperations = require("./directoryOperations");
const windowOperations = require("./windowOperations");

contextBridge.exposeInMainWorld("electronAPI", {
  ...fileOperations,
  ...directoryOperations,
  ...windowOperations,
});
