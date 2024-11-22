<template>
  <nav class="flex flex-col h-full">
    <!-- Header Bar - 移除 border-b -->
    <div class="flex flex-col gap-1 p-2">
      <!-- 模式选择菜单项 -->
      <button
        class="w-8 h-8 mx-auto flex items-center justify-center hover:bg-mac-hover text-white/60 hover:text-white rounded-md"
        @click="activeMenu = activeMenu === 'mode' ? '' : 'mode'"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    </div>

    <!-- Bottom Bar - 移除 border-t -->
    <div class="mt-auto flex flex-col gap-1 p-2">
      <!-- 用户登录按钮 -->
      <button
        class="w-8 h-8 mx-auto flex items-center justify-center hover:bg-mac-hover text-white/60 hover:text-white rounded-md"
        @click="handleLogin"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      <!-- 退出应用按钮 -->
      <button
        class="w-8 h-8 mx-auto flex items-center justify-center hover:bg-mac-hover text-white/60 hover:text-white rounded-md"
        @click="handleExit"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>

    <!-- 侧边展开面板 -->
    <Transition name="slide">
      <div
        v-show="activeMenu"
        class="fixed left-12 top-0 w-64 h-screen bg-[#2C2C2E]/95 backdrop-blur-md shadow-xl border-r border-mac-border"
      >
        <div class="relative p-4">
          <!-- 关闭按钮 -->
          <button
            class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/60 hover:text-white"
            @click="activeMenu = ''"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <!-- 面板标题 -->
          <h3 class="text-white/90 text-lg font-medium mb-4">模式选择</h3>

          <ModePanel v-if="activeMenu === 'mode'" v-model:mode="currentMode" />
        </div>
      </div>
    </Transition>

    <!-- 使用封装的确认弹窗组件 -->
    <ConfirmDialog
      v-model="showExitConfirm"
      title="确认退出"
      message="是否确认退出程序？退出后将无法保存当前进度。"
      confirm-text="退出程序"
      type="danger"
      @confirm="confirmExit"
    />
  </nav>
</template>

<script setup>
import { ref, watch } from "vue";
import ModePanel from "./ModePanel.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

const emit = defineEmits(["update:mode", "select-range"]);
const activeMenu = ref("");
const currentMode = ref("normal");

// 监听模式变化
watch(currentMode, (newMode) => {
  emit("update:mode", newMode);
});

// 添加登录和退出处理函数
const handleLogin = () => {
  // 处理登录逻辑
  console.log("Login clicked");
};

const showExitConfirm = ref(false);

const handleExit = () => {
  showExitConfirm.value = true;
};

const confirmExit = async () => {
  await window.electronAPI.closeWindow();
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
