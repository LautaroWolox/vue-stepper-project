<template>
  <button class="fm-action-button fm-action-button--primary" type="button" :disabled="disabled">
    <span class="material-icons">search</span>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'BUSCAR' },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.fm-action-button {
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, .12);
  transition: background-color .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease;
}

.fm-action-button .material-icons {
  font-size: 15px;
  line-height: 1;
}

.fm-action-button--primary {
  background: #00a9bd;
  border: 1px solid #00a9bd;
  color: #fff;
}

.fm-action-button--primary:hover:not(:disabled) {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 5px 12px rgba(0, 143, 161, .28);
  transform: translateY(-1px);
}

.fm-action-button:disabled {
  opacity: .65;
  cursor: not-allowed;
  transform: none;
}
</style>
