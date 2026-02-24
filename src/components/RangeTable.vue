<template>
  <div
    class="relative flex bg-[#1E1E1E] rounded-lg shadow-lg border border-mac-border"
    :style="containerStyle"
    @mousedown="handleDragStart"
  >
    <div class="flex flex-col">
      <!-- 表头和控制栏标题 - 添加可拖动区域 -->
      <div class="flex w-full">
        <div class="flex-1">
          <table class="w-full border-collapse border-none">
            <tr>
              <!-- 修改左上角空白格，添加缩放标记 -->
              <th
                class="cell-fixed-width p-2 text-center bg-mac-hover relative cursor-nw-resize"
                @mousedown.stop="startResize"
              >
                <div
                  class="absolute left-1 top-1 w-3 h-3 border-l-2 border-t-2 border-white/60"
                ></div>
              </th>
              <th
                v-for="card in cards"
                :key="card"
                class="cell-fixed-width p-2 text-center bg-mac-hover text-white font-medium"
              >
                {{ card }}
              </th>
            </tr>
          </table>
        </div>
        <!-- 修改控制栏标题，确保宽度严格匹配 -->
        <div
          class="min-w-[120px] w-[120px] bg-[#2C2C2E] flex items-center justify-center border-b border-mac-border"
        >
          <div class="text-white font-medium">操作</div>
        </div>
      </div>

      <!-- 表格主体和控制栏内容 -->
      <div class="flex" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
        <!-- 表格主体不可拖动 -->
        <table class="border-collapse border-none no-drag" @mousedown.stop>
          <tbody>
            <tr v-for="(row, rowIndex) in cards" :key="row">
              <th class="cell-fixed-width bg-mac-hover p-2 text-center">
                {{ row }}
              </th>
              <td
                v-for="(col, colIndex) in cards"
                :key="col"
                class="cell-fixed-width"
                :style="getCellStyle(rowIndex, colIndex)"
                @mousedown="handleMouseDown(rowIndex, colIndex)"
                @mouseenter="handleMouseEnter(rowIndex, colIndex)"
              >
                {{ row }}{{ col
                }}<span class="suffix">{{
                  getSuffix(rowIndex, colIndex)
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 控制栏内容 - 修改可拖动区域 -->
        <div
          class="min-w-[120px] w-[120px] bg-[#2C2C2E] p-4 flex flex-col gap-6 items-center"
        >
          <!-- 添加拖动手柄区域 -->
          <div
            class="absolute top-0 left-0 w-full h-8 handle-area"
            @mousedown="handleDragStart"
          ></div>

          <!-- 控制按钮区域不应该触发拖动 -->
          <button
            class="interactive-item w-8 h-8 rounded-lg bg-mac-hover hover:opacity-80 flex items-center justify-center transition-opacity"
            @mousedown.stop
            @click="clearSelection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          </button>
          <div class="interactive-item" @mousedown.stop>
            <Switch
              v-model="isColored"
              active-text="dark"
              inactive-text="light"
            />
          </div>
          <div
            class="interactive-item w-16 bg-mac-hover rounded-lg px-3 py-2 flex items-center justify-center"
            @mousedown.stop
          >
            <input
              type="number"
              :value="fillPercentage"
              class="w-8 bg-transparent text-white text-center outline-none"
              min="0"
              max="100"
              @input="fillPercentage = $event.target.value"
            />
            <span class="text-white text-sm ml-0.5">%</span>
          </div>
          <!-- 添加复制按钮 - 放在重置大小按钮之前 -->
          <button
            class="interactive-item w-8 h-8 rounded-lg bg-mac-hover hover:opacity-80 flex items-center justify-center transition-opacity"
            @mousedown.stop
            @click="handleDuplicate"
            title="复制表格"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              ></path>
            </svg>
          </button>
          <!-- 添加重置大小按钮 -->
          <button
            class="interactive-item w-8 h-8 rounded-lg bg-mac-hover hover:opacity-80 flex items-center justify-center transition-opacity"
            @mousedown.stop
            @click="resetScale"
            title="重置大小"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Switch from "./base/Switch.vue";

const props = defineProps({
  colorMode: {
    type: String,
    default: "colored",
  },
  fillPercentage: {
    type: Number,
    default: 100,
  },
  tableIndex: {
    type: Number,
    required: true,
  },
  compareSelectedCells: {
    type: Object,
    default: null,
  },
});

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const selectedCells = ref({});
const isMouseDown = ref(false);
const lastSelectedState = ref(false);

const isColored = ref(props.colorMode === "colored");
const fillPercentage = ref(props.fillPercentage);

const getCellColor = (index1, index2) => {
  if (!isColored.value) {
    return "#e0e0e0";
  }
  if (index1 === index2) return "#ffeb3b";
  if (index1 < index2) return "#81c784";
  return "#90caf9";
};

// 修改 mousedown 事件处理函数
const handleMouseDown = (rowIndex, colIndex) => {
  isMouseDown.value = true;
  const key = `${rowIndex}-${colIndex}`;
  const cellData = selectedCells.value[key];
  lastSelectedState.value = !cellData?.selected;
  toggleCell(rowIndex, colIndex);
};

// 添加 toggleCell 函数
const toggleCell = (rowIndex, colIndex) => {
  const key = `${rowIndex}-${colIndex}`;
  if (lastSelectedState.value) {
    selectedCells.value[key] = {
      selected: true,
      percentage: fillPercentage.value,
    };
  } else {
    selectedCells.value[key] = {
      selected: false,
      percentage: 0,
    };
  }
};

// 修改 mouseup 事件处理函数，确保在任何情况下都重置状态
const handleMouseUp = () => {
  isMouseDown.value = false;
};

// 修改 mouseenter 事件处理函数，只在按住鼠标时触发
const handleMouseEnter = (rowIndex, colIndex) => {
  if (!isMouseDown.value) return; // 确保只在按住鼠标时触发
  toggleCell(rowIndex, colIndex);
};

// 修改 getCellStyle 函数（支持差异对比叠加）
const getCellStyle = (rowIndex, colIndex) => {
  const key = `${rowIndex}-${colIndex}`;
  const cellData = selectedCells.value[key];
  const baseColor = getCellColor(rowIndex, colIndex);

  // 对比模式
  if (props.compareSelectedCells) {
    const inCurrent = cellData?.selected;
    const inCompare = props.compareSelectedCells[key]?.selected;

    let borderStyle = {};
    let overlayStyle = {};

    if (inCurrent && inCompare) {
      // 两者共有 → 绿色背景叠加
      overlayStyle = {
        background: `linear-gradient(to top, #22c55e88 ${cellData.percentage}%, ${baseColor} ${cellData.percentage}%)`,
        outline: "2px solid #22c55e",
        outlineOffset: "-2px",
      };
    } else if (inCurrent && !inCompare) {
      // 仅当前有 → 红色边框
      overlayStyle = {
        background: `linear-gradient(to top, #ff6b6b ${cellData.percentage}%, ${baseColor} ${cellData.percentage}%)`,
        outline: "2px solid #f87171",
        outlineOffset: "-2px",
      };
    } else if (!inCurrent && inCompare) {
      // 仅对比有 → 蓝色边框
      overlayStyle = {
        backgroundColor: baseColor,
        outline: "2px solid #60a5fa",
        outlineOffset: "-2px",
      };
    } else {
      overlayStyle = { backgroundColor: baseColor };
    }

    return { ...borderStyle, ...overlayStyle };
  }

  // 普通模式
  if (cellData?.selected) {
    return {
      background: `linear-gradient(to top, #ff6b6b ${cellData.percentage}%, ${baseColor} ${cellData.percentage}%)`,
    };
  }

  return {
    backgroundColor: baseColor,
  };
};

// 添加获取后缀的方法
const getSuffix = (index1, index2) => {
  if (index1 === index2) return ""; // 口袋对没有后缀
  if (index1 < index2) return "s"; // 上三角区域添加 's'
  return "o"; // 下三角区域添加 'o'
};

const emit = defineEmits(["drag-handle", "duplicate"]);

// 添加手牌转换为索引的映射函数
const getCardIndex = (card) => {
  return cards.indexOf(card);
};

// 添加应用预设范围的方法
const applyPresetRange = (ranges) => {
  // 清空当前选择
  selectedCells.value = {};

  // 处理每个手牌组合
  Object.entries(ranges).forEach(([hand, weight]) => {
    const card1 = hand[0];
    const card2 = hand[1];
    const suffix = hand[2] || ""; // 可能是 's'、'o' 或空

    const index1 = getCardIndex(card1);
    const index2 = getCardIndex(card2);

    // 如果是同样的牌（如 AA、KK等）
    if (card1 === card2) {
      const key = `${index1}-${index1}`;
      selectedCells.value[key] = {
        selected: true,
        percentage: weight * 100,
      };
    }
    // 如果是带后缀的牌
    else {
      // suited (s) 在上三角
      if (suffix === "s") {
        const key = `${Math.min(index1, index2)}-${Math.max(index1, index2)}`;
        selectedCells.value[key] = {
          selected: true,
          percentage: weight * 100,
        };
      }
      // offsuit (o) 在下三角
      else if (suffix === "o") {
        const key = `${Math.max(index1, index2)}-${Math.min(index1, index2)}`;
        selectedCells.value[key] = {
          selected: true,
          percentage: weight * 100,
        };
      }
      // 没有后缀的情况，两种都要选
      else {
        const key1 = `${Math.min(index1, index2)}-${Math.max(index1, index2)}`;
        const key2 = `${Math.max(index1, index2)}-${Math.min(index1, index2)}`;
        selectedCells.value[key1] = {
          selected: true,
          percentage: weight * 100,
        };
        selectedCells.value[key2] = {
          selected: true,
          percentage: weight * 100,
        };
      }
    }
  });
};

// 添加清空选择的方法
const clearSelection = () => {
  selectedCells.value = {};
};

// 添加拖动事件
const handleDragStart = (e) => {
  //如果元素上有no-drag类，则不允许拖动
  if (e.target.classList.contains("no-drag")) return;

  e.preventDefault();
  e.stopPropagation();
  emit("drag-handle", e);
};

// 添加缩放功能
const DEFAULT_SCALE = 1;
const scale = ref(DEFAULT_SCALE);
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const isResizing = ref(false);
const resizeStartPos = ref({ x: 0, y: 0 });
const startScale = ref(1);

// 添加容器样式计算
const containerStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: "top left",
  width: "fit-content",
  height: "fit-content",
  backfaceVisibility: "hidden",
  "-webkit-backface-visibility": "hidden",
}));

// 添加缩放开始处理函数
const startResize = (e) => {
  e.preventDefault();
  e.stopPropagation();
  isResizing.value = true;
  resizeStartPos.value = { x: e.clientX, y: e.clientY };
  startScale.value = scale.value;

  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
};

// 处理缩放过程
const handleResize = (e) => {
  if (!isResizing.value) return;

  const dx = e.clientX - resizeStartPos.value.x;
  const dy = e.clientY - resizeStartPos.value.y;

  // 使用对角线距离来计算缩放比例
  const distance = Math.sqrt(dx * dx + dy * dy);
  const direction = dx + dy < 0 ? -1 : 1;

  // 计算新的缩放值
  let newScale = startScale.value + direction * distance * 0.005;

  // 限制缩放范围
  newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

  scale.value = newScale;
};

// 停止缩放
const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
};

// 添加重置缩放方法
const resetScale = () => {
  scale.value = DEFAULT_SCALE;
};

// 添加复制表格方法
const handleDuplicate = () => {
  emit("duplicate", {
    index: props.tableIndex,
    data: getTableData(),
  });
};

// 修改获取表格数据的方法
const getTableData = () => {
  return {
    selectedCells: JSON.parse(JSON.stringify(selectedCells.value)),
    isColored: isColored.value,
    fillPercentage: fillPercentage.value,
    scale: scale.value,
  };
};

// 添加导入表格数据的方法
const importTableData = (data) => {
  selectedCells.value = data.selectedCells;
  isColored.value = data.isColored;
  fillPercentage.value = data.fillPercentage;
  scale.value = data.scale;
};

// 暴露方法给父组件
defineExpose({
  applyPresetRange,
  scale,
  resetScale, // 暴露重置方法给父组件
  getTableData,
  importTableData,
});
</script>

<style scoped>
/* 删除 .range-table-container 和 .range-table，因为模板中没有使用 */

table {
  @apply border-collapse;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

td {
  position: relative;
  will-change: background, background-color;
  backface-visibility: hidden;
  transform: translateZ(0);
  @apply p-2 text-center w-10 h-10 border border-mac-border text-white 
         cursor-pointer select-none transition-colors duration-300 text-sm;
}

/* 修改渐变过渡效果 */
td:hover {
  @apply opacity-80;
}

/* 删除 .pocket-pair, .suited, .offsuit 类，因为使用了动态样式 */

suffix {
  @apply text-xs text-white/70 ml-0.5;
}

/* 移除数字输入框的箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.cell-fixed-width {
  width: 40px;
  min-width: 40px;
  max-width: 40px;
}

/* 修改所有 th 的边框样式 */
th {
  @apply border border-mac-border;
}

/* 移除之前的单独边框样式，因为已经被上面的规则覆盖 */
tr:first-child th {
  @apply border-t border-mac-border;
}

th:first-child {
  @apply border-l border-mac-border;
}

/* 表格区域禁止拖动 */
.no-drag {
  cursor: default;
  -webkit-app-region: no-drag;
}

/* 表格单元格样式 */
td {
  cursor: pointer !important;
  position: relative;
  will-change: background, background-color;
  backface-visibility: hidden;
  transform: translateZ(0);
  @apply p-2 text-center w-10 h-10 border border-mac-border text-white 
         select-none transition-colors duration-300 text-sm;
}

/* 禁用表格内容区域的拖动 */
td,
th {
  -webkit-user-drag: none;
  user-select: none;
}

/* 控制项样式 */
.control-item {
  position: relative;
  z-index: 1;
  cursor: pointer !important;
}

/* 确保控制项可以正常交互 */
.control-item * {
  pointer-events: auto;
}

/* 交互元素样式 */
.interactive-item {
  position: relative;
  z-index: 2;
  cursor: pointer !重要;
}

.interactive-item:hover {
  z-index: 3;
}

/* 移除之前的 control-item 相关样式 */

/* 添加缩放标记样式 */
.scale-handle {
  position: absolute;
  left: 4px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(255, 255, 255, 0.6);
  border-top: 2px solid rgba(255, 255, 255, 0.6);
  cursor: nw-resize;
}

/* 修改表格容器样式 */
.flex-col {
  position: relative;
  background: #1e1e1e;
  /* 关键修改：确保背景色完全覆盖 */
  width: 100%;
  height: 100%;
}

/* 修改表格样式 */
table {
  @apply border-collapse;
  position: relative;
  /* 关键修改：确保表格正确渲染 */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
</style>
