<template>
  <div class="soft-accordion">
    <div class="soft-accordion-header" @click="openFilters = !openFilters">
      <span><span class="material-icons" style="vertical-align: middle;">filter_alt</span> FILTROS DE BÚSQUEDA - {{ title }}</span>
      <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
    </div>

    <div class="soft-accordion-content" v-show="openFilters">
      <div class="form-grid">
        <div class="form-group">
          <label>Región *</label>
          <select class="form-control" :class="{ 'input-error': errorRegion }" v-model="form.region">
            <option value=""></option>
            <option value="AMBA">AMBA</option>
            <option value="CEN">Centro</option>
            <option value="NOR">Norte</option>
          </select>
          <span class="error-text" v-if="errorRegion">Debe seleccionar una Región para buscar.</span>
        </div>

        <div class="form-group">
          <label>Sub Región</label>
          <select class="form-control" v-model="form.subRegion">
            <option value=""></option>
            <option value="CABA">CABA</option>
            <option value="GBA">GBA</option>
          </select>
        </div>

        <div class="form-group">
          <label>Centro Logístico</label>
          <select class="form-control" v-model="form.centro">
            <option value=""></option>
            <option value="CL1">Logística Norte</option>
          </select>
        </div>

        <div class="form-group">
          <label>Almacén</label>
          <select class="form-control" v-model="form.almacen">
            <option value=""></option>
            <option value="A-0">A-0</option>
            <option value="A-1">A-1</option>
            <option value="A-2">A-2</option>
          </select>
        </div>

        <div class="form-group">
          <label>Técnico</label>
          <input type="text" class="form-control" v-model="form.tecnico" placeholder="Buscar técnico...">
        </div>

        <div class="form-group">
          <label>Nro. OT</label>
          <input type="text" class="form-control" v-model="form.ot" placeholder="Ej: OT-1001">
        </div>

        <div class="form-group">
          <label>Fecha Ult. Modif. Desde</label>
          <input type="date" class="form-control" v-model="form.fechaDesde">
        </div>

        <div class="form-group">
          <label>Fecha Ult. Modif. Hasta</label>
          <input type="date" class="form-control" v-model="form.fechaHasta" :disabled="!form.fechaDesde">
        </div>
      </div>

      <div style="text-align: center; margin-top: 10px;">
        <button class="btn" @click="handleSearch" style="margin-right: 10px;">
          <span class="material-icons btn-icon">search</span> BUSCAR
        </button>
        <button class="btn btn-danger" @click="resetForm">
          <span class="material-icons btn-icon">clear_all</span> LIMPIAR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

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