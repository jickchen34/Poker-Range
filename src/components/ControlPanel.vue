<template>
  <div class="control-panel" :class="{ collapsed: !isExpanded }">
    <button class="toggle-button" @click="isExpanded = !isExpanded">
      {{ isExpanded ? ">" : "<" }}
    </button>

    <div class="panel-content" v-show="isExpanded">
      <h3>控制面板</h3>

      <div class="control-section">
        <h4>颜色模式</h4>
        <button
          @click="toggleColorMode"
          :class="{ active: colorMode === 'colored' }"
        >
          {{ colorMode === "colored" ? "切换为无色模式" : "切换为亮色模式" }}
        </button>
      </div>

      <div class="control-section">
        <h4>填充比例</h4>
        <div class="percentage-input">
          <input
            type="number"
            :value="percentage"
            @input="updatePercentage($event.target.value)"
            min="0"
            max="100"
          />
          <span>%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  colorMode: String,
  percentage: Number,
});

const emit = defineEmits(["update:colorMode", "update:percentage"]);
const isExpanded = ref(true);

const toggleColorMode = () => {
  emit("update:colorMode", props.colorMode === "colored" ? "plain" : "colored");
};

const updatePercentage = (value) => {
  const num = Math.min(100, Math.max(0, Number(value)));
  emit("update:percentage", num);
};
</script>

<style scoped>
.control-panel {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 25px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  border-radius: 12px 0 0 12px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.collapsed {
  padding: 0;
  transform: translateX(100%);
  background: transparent;
  box-shadow: none;
}

.toggle-button {
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 80px;
  border: none;
  background: linear-gradient(135deg, #42b883 0%, #3aa876 100%);
  color: white;
  cursor: pointer;
  border-radius: 6px 0 0 6px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: background 0.2s ease;
  z-index: 101;
}

.toggle-button:hover {
  background: linear-gradient(135deg, #3aa876 0%, #42b883 100%);
}

.collapsed .toggle-button {
  left: -40px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}

.panel-content {
  width: 240px;
}

.control-section {
  margin: 25px 0;
  background: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.4em;
  font-weight: 600;
  text-align: center;
}

h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 1.1em;
  font-weight: 500;
}

button {
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  color: #495057;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

button:hover {
  background: linear-gradient(to bottom, #e9ecef, #dee2e6);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

button.active {
  background: linear-gradient(135deg, #42b883 0%, #3aa876 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(66, 184, 131, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.percentage-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

input {
  width: 70px;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1em;
  color: #495057;
  transition: all 0.2s ease;
  text-align: center;
}

input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

span {
  font-weight: 500;
  color: #495057;
}
</style>
