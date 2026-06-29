<template>
  <div v-if="show" class="fm-dialog-backdrop">
    <div class="fm-alert-dialog">
      <div class="fm-dialog-header">
        <span>{{ title }}</span>
        <button type="button" class="fm-dialog-close" @click="$emit('close')">×</button>
      </div>
      <div class="fm-dialog-body">
        <div class="fm-dialog-icon"><span class="material-icons">info</span></div>
        <p>{{ message }}</p>
      </div>
      <div class="fm-dialog-actions">
        <button type="button" class="btn-cyan-outline" @click="$emit('close')">CERRAR</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Alerta' },
  message: { type: String, default: '' }
})

defineEmits(['close'])
</script>

<style scoped>
.fm-dialog-backdrop { position: fixed; inset: 0; z-index: 9500; display: flex; align-items: center; justify-content: center; background: rgba(38, 50, 56, 0.2); }
.fm-alert-dialog { width: min(520px, calc(100vw - 28px)); background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 18px 55px rgba(0, 0, 0, 0.28); }
.fm-dialog-header { height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #eceff1; color: #263238; font-size: 18px; }
.fm-dialog-close { border: 0; background: transparent; color: #b0bec5; cursor: pointer; font-size: 26px; font-weight: 800; }
.fm-dialog-body { display: grid; grid-template-columns: 58px 1fr; gap: 14px; align-items: center; padding: 22px 20px; color: #263238; }
.fm-dialog-body p { margin: 0; line-height: 1.45; }
.fm-dialog-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #e0f7fa; color: #00a9bd; }
.fm-dialog-icon .material-icons { font-size: 30px; }
.fm-dialog-actions { display: flex; justify-content: flex-end; gap: 9px; padding: 14px 18px 18px; border-top: 1px solid #eceff1; }
.btn-cyan-outline { border-radius: 20px; padding: 8px 20px; font-size: 13px; font-weight: 800; cursor: pointer; background: #fff; border: 1px solid #00a9bd; color: #00a9bd; }
@media (max-width: 560px) { .fm-dialog-body { grid-template-columns: 1fr; text-align: center; } .fm-dialog-icon { margin: 0 auto; } .btn-cyan-outline { width: 100%; } }
</style>
