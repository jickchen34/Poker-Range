import { ref, onMounted } from "vue";

export function useRangePresets() {
  const mainButtons = ref([]);
  const subButtonsMap = ref({});

  const loadPresets = async () => {
    try {
      const folders = await window.electronAPI.getDemoRangeFolders();
      mainButtons.value = folders;

      for (const folder of folders) {
        const files = await window.electronAPI.getDemoRangeFiles(folder);
        subButtonsMap.value[folder] = files
          .filter((file) => file.endsWith(".txt"))
          .map((file) => file.replace(".txt", ""));
      }
    } catch (error) {
      console.error("Error loading presets:", error);
    }
  };

  onMounted(() => {
    loadPresets();
  });

  return {
    mainButtons,
    getSubButtons: (mainBtn) => subButtonsMap.value[mainBtn] || [],
  };
}
