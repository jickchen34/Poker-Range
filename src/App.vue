<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import MenuPanel from "./components/MenuPanel.vue";
import RangeTable from "./components/RangeTable.vue";
import RangeStats from "./components/RangeStats.vue";
import RangeIO from "./components/RangeIO.vue";
import RangeCompare from "./components/RangeCompare.vue";

const currentMode = ref("normal");
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const rangeTableRef = ref(null);
const currentDragIndex = ref(null);
const activeTableIndex = ref(0);

// 添加一个数组来存储所有表格的位置
const tablePositions = ref([{ x: 0, y: 0 }]);
const tableRefs = ref([]);

// 修改 initPosition 函数
const initPosition = () => {
  const mainWrap = document.querySelector(".main-wrap");
  const rangeTable = document.querySelector(".range-table-wrapper");

  if (!mainWrap || !rangeTable) return;

  const mainRect = mainWrap.getBoundingClientRect();
  const tableRect = rangeTable.getBoundingClientRect();

  tablePositions.value[0] = {
    x: (mainRect.width - tableRect.width) / 2,
    y: (mainRect.height - tableRect.height) / 2,
  };
};

// 修改复制表格函数
const duplicateTable = ({ index, data }, offset = 30) => {
  // 创建一个新的位置
  const newPosition = {
    x: tablePositions.value[index].x + offset, // 改为水平偏��
    y: tablePositions.value[index].y + offset,
  };

  // 添加新的位置到位置数组
  tablePositions.value.push(newPosition);

  // 在下一个 tick 导入深拷贝的数据
  nextTick(() => {
    const newTableIndex = tablePositions.value.length - 1;
    const newTable = tableRefs.value[newTableIndex];
    if (newTable) {
      // 使用深拷贝的数据
      const clonedData = JSON.parse(JSON.stringify(data));
      newTable.importTableData(clonedData);
    }
  });
};

const startDrag = (e, index) => {
  e.preventDefault();
  e.stopPropagation();

  if (isDragging.value) return;

  isDragging.value = true;
  currentDragIndex.value = index;
  dragOffset.value = {
    x: e.clientX - tablePositions.value[index].x,
    y: e.clientY - tablePositions.value[index].y,
  };

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value || currentDragIndex.value === null) return;

  e.preventDefault();
  e.stopPropagation();

  const mainWrap = document.querySelector(".main-wrap");
  const rangeTable = document.querySelector(".range-table-wrapper");

  if (!mainWrap || !rangeTable) return;

  const mainRect = mainWrap.getBoundingClientRect();
  const tableRect = rangeTable.getBoundingClientRect();
  const scale = tableRefs.value[currentDragIndex.value]?.scale || 1;

  let newX = e.clientX - dragOffset.value.x;
  let newY = e.clientY - dragOffset.value.y;

  const margin = 50;
  const minX = -tableRect.width * scale + margin;
  const maxX = mainRect.width - margin;
  const minY = -tableRect.height * scale + margin;
  const maxY = mainRect.height - margin;

  newX = Math.max(minX, Math.min(newX, maxX));
  newY = Math.max(minY, Math.min(newY, maxY));

  // 更新当前拖动表格的位置
  tablePositions.value[currentDragIndex.value] = { x: newX, y: newY };
};

const stopDrag = (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  isDragging.value = false;
  currentDragIndex.value = null;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

watch(
  () => currentMode.value,
  (newValue, oldValue) => {
    console.log("Mode changed:", oldValue, "->", newValue);
  }
);

// 右侧面板标签页
const activeTab = ref("统计");

// 对比数据
const compareSelectedCells = ref(null);

const handleCompareChange = (payload) => {
  compareSelectedCells.value = payload ? payload.compareSelectedCells : null;
};

// 获取当前活动表格的数据
const getCurrentTableData = () => {
  const currentTable = tableRefs.value[activeTableIndex.value];
  if (currentTable) {
    return currentTable.getTableData();
  }
  return { selectedCells: {} };
};

// 处理范围导入
const handleImportRange = (data) => {
  const currentTable = tableRefs.value[activeTableIndex.value];
  if (currentTable && data.selectedCells) {
    currentTable.importTableData(data);
  }
};

onMounted(() => {
  // 使用 nextTick 确保 DOM 已完全渲染
  nextTick(() => {
    initPosition();
  });
});
</script>

<template>
  <div class="fixed inset-0 flex">
    <div
      class="fixed top-0 left-0 bottom-0 w-12 bg-[#2C2C2E] border-r border-mac-border z-10"
    >
      <MenuPanel v-model:mode="currentMode" />
    </div>

    <main
      class="main-wrap fixed left-12 right-64 top-0 bottom-0 bg-mac-bg overflow-hidden"
    >
      <Transition name="fade">
        <div v-if="currentMode === 'normal'">
          <div
            v-for="(pos, index) in tablePositions"
            :key="index"
            class="range-table-wrapper absolute"
            :style="{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              transformOrigin: 'top left',
            }"
            @click="activeTableIndex = index"
          >
            <RangeTable
              :ref="(el) => (tableRefs[index] = el)"
              @drag-handle="(e) => startDrag(e, index)"
              :table-index="index"
              @duplicate="duplicateTable"
              :compare-selected-cells="compareSelectedCells"
            />
          </div>
        </div>
      </Transition>
    </main>

    <!-- 右侧面板 -->
    <aside class="fixed top-0 right-0 bottom-0 w-64 bg-[#1C1C1E] border-l border-mac-border z-10 flex flex-col">
      <!-- 标签页切换 -->
      <div class="flex border-b border-mac-border shrink-0">
        <button
          v-for="tab in ['统计', 'IO', '对比']"
          :key="tab"
          class="flex-1 py-2 text-sm transition-colors"
          :class="activeTab === tab
            ? 'text-white bg-[#2C2C2E] border-b-2 border-purple-400'
            : 'text-white/50 hover:text-white/80'"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>
      <!-- 面板内容 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <template v-if="activeTab === '统计'">
          <RangeStats :selected-cells="getCurrentTableData().selectedCells" />
        </template>
        <template v-else-if="activeTab === 'IO'">
          <RangeIO :table-data="getCurrentTableData()" @import-range="handleImportRange" />
        </template>
        <template v-else-if="activeTab === '对比'">
          <RangeCompare
            :current-selected-cells="getCurrentTableData().selectedCells"
            @compare-change="handleCompareChange"
          />
        </template>
      </div>
    </aside>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-mac-bg font-sans antialiased text-white m-0 p-0 overflow-hidden;
}

#app {
  @apply p-0; /* 移除默认的 padding */
}

.range-table-wrapper {
  user-select: none;
  touch-action: none;
  cursor: move;
  position: absolute;
  z-index: 1000;
  will-change: transform;
  overflow: visible;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
