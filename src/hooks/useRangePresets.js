import { ref, onMounted } from "vue";

export function useRangePresets() {
  const mainButtons = ref([]);
  const subButtonsMap = ref({});

  const loadPresets = async () => {
    try {
      const demoRangePath = await window.electronAPI.getDemoRangePath();
      const folders = await window.electronAPI.getDemoRangeFolders();

      // 存储主文件夹，确保直接使用字符串值而不是Proxy对象
      mainButtons.value = folders.map((folder) => ({
        name: String(folder),
        path: `${demoRangePath}/${String(folder)}`,
        isFile: false,
        isFolder: true,
      }));

      // 加载每个主文件夹的内容
      for (const folder of mainButtons.value) {
        await loadSubButtons(folder);
      }
    } catch (error) {
      console.error("Error loading presets:", error);
    }
  };

  const loadSubButtons = async (folder) => {
    const currentPath = String(folder.path);

    try {
      // 获取文件和目录
      const items = await window.electronAPI.getFilesAndFolders(currentPath);

      if (!items) {
        console.warn("No items found for path:", currentPath);
        return;
      }

      // 处理文件和目录，确保使用字符串值
      const processedItems = items.map((item) => {
        const isFile = item.isFile;
        const name = isFile ? item.name.replace(".txt", "") : item.name;
        return {
          name: name,
          path: `${currentPath}/${name}${isFile ? ".txt" : ""}`,
          isFile: isFile,
          isFolder: !isFile,
        };
      });

      // 更新 subButtonsMap，使用字符串作为键
      subButtonsMap.value[currentPath] = processedItems;

      // 递归处理文件夹
      for (const item of processedItems) {
        if (item.isFolder) {
          await loadSubButtons(item);
        }
      }
    } catch (error) {
      console.error(`Error loading sub-buttons for ${currentPath}:`, error);
    }
  };

  onMounted(() => {
    loadPresets();
  });

  const getSubButtons = (path) => {
    // 确保使用字符串作为键
    const normalizedPath = String(path);
    const buttons = subButtonsMap.value[normalizedPath] || [];
    return buttons;
  };

  const reloadPresets = async () => {
    mainButtons.value = [];
    subButtonsMap.value = {};
    await loadPresets();
  };

  return {
    mainButtons,
    getSubButtons,
    reloadPresets,
  };
}
