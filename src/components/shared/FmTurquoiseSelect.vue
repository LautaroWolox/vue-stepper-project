<template>
  <div ref="rootRef" class="fm-turquoise-select" :class="{ open: isOpen, disabled }">
    <button class="fm-turquoise-select__button" type="button" :disabled="disabled" @click="toggleOpen">
      <span class="fm-turquoise-select__label">{{ selectedLabel }}</span>
      <span class="material-icons fm-turquoise-select__arrow">arrow_drop_down</span>
    </button>

    <div v-if="isOpen" class="fm-turquoise-select__menu">
      <button
        v-for="option in normalizedOptions"
        :key="String(option.value)"
        type="button"
        class="fm-turquoise-select__option"
        :class="{ selected: option.value === modelValue }"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])
const rootRef = ref(null)
const isOpen = ref(false)

const normalizedOptions = computed(() => props.options.map((option) => {
  if (typeof option === 'object' && option !== null) {
    return {
      value: option.value ?? '',
      label: option.label ?? String(option.value ?? '')
    }
  }
  return { value: option, label: String(option ?? '') }
}))

const selectedLabel = computed(() => {
  const selected = normalizedOptions.value.find((option) => option.value === props.modelValue)
  if (selected) return selected.label
  return props.placeholder
})

const toggleOpen = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

const handleDocumentClick = (event) => {
  if (!rootRef.value || rootRef.value.contains(event.target)) return
  isOpen.value = false
}

onMounted(() => document.addEventListener('mousedown', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleDocumentClick))
</script>

<style scoped>
.fm-turquoise-select {
  position: relative;
  width: 100%;
  min-width: 0;
  font-family: inherit;
}

.fm-turquoise-select__button {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #bdbdbd;
  border-radius: 3px;
  background: #ffffff;
  color: #263238;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}

.fm-turquoise-select.open .fm-turquoise-select__button,
.fm-turquoise-select__button:focus-visible {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .18);
}

.fm-turquoise-select__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 16px;
}

.fm-turquoise-select__arrow {
  font-size: 18px;
  color: #111;
  flex: 0 0 auto;
}

.fm-turquoise-select__menu {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  width: 100%;
  max-height: 260px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #00a9bd;
  box-shadow: 0 8px 18px rgba(38, 50, 56, .18);
  z-index: 9500;
}

.fm-turquoise-select__option {
  width: 100%;
  min-height: 28px;
  display: block;
  border: 0;
  background: #ffffff;
  color: #263238;
  padding: 6px 10px;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.25;
}

.fm-turquoise-select__option:hover,
.fm-turquoise-select__option.selected {
  background: #00a9bd;
  color: #ffffff;
}

.fm-turquoise-select.disabled {
  opacity: .6;
  pointer-events: none;
}
</style>
