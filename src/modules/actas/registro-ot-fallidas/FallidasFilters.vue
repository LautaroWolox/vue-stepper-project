<template>
  <section class="fallidas-accordion">
    <button class="fallidas-header" type="button" @click="$emit('toggle')">
      <span>FILTROS DE BUSQUEDA</span>
      <span>{{ open ? '-' : '+' }}</span>
    </button>

    <div v-show="open" class="fallidas-filter-panel">
      <div class="fallidas-filters-grid">
        <label><span>Nro. OT</span><input v-model.trim="model.nroOt" class="fallidas-input" /></label>
        <label><span>Fecha Cierre OT Desde</span><FallidasDatePicker v-model="model.fechaDesde" placeholder="Seleccionar fecha" /></label>
        <label><span>Fecha Cierre OT Hasta</span><FallidasDatePicker v-model="model.fechaHasta" placeholder="Seleccionar fecha" /></label>
        <label><span>Contratista</span><FmTurquoiseSelect v-model="model.contratista" :options="contratistaOptions" class="fallidas-filter-select" /></label>
        <label><span>Descripcion Error</span><input v-model.trim="model.descripcionError" class="fallidas-input" /></label>
        <label><span>Excluida</span><FmTurquoiseSelect v-model="model.excluida" :options="excluidaOptions" class="fallidas-filter-select fallidas-small-select" /></label>
        <label><span>Pais</span><FmTurquoiseSelect v-model="model.pais" :options="paisOptions" class="fallidas-filter-select fallidas-small-select" /></label>
      </div>

      <div class="fallidas-center-actions">
        <button class="fallidas-btn-primary" :disabled="loading" @click="$emit('search')">
          <span class="material-icons">search</span>
          <span>BUSCAR</span>
        </button>
        <button class="fallidas-btn-secondary" :disabled="loading" @click="$emit('clear')">
          <span class="material-icons">sort</span>
          <span>LIMPIAR</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import FmTurquoiseSelect from '../../../components/shared/FmTurquoiseSelect.vue'
import FallidasDatePicker from './FallidasDatePicker.vue'

defineProps({
  open: Boolean,
  loading: Boolean,
  model: Object,
  contratistaOptions: Array,
  excluidaOptions: Array,
  paisOptions: Array
})
defineEmits(['toggle', 'search', 'clear'])
</script>
