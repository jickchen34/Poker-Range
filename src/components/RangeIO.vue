<template>
  <div class="range-io-panel bg-[#2C2C2E] rounded-lg p-4 border border-mac-border">
    <h3 class="text-white font-bold mb-4 text-lg">范围管理</h3>
    
    <div class="space-y-3">
      <!-- 导出按钮 -->
      <button
        class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        @click="handleExport"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        导出 JSON
      </button>
      
      <!-- 导入按钮 -->
      <button
        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        @click="handleImportClick"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        导入 JSON
      </button>
      
      <!-- 隐藏的文件输入 -->
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleFileChange"
      />
      
      <!-- 状态消息 -->
      <div v-if="statusMessage" :class="statusType" class="text-sm text-center py-2 rounded">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["import-range"]);

const fileInput = ref(null);
const statusMessage = ref("");
const statusType = ref("");

const handleExport = () => {
  try {
    const dataToExport = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      ...props.tableData,
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `poker-range-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showStatus("导出成功！", "text-green-400");
  } catch (error) {
    console.error("Export error:", error);
    showStatus("导出失败", "text-red-400");
  }
};

const handleImportClick = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      emit("import-range", data);
      showStatus("导入成功！", "text-green-400");
    } catch (error) {
      console.error("Import error:", error);
      showStatus("导入失败：无效的 JSON 格式", "text-red-400");
    }
  };

  reader.onerror = () => {
    showStatus("读取文件失败", "text-red-400");
  };

  reader.readAsText(file);
  event.target.value = ""; // 重置文件输入
};

const showStatus = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
  setTimeout(() => {
    statusMessage.value = "";
    statusType.value = "";
  }, 3000);
};
</script>
