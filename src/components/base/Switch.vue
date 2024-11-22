<template>
  <button
    type="button"
    class="relative w-16 h-7 rounded-full transition-colors duration-200 ease-in-out overflow-hidden focus:outline-none"
    :class="modelValue ? 'bg-mac-blue' : 'bg-mac-hover'"
    @click="toggle"
  >
    <div
      class="absolute inset-0 flex justify-between items-center px-2 text-white"
    >
      <span
        class="text-xs font-medium transition-opacity duration-200"
        :class="modelValue ? 'opacity-100' : 'opacity-0'"
      >
        {{ activeText }}
      </span>
      <span
        class="text-xs font-medium transition-opacity duration-200"
        :class="modelValue ? 'opacity-0' : 'opacity-100'"
      >
        {{ inactiveText }}
      </span>
    </div>
    <div
      class="absolute w-[26px] h-[26px] bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out"
      :style="{
        transform: modelValue ? 'translateX(38px)' : 'translateX(1px)',
        top: '0.5px',
      }"
    ></div>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  activeText: {
    type: String,
    default: "",
  },
  inactiveText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const toggle = () => {
  const newValue = !props.modelValue;
  emit("update:modelValue", newValue);
};
</script>
