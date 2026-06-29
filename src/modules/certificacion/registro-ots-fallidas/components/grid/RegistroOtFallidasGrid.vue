<template>
  <section class="fm-thin-accordion">
    <button class="fm-thin-header" type="button" @click="isOpen = !isOpen">
      <span>OTS FALLIDAS REPROCESO</span>
      <span>{{ isOpen ? '−' : '+' }}</span>
    </button>
    <div v-show="isOpen" class="fm-thin-content grid-content">
      <div class="grid-scroll">
        <table class="fallidas-grid">
          <thead>
            <tr><th class="check-col"><input type="checkbox" :checked="allPageSelected" @change="toggleAllPage" /></th><th v-for="col in columns" :key="col.field" :style="{ width: col.width }">{{ col.label }}</th></tr>
            <tr class="filter-row"><th></th><th v-for="col in columns" :key="`filter-${col.field}`"><span>~</span><input v-model="columnFilters[col.field]" @input="page = 1" /><button @click="columnFilters[col.field] = ''">x</button></th></tr>
          </thead>
          <tbody>
            <tr v-for="row in pageRows" :key="row.id" :class="{ excluded: row.excluida === 'S', selected: row.selected }">
              <td class="check-col"><input type="checkbox" :disabled="row.excluida === 'S'" v-model="row.selected" /></td>
              <td v-for="col in columns" :key="`${row.id}-${col.field}`">
                <button v-if="col.field === 'nota'" class="icon-cell" title="Detalle Nota" @click="$emit('open-note', row)"><span class="material-icons">edit_note</span></button>
                <button v-else-if="col.field === 'incluir'" class="icon-cell include-icon" :disabled="row.excluida !== 'S'" title="Recuperar OT" @click="$emit('open-include', row)"><span class="material-icons">settings_backup_restore</span></button>
                <span v-else>{{ row[col.field] }}</span>
              </td>
            </tr>
            <tr v-if="pageRows.length === 0"><td :colspan="columns.length + 1" class="empty-row">No hay resultados</td></tr>
          </tbody>
        </table>
      </div>
      <div class="grid-footer">
        <div class="footer-left">
          <button class="footer-icon" title="Exportar Excel" @click="$emit('export')"><span class="material-icons">file_download</span></button>
          <button class="footer-icon" title="Limpiar selección" @click="clearSelection"><span class="material-icons">delete</span></button>
          <button class="footer-icon" title="Reprocesar" @click="$emit('reprocess')"><span class="material-icons">published_with_changes</span></button>
        </div>
        <div class="footer-pages"><button :disabled="page === 1" @click="page = 1">|&lt;</button><button :disabled="page === 1" @click="page--">&lt;</button><span>Página</span><input v-model.number="page" type="number" min="1" :max="totalPages" @change="normalizePage" /><span>de {{ totalPages }}</span><button :disabled="page >= totalPages" @click="page++">&gt;</button><button :disabled="page >= totalPages" @click="page = totalPages">&gt;|</button><select v-model.number="perPage" @change="page = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option><option :value="500">500</option></select></div>
        <div class="footer-count">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { registroOtFallidasColumns as columns } from '../../constants.js'

const props = defineProps({ rows: { type: Array, default: () => [] } })
defineEmits(['open-note', 'open-include', 'export', 'reprocess'])
const isOpen = ref(true)
const page = ref(1)
const perPage = ref(10)
const columnFilters = reactive(Object.fromEntries(columns.map((c) => [c.field, ''])))
const norm = (value) => String(value || '').toLowerCase()
const filteredRows = computed(() => props.rows.filter((row) => columns.every((col) => !norm(columnFilters[col.field]) || norm(row[col.field]).includes(norm(columnFilters[col.field])))))
const totalPages = computed(() => Math.ceil(filteredRows.value.length / perPage.value) || 1)
const pageRows = computed(() => filteredRows.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))
const fromRow = computed(() => filteredRows.value.length ? ((page.value - 1) * perPage.value) + 1 : 0)
const toRow = computed(() => Math.min(page.value * perPage.value, filteredRows.value.length))
const selectablePageRows = computed(() => pageRows.value.filter((row) => row.excluida !== 'S'))
const allPageSelected = computed(() => selectablePageRows.value.length > 0 && selectablePageRows.value.every((row) => row.selected))
const normalizePage = () => { if (!page.value || page.value < 1) page.value = 1; if (page.value > totalPages.value) page.value = totalPages.value }
const toggleAllPage = (event) => selectablePageRows.value.forEach((row) => { row.selected = event.target.checked })
const clearSelection = () => props.rows.forEach((row) => { row.selected = false })
</script>

<style scoped>
.grid-content { border-left: 3px solid #00bcd4; padding: 7px; }
.grid-scroll { height: 390px; overflow: auto; border: 1px solid #d1d1d1; border-bottom: 0; }
.fallidas-grid { width: max-content; min-width: 100%; border-collapse: collapse; }
.fallidas-grid th, .fallidas-grid td { border-right: 1px solid #c9c9c9; border-bottom: 1px solid #c9c9c9; padding: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fallidas-grid th { background: #f7f7f7; font-weight: 700; }
.filter-row th { background: #fff; padding: 4px; }
.filter-row input { width: 72px; height: 26px; border: 1px solid #c7c7c7; border-radius: 3px; }
.filter-row button { border: 0; background: transparent; font-weight: 800; cursor: pointer; }
.check-col { width: 36px; text-align: center; }
.excluded td { background: #eee; color: #8a8a8a; }
.selected td { background: #dff7fb; }
.empty-row { text-align: center; padding: 28px; color: #607d8b; }
.icon-cell, .footer-icon { width: 24px; height: 24px; padding: 0; border: 0; background: transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #111; }
.icon-cell .material-icons, .footer-icon .material-icons { font-size: 18px; line-height: 1; }
.icon-cell:disabled { opacity: .35; cursor: not-allowed; }
.include-icon:not(:disabled), .footer-icon:hover { color: #00a9bd; }
.grid-footer { min-height: 40px; border: 1px solid #d1d1d1; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; padding: 5px 10px; }
.footer-left, .footer-pages { display: flex; align-items: center; gap: 7px; }
.footer-pages button { border: 0; background: transparent; cursor: pointer; color: #111; font-size: 13px; padding: 0 3px; }
.footer-pages input { width: 40px; text-align: center; height: 24px; }
.footer-pages select { height: 26px; }
.footer-count { justify-self: end; }
@media (max-width: 980px) { .grid-footer { grid-template-columns: 1fr; justify-items: center; } .footer-count { justify-self: center; } }
</style>
