<template>
  <div class="fallidas-screen">
    <FallidasFilters
      :open="state.openFilters.value"
      :loading="state.loading.value"
      :model="state.filters"
      :contratista-options="state.contratistaOptions"
      :excluida-options="state.excluidaOptions"
      :pais-options="state.paisOptions"
      @toggle="state.openFilters.value = !state.openFilters.value"
      @search="state.buscar"
      @clear="state.limpiar"
    />

    <RegistroTableView
      :open="state.openGrid.value"
      :has-rows="state.rows.value.length > 0"
      :columns="state.columns"
      :page-rows="state.pageRows.value"
      :column-filters="state.columnFilters"
      :sort-state="state.sortState"
      :page="state.page.value"
      :per-page="state.perPage.value"
      :total-pages="state.totalPages.value"
      :total-count="state.filteredRows.value.length"
      :from-row="state.fromRow.value"
      :to-row="state.toRow.value"
      :all-visible-selected="state.allVisibleSelected.value"
      :selectable-count="state.selectableVisibleRows.value.length"
      :col-style="state.colStyle"
      :row-class="rowClass"
      @toggle="state.openGrid.value = !state.openGrid.value"
      @toggle-all="state.toggleAllVisible"
      @toggle-row="state.toggleRowSelection"
      @set-row="setRowSelection"
      @sort="state.toggleSort"
      @filter="setColumnFilter"
      @start-resize="state.startColumnResize"
      @reset-width="state.resetColumnWidth"
      @open-nota="state.openNota"
      @open-incluir="state.openIncluir"
      @export="state.exportarIncluidas"
      @exclude="state.openExcluirSeleccionadas"
      @process="state.reprocesar"
      @page="setPage"
      @per-page="setPerPage"
    />

    <div v-if="state.loading.value" class="loader-backdrop">
      <div class="typing-loader">
        <div class="head-dot"></div>
        <div class="screen"><span></span><span></span><span></span></div>
        <p>Procesando OTs...</p>
      </div>
    </div>

    <div v-if="state.notaPopup.show" class="float-modal" :style="modalStyle(state.notaPopup)">
      <div class="float-head" @mousedown="startPopupDrag($event, state.notaPopup)"><span>Detalle Nota</span><button @click="state.notaPopup.show = false">x</button></div>
      <div class="float-body"><textarea v-model="state.notaPopup.row.nota" rows="3"></textarea></div>
      <div class="float-actions"><button class="fallidas-btn-secondary" @click="state.notaPopup.show = false">ACEPTAR</button></div>
    </div>

    <div v-if="state.includePopup.show" class="float-modal include-modal" :style="modalStyle(state.includePopup)">
      <div class="float-head" @mousedown="startPopupDrag($event, state.includePopup)"><span>Alerta</span><button @click="state.includePopup.show = false">x</button></div>
      <div class="float-body">
        <p>¿Confirma que desea recuperar la OT seleccionada?</p>
        <label>Motivo<FmTurquoiseSelect v-model="state.includePopup.motivo" :options="state.motivoOptions" class="popup-select" /></label>
        <label>Nota<textarea v-model="state.includePopup.nota" placeholder="Opcional" rows="3"></textarea></label>
      </div>
      <div class="float-actions">
        <button class="fallidas-btn-secondary" @click="state.includePopup.show = false">CANCELAR</button>
        <button class="fallidas-btn-primary" @click="state.confirmarIncluir">ACEPTAR</button>
      </div>
    </div>

    <div v-if="state.excludePopup.show" class="float-modal include-modal" :style="modalStyle(state.excludePopup)">
      <div class="float-head" @mousedown="startPopupDrag($event, state.excludePopup)"><span>Alerta</span><button @click="state.excludePopup.show = false">x</button></div>
      <div class="float-body">
        <p>¿Confirma que desea excluir la OT seleccionada?</p>
        <label>Motivo<FmTurquoiseSelect v-model="state.excludePopup.motivo" :options="state.motivoOptions" class="popup-select" /></label>
        <label>Nota<textarea v-model="state.excludePopup.nota" placeholder="Opcional" rows="3"></textarea></label>
      </div>
      <div class="float-actions">
        <button class="fallidas-btn-secondary" @click="state.excludePopup.show = false">CANCELAR</button>
        <button class="fallidas-btn-primary" @click="state.confirmarExcluir">ACEPTAR</button>
      </div>
    </div>

    <FmAlertDialog :show="state.alert.show" :title="state.alert.title" :message="state.alert.message" :type="state.alert.type" @close="state.alert.show = false" />
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import './registro-ot-fallidas-screen.css'
import './fallidas-ui-polish.css'
import './fallidas-popup-drag.css'
import FmTurquoiseSelect from '../../../components/shared/FmTurquoiseSelect.vue'
import FmAlertDialog from '../../../components/shared/FmAlertDialog.vue'
import FallidasFilters from './FallidasFilters.vue'
import RegistroTableView from './RegistroTableView.vue'
import { useRegistroOtFallidasScreen } from './useRegistroOtFallidasScreen.js'

const state = useRegistroOtFallidasScreen()
const rowClass = (row) => ({ excluded: row.excluida === 'S', recovered: row.recovered, selected: row.selected, selectable: row.excluida !== 'S' })
const setRowSelection = (row, checked) => { if (row.excluida !== 'S') row.selected = checked }
const setColumnFilter = (field, value) => { state.columnFilters[field] = value; state.page.value = 1 }
const setPage = (value) => { state.page.value = value; state.normalizePage() }
const setPerPage = (value) => { state.perPage.value = value; state.page.value = 1 }
const modalStyle = (popup) => ({ left: `${popup.x}px`, top: `${popup.y}px` })

let draggingPopup = null
let dragOffsetX = 0
let dragOffsetY = 0
let dragModalWidth = 0
let dragModalHeight = 0

const startPopupDrag = (event, popup) => {
  if (event.button !== 0 || event.target.closest('button')) return
  const modal = event.currentTarget.closest('.float-modal')
  if (!modal) return
  const rect = modal.getBoundingClientRect()
  draggingPopup = popup
  dragOffsetX = event.clientX - rect.left
  dragOffsetY = event.clientY - rect.top
  dragModalWidth = rect.width
  dragModalHeight = rect.height
  document.body.classList.add('fallidas-popup-dragging')
  document.addEventListener('mousemove', movePopup)
  document.addEventListener('mouseup', stopPopupDrag)
}

const movePopup = (event) => {
  if (!draggingPopup) return
  const maxX = Math.max(window.innerWidth - dragModalWidth - 8, 8)
  const maxY = Math.max(window.innerHeight - dragModalHeight - 8, 8)
  draggingPopup.x = Math.min(Math.max(event.clientX - dragOffsetX, 8), maxX)
  draggingPopup.y = Math.min(Math.max(event.clientY - dragOffsetY, 8), maxY)
}

const stopPopupDrag = () => {
  draggingPopup = null
  document.body.classList.remove('fallidas-popup-dragging')
  document.removeEventListener('mousemove', movePopup)
  document.removeEventListener('mouseup', stopPopupDrag)
}

onBeforeUnmount(stopPopupDrag)
</script>
