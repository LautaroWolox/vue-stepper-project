<template>
  <div class="fm-select-field">
    <label v-if="label">{{ label }}</label>
    <select class="fm-select" :value="modelValue" :disabled="disabled" @change="handleChange">
      <option value="">{{ placeholder }}</option>
      <option v-for="item in options" :key="getValue(item)" :value="getValue(item)">{{ getLabel(item) }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Seleccionar' },
  options: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
const getValue = item => typeof item === 'object' ? item.value : item
const getLabel = item => typeof item === 'object' ? item.label : item
const handleChange = event => emit('update:modelValue', event.target.value)
</script>

<style scoped>
.fm-select-field{width:100%;min-width:0}.fm-select-field label{display:block;margin-bottom:6px;font-size:13px;font-weight:400}.fm-select{width:100%;height:31px;border:1px solid #9e9e9e;border-radius:3px;background:#fff;padding:4px 8px;font-size:13px;font-weight:400}.fm-select:disabled{background:#e9e9e9;color:#777;cursor:not-allowed}.fm-select option:checked{background:#00a9bd;color:#fff}
</style>
