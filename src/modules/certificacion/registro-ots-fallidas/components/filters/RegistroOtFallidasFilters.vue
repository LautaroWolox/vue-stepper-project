<template>
  <section class="fm-thin-accordion">
    <button class="fm-thin-header" type="button" @click="isOpen = !isOpen">
      <span>FILTROS DE BÚSQUEDA</span>
      <span>{{ isOpen ? '−' : '+' }}</span>
    </button>
    <div v-show="isOpen" class="fm-thin-content filters-content">
      <div class="filters-grid">
        <label>Nro. OT<input v-model.trim="localFilters.nroOt" /></label>
        <label>Fecha Cierre OT Desde<input v-model="localFilters.fechaDesde" type="text" /></label>
        <label>Fecha Cierre OT Hasta<input v-model="localFilters.fechaHasta" type="text" /></label>
        <label>Contratista<select v-model="localFilters.contratista"><option value=""></option><option v-for="item in contratistas" :key="item" :value="item">{{ item }}</option></select></label>
        <label>Descripcion Error<input v-model.trim="localFilters.descripcionError" /></label>
        <label>Excluida<select v-model="localFilters.excluida"><option value=""></option><option value="S">Si</option><option value="N">No</option></select></label>
        <label>País<select v-model="localFilters.pais"><option value=""></option><option value="ARG">ARG</option><option value="UY">UY</option><option value="PY">PY</option></select></label>
      </div>
      <div class="center-actions">
        <button class="btn-cyan fm-small-btn" :disabled="loading" @click="$emit('search', { ...localFilters })">BUSCAR</button>
        <button class="btn-outline fm-small-btn" :disabled="loading" @click="clear">LIMPIAR</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { emptyRegistroOtFallidasFilters } from '../../constants.js'

const props = defineProps({ contratistas: { type: Array, default: () => [] }, loading: Boolean })
const emit = defineEmits(['search', 'clear'])
const isOpen = ref(true)
const localFilters = reactive(emptyRegistroOtFallidasFilters())

const clear = () => {
  Object.assign(localFilters, emptyRegistroOtFallidasFilters())
  emit('clear')
}
</script>

<style scoped>
.filters-content { border-left: 3px solid #00bcd4; }
.filters-grid { display: grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: 10px 16px; padding: 14px 18px 10px; }
.filters-grid label { font-weight: 700; font-size: 13px; }
.filters-grid input, .filters-grid select { display: block; width: 100%; height: 28px; margin-top: 5px; border: 1px solid #bdbdbd; border-radius: 3px; background: #fff; padding: 3px 7px; font-size: 13px; }
.center-actions { display: flex; justify-content: center; gap: 8px; padding: 12px; border-top: 1px solid #d8d8d8; }
@media (max-width: 980px) { .filters-grid { grid-template-columns: repeat(2, minmax(180px, 1fr)); } }
@media (max-width: 560px) { .filters-grid { grid-template-columns: 1fr; padding: 12px; } .center-actions { flex-direction: column; } }
</style>
