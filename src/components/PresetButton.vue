<template>
  <div class="preset-button">
    <div
      class="button-content group"
      :class="[
        button.isFile ? 'hover:bg-blue-500/20' : 'hover:bg-gray-500/20',
        isOpen && !button.isFile ? 'bg-gray-500/20' : '',
      ]"
      @click="handleClick"
    >
      <span
        class="icon"
        :class="{
          'text-blue-400': button.isFile,
          'text-gray-300': !button.isFile,
        }"
      >
        {{ button.isFile ? "📄" : isOpen ? "📂" : "📁" }}
      </span>
      <span class="button-name group-hover:text-white">{{ button.name }}</span>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-1 opacity-0"
    >
      <ul
        v-if="!button.isFile && isOpen && subButtons.length > 0"
        class="nested-buttons"
      >
        <li v-for="subBtn in subButtons" :key="subBtn.path">
          <PresetButton
            :button="subBtn"
            @select-preset="$emit('select-preset', $event)"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRangePresets } from "../hooks/useRangePresets";

const props = defineProps({
  button: {
    type: Object,
    required: true,
  },
});

const { getSubButtons } = useRangePresets();
const isOpen = ref(false);

const subButtons = computed(() => {
  if (!props.button || !props.button.path) return [];
  const buttons = getSubButtons(props.button.path);
  return buttons;
});

const emit = defineEmits(["select-preset"]);

const handleClick = () => {
  const buttonData = {
    name: String(props.button.name),
    path: String(props.button.path),
    isFile: Boolean(props.button.isFile),
    isFolder: !props.button.isFile,
  };

  if (buttonData.isFile) {
    emit("select-preset", buttonData.path);
  } else {
    isOpen.value = !isOpen.value;
  }
};
</script>

<style scoped>
.preset-button {
  @apply w-full;
}

.button-content {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg
         transition-all duration-200 cursor-pointer
         backdrop-filter backdrop-blur-sm
         border border-transparent;
}

.button-name {
  @apply text-gray-300 text-sm font-medium transition-colors;
}

.nested-buttons {
  @apply pl-4 mt-1 border-l border-gray-700/50 ml-2;
}

.icon {
  @apply text-base transition-colors;
}
</style>
