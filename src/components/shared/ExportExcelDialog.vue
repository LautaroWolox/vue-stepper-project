<template>
  <div v-if="show" class="excel-export-backdrop">
    <div class="excel-export-dialog">
      <div class="excel-export-header">
        <div>
          <h3>Exportar a Excel</h3>
          <p>{{ description }}</p>
        </div>
        <button type="button" class="excel-close" @click="$emit('close')">×</button>
      </div>

      <div class="excel-export-body">
        <label class="excel-option" :class="{ active: selectedScope === 'allRows' }">
          <input type="radio" value="allRows" v-model="selectedScope" />
          <span>
            <strong>Exportar todo completo</strong>
            <small>Exporta todos los registros disponibles de la grilla actual.</small>
          </span>
        </label>

        <label class="excel-option" :class="{ active: selectedScope === 'visibleRows' }">
          <input type="radio" value="visibleRows" v-model="selectedScope" />
          <span>
            <strong>Exportar lo visible</strong>
            <small>Exporta solamente la página que estás viendo.</small>
          </span>
        </label>

        <div class="excel-divider"></div>

        <label class="excel-option" :class="{ active: selectedColumnMode === 'all' }">
          <input type="radio" value="all" v-model="selectedColumnMode" />
          <span>
            <strong>Exportar todos los campos</strong>
            <small>Incluye todas las columnas seleccionadas de la grilla.</small>
          </span>
        </label>

        <label class="excel-option" :class="{ active: selectedColumnMode === 'filled' }">
          <input type="radio" value="filled" v-model="selectedColumnMode" />
          <span>
            <strong>Exportar solo campos llenos</strong>
            <small>Omite columnas que no tengan datos cargados.</small>
          </span>
        </label>
      </div>

      <div class="excel-export-footer">
        <button type="button" class="btn-cyan-outline" @click="$emit('close')">CANCELAR</button>
        <button type="button" class="btn-cyan" @click="confirmExport">EXPORTAR EXCEL</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  description: { type: String, default: 'Elegí qué información querés incluir en el archivo.' },
  defaultScope: { type: String, default: 'allRows' },
  defaultColumnMode: { type: String, default: 'all' }
})

const emit = defineEmits(['close', 'confirm'])

const selectedScope = ref(props.defaultScope)
const selectedColumnMode = ref(props.defaultColumnMode)

watch(() => props.show, (isOpen) => {
  if (!isOpen) return
  selectedScope.value = props.defaultScope
  selectedColumnMode.value = props.defaultColumnMode
})

const confirmExport = () => {
  emit('confirm', {
    scope: selectedScope.value,
    columnMode: selectedColumnMode.value
  })
}
</script>

<style scoped>
.excel-export-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(38, 50, 56, 0.22);
}

.excel-export-dialog {
  width: min(560px, calc(100vw - 28px));
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.excel-export-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #eceff1;
}

.excel-export-header h3 {
  margin: 0 0 5px;
  color: #263238;
  font-size: 20px;
}

.excel-export-header p {
  margin: 0;
  color: #607d8b;
  font-size: 13px;
}

.excel-close {
  appearance: none;
  border: 0;
  background: transparent;
  color: #b0bec5;
  cursor: pointer;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.excel-export-body {
  padding: 16px 20px 8px;
}

.excel-option {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

.excel-option.active {
  border-color: #00bcd4;
  background: #e0f7fa;
}

.excel-option input {
  margin-top: 3px;
  accent-color: #00bcd4;
}

.excel-option strong {
  display: block;
  color: #263238;
  font-size: 14px;
  margin-bottom: 3px;
}

.excel-option small {
  display: block;
  color: #607d8b;
  font-size: 12px;
  line-height: 1.35;
}

.excel-divider {
  height: 1px;
  background: #eceff1;
  margin: 14px 0;
}

.excel-export-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px 18px;
  border-top: 1px solid #eceff1;
}

.btn-cyan,
.btn-cyan-outline {
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.btn-cyan {
  background: #00a9bd;
  border: 1px solid #00a9bd;
  color: #fff;
}

.btn-cyan-outline {
  background: #fff;
  border: 1px solid #00a9bd;
  color: #00a9bd;
}

@media (max-width: 560px) {
  .excel-export-footer {
    flex-direction: column;
  }

  .btn-cyan,
  .btn-cyan-outline {
    width: 100%;
  }
}
</style>
