<template>
  <div class="preset-container">
    <div class="preset-header">
      <h3 class="preset-title">预设范围</h3>
      <button class="refresh-button" @click="handleRefresh" title="刷新预设">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
    <div class="presets-list">
      <PresetButton
        v-for="btn in mainButtons"
        :key="btn.path"
        :button="btn"
        @select-preset="handlePresetSelect"
      />
    </div>

    <!-- 添加底部固定按钮 -->
    <div class="add-button-container">
      <button
        class="add-button"
        :disabled="isLoading"
        @click="handleAddFile"
        :title="buttonState === 'default' ? '添加预设文件' : '完成添加'"
      >
        <!-- 默认状态 -->
        <template v-if="buttonState === 'default'">
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>添加预设</span>
        </template>

        <!-- Loading状态 -->
        <template v-else-if="buttonState === 'loading'">
          <svg
            class="icon animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          <span>正在打开文件夹...</span>
        </template>

        <!-- 完成状态 -->
        <template v-else-if="buttonState === 'finished'">
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>添加完成</span>
        </template>

        <!-- 刷新状态 -->
        <template v-else-if="buttonState === 'refreshing'">
          <svg
            class="icon animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          <span>正在刷新预设...</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRangePresets } from "../hooks/useRangePresets";
import PresetButton from "./PresetButton.vue";

const emit = defineEmits(["select-range"]);
const { mainButtons, reloadPresets } = useRangePresets();
const buttonState = ref("default");
const isLoading = ref(false);

const handlePresetSelect = async (filePath) => {
  try {
    const content = await window.electronAPI.readRangeFile(filePath);
    const ranges = parseRangeContent(content);
    emit("select-range", ranges);
  } catch (error) {
    console.error("Error reading range file:", error);
  }
};

const handleRefresh = () => {
  reloadPresets();
};

const parseRangeContent = (content) => {
  const ranges = {};
  const hands = content.split(",");

  hands.forEach((hand) => {
    if (hand.includes(":")) {
      const [cards, weight] = hand.split(":");
      ranges[cards] = parseFloat(weight);
    } else {
      ranges[hand] = 1; // 默认权重为1
    }
  });

  return ranges;
};

const handleAddFile = async () => {
  if (isLoading.value) return;

  try {
    if (buttonState.value === "finished") {
      // 如果当前是完成状态，则刷新预设
      buttonState.value = "refreshing";
      isLoading.value = true;
      await reloadPresets();
      buttonState.value = "default";
      return;
    }

    // 打开文件夹流程
    buttonState.value = "loading";
    isLoading.value = true;
    const demoRangePath = await window.electronAPI.getDemoRangePath();
    await window.electronAPI.openFolder(demoRangePath);
    buttonState.value = "finished";
  } catch (error) {
    console.error("Error in handleAddFile:", error);
    buttonState.value = "default";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.preset-container {
  @apply bg-gray-900/80 backdrop-blur-lg p-5 rounded-xl shadow-lg w-64
         border border-gray-700/50
         h-screen min-h-[400px];
}

.preset-header {
  @apply flex justify-between items-center mb-4;
}

.preset-title {
  @apply text-white text-lg font-medium;
}

.refresh-button {
  @apply p-1.5 rounded-lg 
         bg-gray-800/50 hover:bg-gray-700/50 
         transition-all duration-200 
         text-gray-400 hover:text-white
         active:scale-95;
}

.refresh-button .icon {
  @apply w-5 h-5;
}

.presets-list {
  @apply flex flex-col gap-1;
}

.add-button-container {
  @apply fixed bottom-5 w-[calc(100%-2.5rem)];
}

.add-button {
  @apply w-full flex items-center justify-center gap-2
         bg-blue-600 hover:bg-blue-700 
         text-white font-medium
         py-2 px-4 rounded-lg
         transition-all duration-200
         active:scale-95;
  min-height: 40px; /* 添加固定高度 */
}

.add-button .icon {
  @apply w-5 h-5;
}

.add-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.add-button svg {
  @apply w-5 h-5 flex-shrink-0; /* 防止图标变形 */
}

.add-button span {
  @apply flex-shrink-0 text-sm whitespace-nowrap; /* 防止文字压缩 */
}
</style>
