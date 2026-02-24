<template>
  <div class="range-compare-panel bg-[#2C2C2E] rounded-lg p-4 border border-mac-border">
    <h3 class="text-white font-bold mb-4 text-lg">范围对比</h3>

    <!-- 未加载对比范围时 -->
    <div v-if="!compareData" class="space-y-3">
      <!-- 从 JSON 文件加载 -->
      <button
        class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        @click="handleLoadClick"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        加载对比范围（JSON）
      </button>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileChange" />

      <!-- 从预设范围选择 -->
      <div class="space-y-1">
        <div class="text-white/60 text-xs mb-1">或从预设选择</div>
        <select
          class="w-full bg-[#1E1E1E] text-white rounded-lg px-3 py-2 border border-mac-border text-sm outline-none"
          v-model="selectedPreset"
          @change="handlePresetSelect"
        >
          <option value="">-- 选择预设范围 --</option>
          <optgroup label="BB">
            <option value="bb/BBvBU3bet">BB vs BU 3bet</option>
            <option value="bb/BBvBU4bcall">BB vs BU 4b Call</option>
            <option value="bb/BBvBUcall">BB vs BU Call</option>
            <option value="bb/BBvCO3bet">BB vs CO 3bet</option>
            <option value="bb/BBvCOcall">BB vs CO Call</option>
            <option value="bb/BBvHJ3bet">BB vs HJ 3bet</option>
            <option value="bb/BBvHJ4bcall">BB vs HJ 4b Call</option>
            <option value="bb/BBvHJcall">BB vs HJ Call</option>
            <option value="bb/BBvLJ3bet">BB vs LJ 3bet</option>
            <option value="bb/BBvLJcall">BB vs LJ Call</option>
            <option value="bb/BBvSB3bet">BB vs SB 3bet</option>
            <option value="bb/BBvSB4bcall">BB vs SB 4b Call</option>
            <option value="bb/BBvSBcall">BB vs SB Call</option>
          </optgroup>
        </select>
      </div>

      <div v-if="statusMessage" :class="statusType" class="text-sm text-center py-1 rounded">
        {{ statusMessage }}
      </div>
    </div>

    <!-- 已加载对比范围时：显示统计 -->
    <div v-else class="space-y-4">
      <!-- 对比范围名称 -->
      <div class="text-purple-300 text-sm font-medium truncate" :title="compareLabel">
        📊 {{ compareLabel }}
      </div>

      <!-- 图例 -->
      <div class="space-y-1.5 text-xs">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded border-2 border-red-400 bg-transparent"></div>
          <span class="text-white/80">仅当前范围有（多余）</span>
          <span class="ml-auto text-red-400 font-bold">{{ diffStats.onlyCurrent }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded border-2 border-blue-400 bg-transparent"></div>
          <span class="text-white/80">仅对比范围有（缺少）</span>
          <span class="ml-auto text-blue-400 font-bold">{{ diffStats.onlyCompare }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded bg-green-500/40 border border-green-400"></div>
          <span class="text-white/80">两者共有（重叠）</span>
          <span class="ml-auto text-green-400 font-bold">{{ diffStats.overlap }}</span>
        </div>
      </div>

      <!-- 相似度 -->
      <div class="bg-[#1E1E1E] rounded-lg p-3">
        <div class="text-white/60 text-xs mb-1">相似度</div>
        <div class="text-3xl font-bold text-white">{{ diffStats.similarity }}%</div>
        <div class="mt-2 h-2 bg-[#333] rounded overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
            :style="{ width: diffStats.similarity + '%' }"
          ></div>
        </div>
        <div class="text-white/40 text-xs mt-1">重叠 / 并集 = {{ diffStats.overlap }} / {{ diffStats.union }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-2">
        <!-- 导出 diff -->
        <button
          class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          @click="handleExportDiff"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          导出差异 JSON
        </button>

        <!-- 关闭对比 -->
        <button
          class="w-full py-2 px-4 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-white/80 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          @click="clearCompare"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
          关闭对比
        </button>
      </div>

      <div v-if="statusMessage" :class="statusType" class="text-sm text-center py-1 rounded">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  currentSelectedCells: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["compare-change"]);

const fileInput = ref(null);
const compareData = ref(null); // { selectedCells: {} }
const compareLabel = ref("");
const selectedPreset = ref("");
const statusMessage = ref("");
const statusType = ref("");

// 计算 diff 统计
const diffStats = computed(() => {
  if (!compareData.value) return { onlyCurrent: 0, onlyCompare: 0, overlap: 0, union: 0, similarity: 0 };

  const current = props.currentSelectedCells;
  const compare = compareData.value.selectedCells || {};

  const currentKeys = new Set(Object.keys(current).filter(k => current[k]?.selected));
  const compareKeys = new Set(Object.keys(compare).filter(k => compare[k]?.selected));

  const overlapKeys = [...currentKeys].filter(k => compareKeys.has(k));
  const onlyCurrentKeys = [...currentKeys].filter(k => !compareKeys.has(k));
  const onlyCompareKeys = [...compareKeys].filter(k => !currentKeys.has(k));

  const union = new Set([...currentKeys, ...compareKeys]).size;
  const overlap = overlapKeys.length;
  const similarity = union > 0 ? Math.round((overlap / union) * 100) : 0;

  return {
    onlyCurrent: onlyCurrentKeys.length,
    onlyCompare: onlyCompareKeys.length,
    overlap,
    union,
    similarity,
    onlyCurrentKeys,
    onlyCompareKeys,
    overlapKeys,
  };
});

// 监听 diff 变化，通知父组件更新 RangeTable 叠加
watch(
  [() => props.currentSelectedCells, compareData],
  () => {
    if (!compareData.value) {
      emit("compare-change", null);
      return;
    }
    emit("compare-change", {
      compareSelectedCells: compareData.value.selectedCells || {},
    });
  },
  { deep: true }
);

const handleLoadClick = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.selectedCells) throw new Error("无效格式");
      compareData.value = data;
      compareLabel.value = file.name;
      selectedPreset.value = "";
      showStatus("对比范围加载成功！", "text-green-400");
    } catch {
      showStatus("加载失败：无效的 JSON 格式", "text-red-400");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
};

const handlePresetSelect = async () => {
  if (!selectedPreset.value) return;

  try {
    // 读取预设 txt 文件（格式为 "手牌:权重" 行）
    const response = await fetch(`/src/demoRange/${selectedPreset.value}.txt`);
    if (!response.ok) throw new Error("文件不存在");
    const text = await response.text();

    const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
    const selectedCells = {};

    text.split("\n").forEach((line) => {
      line = line.trim();
      if (!line) return;
      const [hand, weightStr] = line.split(":");
      if (!hand) return;
      const weight = parseFloat(weightStr) || 1;

      const card1 = hand[0];
      const card2 = hand[1];
      const suffix = hand[2] || "";
      const i1 = cards.indexOf(card1);
      const i2 = cards.indexOf(card2);
      if (i1 < 0 || i2 < 0) return;

      if (card1 === card2) {
        selectedCells[`${i1}-${i1}`] = { selected: true, percentage: weight * 100 };
      } else if (suffix === "s") {
        const key = `${Math.min(i1, i2)}-${Math.max(i1, i2)}`;
        selectedCells[key] = { selected: true, percentage: weight * 100 };
      } else if (suffix === "o") {
        const key = `${Math.max(i1, i2)}-${Math.min(i1, i2)}`;
        selectedCells[key] = { selected: true, percentage: weight * 100 };
      } else {
        selectedCells[`${Math.min(i1, i2)}-${Math.max(i1, i2)}`] = { selected: true, percentage: weight * 100 };
        selectedCells[`${Math.max(i1, i2)}-${Math.min(i1, i2)}`] = { selected: true, percentage: weight * 100 };
      }
    });

    compareData.value = { selectedCells };
    compareLabel.value = selectedPreset.value.split("/").pop();
    showStatus("预设范围加载成功！", "text-green-400");
  } catch (err) {
    showStatus("加载预设失败", "text-red-400");
    console.error(err);
  }
};

const clearCompare = () => {
  compareData.value = null;
  compareLabel.value = "";
  selectedPreset.value = "";
  emit("compare-change", null);
};

const handleExportDiff = () => {
  try {
    const stats = diffStats.value;
    const result = {
      exportedAt: new Date().toISOString(),
      similarity: `${stats.similarity}%`,
      overlap: stats.overlap,
      onlyCurrent: stats.onlyCurrent,
      onlyCompare: stats.onlyCompare,
      union: stats.union,
      onlyCurrentKeys: stats.onlyCurrentKeys,
      onlyCompareKeys: stats.onlyCompareKeys,
      overlapKeys: stats.overlapKeys,
    };

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `range-diff-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showStatus("导出成功！", "text-green-400");
  } catch {
    showStatus("导出失败", "text-red-400");
  }
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
