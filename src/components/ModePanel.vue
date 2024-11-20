<template>
  <div class="mode-panel">
    <h2>模式选择</h2>
    <div class="mode-buttons">
      <button
        @click="selectMode('normal')"
        :class="{ active: currentMode === 'normal' }"
      >
        普通模式
      </button>
      <button
        @click="selectMode('training')"
        :class="{ active: currentMode === 'training' }"
      >
        训练模式
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["update:mode"]);
const props = defineProps({
  mode: {
    type: String,
    default: "normal",
  },
});

const currentMode = ref(props.mode);

const selectMode = (mode) => {
  currentMode.value = mode;
  emit("update:mode", mode);
};
</script>

<style scoped>
.mode-panel {
  background: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(20px);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  width: 220px;
}

h2 {
  color: #ffffff;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

button {
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

button:hover {
  background: rgba(255, 255, 255, 0.15);
}

button.active {
  background: #0a84ff;
  color: white;
  border-color: #0a84ff;
}
</style>
