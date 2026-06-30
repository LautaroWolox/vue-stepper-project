<template>
  <section class="fallidas-accordion">
    <button class="fallidas-header" type="button" @click="$emit('toggle')">
      <span>OTS FALLIDAS REPROCESO</span>
      <span>{{ open ? '-' : '+' }}</span>
    </button>

    <div v-show="open" class="fallidas-grid-box" :class="{ expanded: hasRows }">
      <div class="fallidas-grid-scroll">
        <table class="fallidas-table">
          <colgroup>
            <col style="width:38px;min-width:38px;max-width:38px" />
            <col v-for="col in columns" :key="`col-${col.field}`" :style="colStyle(col.field)" />
          </colgroup>

          <thead>
            <tr class="fallidas-head-row">
              <th class="check-col">
                <input type="checkbox" :checked="allVisibleSelected" :disabled="selectableCount === 0" @change="$emit('toggle-all', $event)" />
              </th>
              <th v-for="col in columns" :key="col.field" class="resizable-th" :style="colStyle(col.field)">
                <button class="sort-header" type="button" @click="$emit('sort', col.field)">
                  <span>{{ col.label }}</span>
                  <span class="sort-icons">
                    <span :class="{ on: sortState.field === col.field && sortState.direction === 'asc' }">▲</span>
                    <span :class="{ on: sortState.field === col.field && sortState.direction === 'desc' }">▼</span>
                  </span>
                </button>
                <span class="resize-handle" @mousedown.stop.prevent="$emit('start-resize', $event, col.field)" @dblclick.stop.prevent="$emit('reset-width', col.field)"></span>
              </th>
            </tr>

            <tr class="fallidas-filter-row">
              <th class="check-col"></th>
              <th v-for="col in columns" :key="`f-${col.field}`" :style="colStyle(col.field)">
                <span class="prefix">~</span>
                <input :value="columnFilters[col.field]" @input="$emit('filter', col.field, $event.target.value)" @click.stop />
                <button type="button" @click.stop="$emit('filter', col.field, '')">x</button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="!pageRows.length" class="empty-tr">
              <td :colspan="columns.length + 1">No hay resultados</td>
            </tr>
            <tr v-for="row in pageRows" :key="row.id" :class="rowClass(row)" @click="$emit('toggle-row', row)">
              <td class="check-col" @click.stop>
                <input type="checkbox" :disabled="row.excluida === 'S'" :checked="row.selected" @change="$emit('set-row', row, $event.target.checked)" />
              </td>
              <td v-for="col in columns" :key="`${row.id}-${col.field}`" :style="colStyle(col.field)">
                <button v-if="col.field === 'nota'" class="icon-cell" title="Detalle Nota" @click.stop="$emit('open-nota', row)"><span class="material-icons">edit_note</span></button>
                <button v-else-if="col.field === 'incluir'" class="icon-cell include-icon" :disabled="row.excluida !== 'S'" title="Incluir OT" @click.stop="$emit('open-incluir', row)"><span class="material-icons">settings_backup_restore</span></button>
                <span v-else>{{ row[col.field] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="fallidas-footer">
        <div class="footer-left">
          <button class="footer-icon footer-icon-export" title="Exportar Excel" aria-label="Exportar Excel" @click="$emit('export')">
            <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v10"></path>
              <path d="M8.5 10.8 12 14.3l3.5-3.5"></path>
              <path d="M6 16.5v3h12v-3"></path>
            </svg>
          </button>
          <button class="footer-icon footer-icon-delete" title="Excluir seleccionadas" aria-label="Excluir seleccionadas" @click="$emit('exclude')">
            <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 7h14"></path>
              <path d="M9 7V4.8h6V7"></path>
              <path d="M7 7l.8 13h8.4L17 7"></path>
              <path d="M10 11v5.5"></path>
              <path d="M14 11v5.5"></path>
            </svg>
          </button>
          <button class="footer-icon footer-icon-refresh" title="Reprocesar" aria-label="Reprocesar" @click="$emit('process')">
            <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.2 8.1A6.7 6.7 0 0 1 18.4 11"></path>
              <path d="M18.4 6.3V11h-4.7"></path>
              <path d="M16.8 15.9A6.7 6.7 0 0 1 5.6 13"></path>
              <path d="M5.6 17.7V13h4.7"></path>
            </svg>
          </button>
        </div>
        <div class="footer-pages">
          <button :disabled="page === 1" @click="$emit('page', 1)">|&lt;</button>
          <button :disabled="page === 1" @click="$emit('page', page - 1)">&lt;</button>
          <span>Pagina</span>
          <input :value="page" type="number" min="1" :max="totalPages" @change="$emit('page', Number($event.target.value))" />
          <span>de {{ totalPages }}</span>
          <button :disabled="page >= totalPages" @click="$emit('page', page + 1)">&gt;</button>
          <button :disabled="page >= totalPages" @click="$emit('page', totalPages)">&gt;|</button>
          <select :value="perPage" @change="$emit('per-page', Number($event.target.value))">
            <option :value="10">10</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="500">500</option>
          </select>
        </div>
        <div class="footer-count">Mostrando {{ fromRow }} - {{ toRow }} de {{ totalCount }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  open: Boolean,
  hasRows: Boolean,
  columns: Array,
  pageRows: Array,
  columnFilters: Object,
  sortState: Object,
  page: Number,
  perPage: Number,
  totalPages: Number,
  totalCount: Number,
  fromRow: Number,
  toRow: Number,
  allVisibleSelected: Boolean,
  selectableCount: Number,
  colStyle: Function,
  rowClass: Function
})
defineEmits(['toggle', 'toggle-all', 'toggle-row', 'set-row', 'sort', 'filter', 'start-resize', 'reset-width', 'open-nota', 'open-incluir', 'export', 'exclude', 'process', 'page', 'per-page'])
</script>
