<script setup>
import { ref, watchEffect } from "vue";
import { useRangePresets } from "../hooks/useRangePresets"; // 使用相对路径

const emit = defineEmits(["select-range"]);
const activeMainBtn = ref("");
const { mainButtons, getSubButtons } = useRangePresets();
const selectedPreset = ref("");

const handleMainClick = (btn) => {
  activeMainBtn.value = activeMainBtn.value === btn ? "" : btn;
};

const handleSubClick = async (mainBtn, subBtn) => {
  selectedPreset.value = `${mainBtn}/${subBtn}`;

  try {
    // 通过 electron 的 IPC 获取文件内容
    const content = await window.electronAPI.readRangeFile(
      `${mainBtn}/${subBtn}.txt`
    );
    const ranges = parseRangeContent(content);
    emit("select-range", ranges);
  } catch (error) {
    console.error("Error reading range file:", error);
  }
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
</script>

<template>
  <div class="bg-mac-panel backdrop-blur-mac p-5 rounded-xl shadow-lg w-56">
    <h3 class="text-white text-lg font-medium mb-4">预设范围</h3>
    <div class="flex flex-col gap-2">
      <div
        v-for="mainBtn in mainButtons"
        :key="mainBtn"
        class="flex flex-col gap-1"
      >
        <button
          class="px-4 py-2 rounded-lg border border-mac-border bg-mac-hover text-white hover:bg-mac-hover/80 transition-colors"
          :class="{ 'bg-mac-blue border-mac-blue': activeMainBtn === mainBtn }"
          @click="handleMainClick(mainBtn)"
        >
          {{ mainBtn.toUpperCase() }}
        </button>

        <div v-if="activeMainBtn === mainBtn" class="ml-3 flex flex-col gap-1">
          <button
            v-for="subBtn in getSubButtons(mainBtn)"
            :key="subBtn.path"
            class="sub-button"
            :class="{ active: selectedPreset === subBtn.path }"
            @click="handleSubClick(mainBtn, subBtn.path)"
          >
            {{ subBtn.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以删除所有 scoped 样式，因为都使用了 Tailwind 类 */
</style>
