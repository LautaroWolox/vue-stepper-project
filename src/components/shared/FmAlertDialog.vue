<template>
  <div v-if="show" class="fm-dialog-backdrop">
    <div class="fm-alert-dialog">
      <FmTypingLoader v-if="loading" title="Cargando aviso" message="Preparando el mensaje..." compact />
      <template v-else>
        <div class="fm-dialog-header">
          <span>{{ title }}</span>
          <button type="button" class="fm-dialog-close" @click="$emit('close')">×</button>
        </div>
        <div class="fm-dialog-body">
          <div class="fm-dialog-icon" :class="iconClass">
            <svg v-if="type === 'success'" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="success-circle" cx="12" cy="12" r="9"></circle>
              <path class="success-check" d="M7.8 12.4 10.7 15.2 16.5 8.9"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path class="warning-triangle" d="M12 3.5 22 20.5H2L12 3.5Z"></path>
              <path class="warning-mark" d="M12 8.4v6.1"></path>
              <circle class="warning-dot" cx="12" cy="17.3" r="1"></circle>
            </svg>
          </div>
          <p>{{ message }}</p>
        </div>
        <div class="fm-dialog-actions">
          <button type="button" class="btn-cyan-outline" @click="$emit('close')">CERRAR</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import FmTypingLoader from './FmTypingLoader.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Alerta' },
  message: { type: String, default: '' },
  type: { type: String, default: 'warning' }
})

defineEmits(['close'])

const loading = ref(false)
const iconClass = computed(() => props.type === 'success' ? 'fm-dialog-icon-success' : 'fm-dialog-icon-warning')
let timer = null

watch(() => props.show, (value) => {
  clearTimeout(timer)
  if (!value) {
    loading.value = false
    return
  }
  loading.value = true
  timer = setTimeout(() => {
    loading.value = false
  }, 450)
})
</script>

<style scoped>
.fm-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(38, 50, 56, .16);
}

.fm-alert-dialog {
  width: min(520px, calc(100vw - 28px));
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 34px rgba(0, 0, 0, .18);
}

.fm-dialog-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eceff1;
  color: #263238;
  font-size: 18px;
}

.fm-dialog-close {
  border: 0;
  background: transparent;
  color: #b0bec5;
  cursor: pointer;
  font-size: 26px;
  font-weight: 800;
}

.fm-dialog-close:hover {
  color: #78909c;
}

.fm-dialog-body {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 14px;
  align-items: center;
  padding: 22px 20px;
  color: #263238;
}

.fm-dialog-body p {
  margin: 0;
  line-height: 1.45;
}

.fm-dialog-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fm-dialog-icon svg {
  width: 42px;
  height: 42px;
}

.fm-dialog-icon-warning svg {
  filter: drop-shadow(0 3px 5px rgba(198, 40, 40, .22));
}

.warning-triangle {
  fill: #fff5f5;
  stroke: #d32f2f;
  stroke-width: 1.8;
  stroke-linejoin: round;
}

.warning-mark {
  fill: none;
  stroke: #d32f2f;
  stroke-width: 2.2;
  stroke-linecap: round;
}

.warning-dot {
  fill: #d32f2f;
}

.fm-dialog-icon-success svg {
  filter: drop-shadow(0 3px 5px rgba(46, 125, 50, .20));
}

.success-circle {
  fill: #e8f5e9;
  stroke: #2e7d32;
  stroke-width: 1.8;
}

.success-check {
  fill: none;
  stroke: #2e7d32;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fm-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  padding: 14px 18px 18px;
  border-top: 1px solid #eceff1;
}

.btn-cyan-outline {
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  background: #fff;
  border: 1px solid #00a9bd;
  color: #00a9bd;
  transition: background-color .18s ease, box-shadow .18s ease, color .18s ease;
}

.btn-cyan-outline:hover {
  background: #e0f7fa;
  color: #006f7f;
  box-shadow: 0 4px 10px rgba(0, 143, 161, .14);
}

@media (max-width: 560px) {
  .fm-dialog-body {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .fm-dialog-icon {
    margin: 0 auto;
  }

  .btn-cyan-outline {
    width: 100%;
  }
}
</style>
