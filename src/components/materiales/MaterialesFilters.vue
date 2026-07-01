<template>
  <div class="materiales-filter-accordion">
    <button class="materiales-accordion-header" type="button" @click="openFilters = !openFilters">
      <span>FILTROS DE BÚSQUEDA - {{ title }}</span>
      <span>{{ openFilters ? '-' : '+' }}</span>
    </button>

    <div class="materiales-accordion-content" v-show="openFilters">
      <div class="materiales-form-grid">
        <div class="materiales-form-group">
          <label>Región *</label>
          <select class="materiales-control" :class="{ 'input-error': errorRegion }" v-model="form.region">
            <option value=""></option>
            <option value="AMBA">AMBA</option>
            <option value="CEN">Centro</option>
            <option value="NOR">Norte</option>
          </select>
          <span class="error-text" v-if="errorRegion">Debe seleccionar una Región para buscar.</span>
        </div>

        <div class="materiales-form-group">
          <label>Sub Región</label>
          <select class="materiales-control" v-model="form.subRegion">
            <option value=""></option>
            <option value="CABA">CABA</option>
            <option value="GBA">GBA</option>
          </select>
        </div>

        <div class="materiales-form-group">
          <label>Centro Logístico</label>
          <select class="materiales-control" v-model="form.centro">
            <option value=""></option>
            <option value="CL1">Logística Norte</option>
          </select>
        </div>

        <div class="materiales-form-group">
          <label>Almacén</label>
          <select class="materiales-control" v-model="form.almacen">
            <option value=""></option>
            <option value="A-0">A-0</option>
            <option value="A-1">A-1</option>
            <option value="A-2">A-2</option>
          </select>
        </div>

        <div class="materiales-form-group">
          <label>Técnico</label>
          <input type="text" class="materiales-control" v-model="form.tecnico" placeholder="Buscar técnico...">
        </div>

        <div class="materiales-form-group">
          <label>Nro. OT</label>
          <input type="text" class="materiales-control" v-model="form.ot" placeholder="Ej: OT-1001">
        </div>

        <div class="materiales-form-group">
          <label>Fecha Ult. Modif. Desde</label>
          <MaterialesDatePicker v-model="form.fechaDesde" placeholder="Seleccionar fecha" />
        </div>

        <div class="materiales-form-group">
          <label>Fecha Ult. Modif. Hasta</label>
          <MaterialesDatePicker v-model="form.fechaHasta" placeholder="Seleccionar fecha" :disabled="!form.fechaDesde" />
        </div>
      </div>

      <div class="materiales-actions">
        <button class="materiales-btn-primary" @click="handleSearch">
          <span class="material-icons">search</span>
          <span>BUSCAR</span>
        </button>
        <button class="materiales-btn-secondary" @click="resetForm">
          <span class="material-icons">sort</span>
          <span>LIMPIAR</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import MaterialesDatePicker from './MaterialesDatePicker.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['search', 'reset'])

const openFilters = ref(true)
const errorRegion = ref(false)

const emptyForm = () => ({
  region: '',
  subRegion: '',
  centro: '',
  almacen: '',
  tecnico: '',
  ot: '',
  fechaDesde: '',
  fechaHasta: ''
})

const form = reactive(emptyForm())

const handleSearch = () => {
  errorRegion.value = false

  if (!form.region) {
    errorRegion.value = true
    return
  }

  openFilters.value = false
  emit('search', { ...form })
}

const resetForm = () => {
  Object.assign(form, emptyForm())
  errorRegion.value = false
  openFilters.value = true
  emit('reset')
}
</script>

<style scoped>
.materiales-filter-accordion {
  border: 1px solid #d1d1d1;
  background: #fff;
  margin-bottom: 8px;
  border-left: 4px solid #00bcd4;
}

.materiales-accordion-header {
  width: 100%;
  height: 32px;
  border: 0;
  border-bottom: 1px solid #d1d1d1;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 13px;
  color: #263238;
  cursor: pointer;
  font-weight: 400;
}

.materiales-accordion-content {
  background: #fff;
}

.materiales-form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  column-gap: 20px;
  row-gap: 12px;
  padding: 16px 22px 14px;
}

.materiales-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.materiales-form-group label {
  font-size: 12px;
  color: #000;
  font-weight: 600;
}

.materiales-control {
  height: 30px;
  min-height: 30px;
  border: 1px solid #bdbdbd;
  border-radius: 3px;
  background: #fff;
  padding: 4px 8px;
  font-size: 12px;
  box-sizing: border-box;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
  accent-color: #00bcd4;
}

.materiales-control:focus,
.materiales-control:hover {
  border-color: #00a9bd;
}

.materiales-control:focus {
  box-shadow: 0 0 0 2px rgba(0,188,212,.20);
}

.materiales-control.input-error {
  border-color: #c62828;
}

.error-text {
  color: #c62828;
  font-size: 11px;
}

.materiales-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0 14px;
  border-top: 1px solid #d1d1d1;
}

.materiales-btn-primary,
.materiales-btn-secondary {
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .2px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,.12);
  transition: background-color .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease;
}

.materiales-btn-primary .material-icons,
.materiales-btn-secondary .material-icons {
  font-size: 15px;
  line-height: 1;
}

.materiales-btn-primary {
  background: #00a9bd;
  border: 1px solid #00a9bd;
  color: #fff;
}

.materiales-btn-primary:hover {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 5px 12px rgba(0,143,161,.28);
}

.materiales-btn-secondary {
  background: #fff;
  border: 1px solid #00a9bd;
  color: #00a9bd;
}

.materiales-btn-secondary:hover {
  background: #e0f7fa;
  border-color: #008fa1;
  color: #008fa1;
  box-shadow: 0 5px 12px rgba(0,143,161,.18);
}

@media (max-width: 1200px) {
  .materiales-form-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 640px) {
  .materiales-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
