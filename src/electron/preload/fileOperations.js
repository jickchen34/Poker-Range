const { ipcRenderer, shell } = require("electron");
const { getDemoRangePath } = require("./directoryOperations");

let isOpening = false;
let folderMonitor = null;

const fileOperations = {
  readRangeFile: (filePath) => ipcRenderer.invoke("read-range-file", filePath),
  getFileStats: (filePath) => ipcRenderer.invoke("get-file-stats", filePath),
  getDemoRangePath,
  openDemoRangeFolder: async () => {
    if (isOpening) return Promise.resolve();

    try {
      isOpening = true;
      const demoRangePath = await getDemoRangePath();
      await shell.openPath(demoRangePath);

      // 返回一个 Promise，通过监控文件夹访问来判断是否关闭
      return new Promise((resolve) => {
        let lastAccessFailed = false;

        folderMonitor = setInterval(async () => {
          try {
            await shell.openPath(demoRangePath);
            lastAccessFailed = false;
          } catch (error) {
            // 如果连续两次无法访问文件夹，认为文件夹已关闭
            if (lastAccessFailed) {
              clearInterval(folderMonitor);
              isOpening = false;
              resolve();
            }
            lastAccessFailed = true;
          }
        }, 1000);
      });
    } catch (error) {
      isOpening = false;
      throw error;
    }
  },
};

module.exports = fileOperations;
