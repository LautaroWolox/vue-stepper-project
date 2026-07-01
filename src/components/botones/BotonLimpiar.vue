<template>
  <button class="fm-clean-button" type="button" :disabled="disabled">
    <span class="material-icons">sort</span>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'LIMPIAR' },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.fm-clean-button {
  height: 32px;
  min-width: 107px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .2px;
  line-height: 32px;
  text-transform: uppercase;
  cursor: pointer;
  background: #fff;
  border: 1px solid #00a9bd;
  color: #00a9bd;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .12);
}

.fm-clean-button .material-icons {
  font-size: 15px;
}

.fm-clean-button:hover:not(:disabled) {
  background: #e0f7fa;
  border-color: #008fa1;
  color: #008fa1;
}

.fm-clean-button:disabled {
  opacity: .65;
  cursor: not-allowed;
}
</style>
