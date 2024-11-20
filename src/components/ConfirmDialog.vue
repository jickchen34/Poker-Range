<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="handleClose"
    >
      <div
        class="bg-[#1E1E1E]/90 backdrop-blur-md p-6 rounded-xl border border-white/10 w-80 shadow-2xl transform transition-all duration-200 scale-100"
      >
        <h3 class="text-white/90 text-xl font-medium mb-3">{{ title }}</h3>
        <p class="text-white/70 text-sm mb-6">{{ message }}</p>
        <div class="flex justify-between gap-3">
          <button
            v-if="showCancel"
            class="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white/90 hover:bg-white/10 transition-colors duration-200"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-lg text-sm text-white transition-colors duration-200',
              type === 'danger'
                ? 'bg-red-500/80 hover:bg-red-500'
                : type === 'warning'
                ? 'bg-yellow-500/80 hover:bg-yellow-500'
                : 'bg-blue-500/80 hover:bg-blue-500',
            ]"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: "确认",
  },
  message: {
    type: String,
    default: "是否确认此操作？",
  },
  confirmText: {
    type: String,
    default: "确认",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "danger", "warning"].includes(value),
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const handleClose = () => {
  if (props.closeOnClickOverlay) {
    emit("update:modelValue", false);
  }
};

const handleConfirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};

const handleCancel = () => {
  emit("cancel");
  emit("update:modelValue", false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
