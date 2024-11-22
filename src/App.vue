<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import MenuPanel from "./components/MenuPanel.vue";
import RangeTable from "./components/RangeTable.vue";
import RangePresets from "./components/RangePresets.vue"; // 修正导入路径

const currentMode = ref("normal");
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const rangeTableRef = ref(null);
const currentDragIndex = ref(null); // 添加：跟踪当前正在拖动的表格索引

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
    x: tablePositions.value[index].x + offset, // 改为水平偏移
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
      class="main-wrap fixed left-12 right-0 top-0 bottom-0 bg-mac-bg overflow-hidden"
    >
      <Transition name="fade">
        <div v-if="currentMode === 'normal'" class="flex">
          <RangePresets class="w-1/4" />
          <!-- 添加预设范围组件 -->
          <div class="flex-1 relative">
            <div
              v-for="(pos, index) in tablePositions"
              :key="index"
              class="range-table-wrapper absolute"
              :style="{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transformOrigin: 'top left',
              }"
            >
              <RangeTable
                :ref="(el) => (tableRefs[index] = el)"
                @drag-handle="(e) => startDrag(e, index)"
                :table-index="index"
                @duplicate="duplicateTable"
              />
            </div>
          </div>
        </div>
      </Transition>
    </main>
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
