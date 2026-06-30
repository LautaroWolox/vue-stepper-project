<template>
  <div class="fm-input-field">
    <label v-if="label">{{ label }}</label>
    <input class="fm-text-input" :class="{ disabled: disabled }" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :type="type" @input="handleInput" />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
const handleInput = event => emit('update:modelValue', event.target.value)
</script>

<style scoped>
.fm-input-field{width:100%;min-width:0}.fm-input-field label{display:block;margin-bottom:6px;font-size:13px;font-weight:400}.fm-text-input{width:100%;height:31px;border:1px solid #9e9e9e;border-radius:3px;background:#fff;padding:4px 8px;font-size:13px;font-weight:400}.fm-text-input.disabled,.fm-text-input:disabled{background:#e9e9e9;color:#777;cursor:not-allowed}
</style>
