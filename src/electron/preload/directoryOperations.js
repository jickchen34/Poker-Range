const { ipcRenderer } = require("electron");

// 添加需要过滤的文件列表
const FILTERED_FILES = [".DS_Store"];

const directoryOperations = {
  getFilesAndFolders: async (directoryPath) => {
    const items = await ipcRenderer.invoke(
      "get-files-and-folders",
      directoryPath
    );
    // 过滤掉 .DS_Store 等系统文件
    return items.filter((item) => !FILTERED_FILES.includes(item.name));
  },
  getDemoRangePath: () => ipcRenderer.invoke("get-demorange-path"),
  getDemoRangeFolders: async () => {
    const folders = await ipcRenderer.invoke("get-demorange-folders");
    // 同样过滤掉系统文件
    return folders.filter((folder) => !FILTERED_FILES.includes(folder));
  },
  getDirectories: (source) => ipcRenderer.invoke("get-directories", source),
  getFiles: (source) => ipcRenderer.invoke("get-files", source),
  openFolder: (path) => ipcRenderer.invoke("open-folder", path),
};

module.exports = directoryOperations;
