<template>
  <div class="fallidas-page">
    <section class="thin-accordion">
      <button class="thin-header" type="button" @click="openFilters = !openFilters"><span>FILTROS DE BÚSQUEDA</span><span>{{ openFilters ? '−' : '+' }}</span></button>
      <div v-show="openFilters" class="thin-content filter-box">
        <div class="filters-grid">
          <label>Nro. OT<input v-model.trim="filters.nroOt" /></label>
          <label>Fecha Cierre OT Desde<input v-model="filters.fechaDesde" type="text" /></label>
          <label>Fecha Cierre OT Hasta<input v-model="filters.fechaHasta" type="text" /></label>
          <label>Contratista<select v-model="filters.contratista"><option value=""></option><option v-for="item in contratistas" :key="item" :value="item">{{ item }}</option></select></label>
          <label>Descripcion Error<input v-model.trim="filters.descripcionError" /></label>
          <label>Excluida<select v-model="filters.excluida"><option value=""></option><option value="S">Si</option><option value="N">No</option></select></label>
          <label>País<select v-model="filters.pais"><option value=""></option><option value="ARG">ARG</option><option value="UY">UY</option><option value="PY">PY</option></select></label>
        </div>
        <div class="center-actions"><button class="btn-cyan" :disabled="loading" @click="buscar">BUSCAR</button><button class="btn-outline" :disabled="loading" @click="limpiar">LIMPIAR</button></div>
      </div>
    </section>

    <section class="thin-accordion">
      <button class="thin-header" type="button" @click="openGrid = !openGrid"><span>OTS FALLIDAS REPROCESO</span><span>{{ openGrid ? '−' : '+' }}</span></button>
      <div v-show="openGrid" class="thin-content grid-box">
        <div class="grid-scroll">
          <table class="fallidas-grid">
            <colgroup>
              <col style="width: 38px; min-width: 38px; max-width: 38px;" />
              <col v-for="col in columns" :key="`col-${col.field}`" :style="colStyle(col.field)" />
            </colgroup>
            <thead>
              <tr>
                <th class="check-col"><input type="checkbox" :checked="allPageSelected" @change="toggleAllPage" /></th>
                <th v-for="col in columns" :key="col.field" class="resizable-th" :style="colStyle(col.field)">
                  <button class="sort-header" type="button" :title="`Ordenar por ${col.label}`" @click="toggleSort(col.field)">
                    <span>{{ col.label }}</span>
                    <span class="sort-icons" :class="{ active: sortState.field === col.field }">
                      <span :class="{ on: sortState.field === col.field && sortState.direction === 'asc' }">▲</span>
                      <span :class="{ on: sortState.field === col.field && sortState.direction === 'desc' }">▼</span>
                    </span>
                  </button>
                  <span class="resize-handle" title="Arrastrar para achicar o agrandar columna" @mousedown.stop.prevent="startColumnResize($event, col.field)" @dblclick.stop.prevent="resetColumnWidth(col.field)"></span>
                </th>
              </tr>
              <tr class="filter-row"><th></th><th v-for="col in columns" :key="`f-${col.field}`" :style="colStyle(col.field)"><span>~</span><input v-model="columnFilters[col.field]" @input="page = 1" @click.stop /><button @click.stop="columnFilters[col.field] = ''">x</button></th></tr>
            </thead>
            <tbody>
              <tr v-for="row in pageRows" :key="row.id" :class="{ excluded: row.excluida === 'S', recovered: row.recovered, selected: row.selected, selectable: row.excluida !== 'S' }" @click="toggleRowSelection(row)">
                <td class="check-col"><input type="checkbox" :disabled="row.excluida === 'S'" v-model="row.selected" @click.stop /></td>
                <td v-for="col in columns" :key="`${row.id}-${col.field}`" :style="colStyle(col.field)">
                  <button v-if="col.field === 'nota'" class="icon-cell" title="Detalle Nota" @click.stop="openNota(row)"><span class="material-icons">edit_note</span></button>
                  <button v-else-if="col.field === 'incluir'" class="icon-cell include-icon" :disabled="row.excluida !== 'S'" title="Incluir / recuperar OT" @click.stop="openIncluir(row)"><span class="material-icons">settings_backup_restore</span></button>
                  <span v-else>{{ row[col.field] }}</span>
                </td>
              </tr>
              <tr v-if="pageRows.length === 0"><td :colspan="columns.length + 1" class="empty-row">No hay resultados</td></tr>
            </tbody>
          </table>
        </div>
        <div class="grid-footer">
          <div class="footer-left"><button class="footer-icon" title="Exportar Excel" @click="exportarIncluidas"><span class="material-icons">file_download</span></button><button class="footer-icon" title="Excluir seleccionadas" @click="openExcluirSeleccionadas"><span class="material-icons">delete</span></button><button class="footer-icon footer-reprocess" title="Reprocesar" @click="reprocesar"><span class="material-icons">published_with_changes</span></button></div>
          <div class="footer-pages"><button :disabled="page === 1" @click="page = 1">|&lt;</button><button :disabled="page === 1" @click="page--">&lt;</button><span>Página</span><input v-model.number="page" type="number" min="1" :max="totalPages" @change="normalizePage" /><span>de {{ totalPages }}</span><button :disabled="page >= totalPages" @click="page++">&gt;</button><button :disabled="page >= totalPages" @click="page = totalPages">&gt;|</button><select v-model.number="perPage" @change="page = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option><option :value="500">500</option></select></div>
          <div class="footer-count">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</div>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loader-backdrop"><div class="typing-loader"><div class="head-dot"></div><div class="screen"><span></span><span></span><span></span></div><p>Procesando OTs...</p></div></div>

    <div v-if="notaPopup.show" class="float-modal" :style="modalStyle(notaPopup)">
      <div class="float-head" @mousedown="startModalDrag($event, notaPopup)"><span>Detalle Nota</span><button @click="notaPopup.show = false">×</button></div>
      <div class="float-body"><textarea v-model="notaPopup.row.nota" rows="3"></textarea></div>
      <div class="float-actions"><button class="btn-outline" @click="notaPopup.show = false">ACEPTAR</button></div>
    </div>

    <div v-if="includePopup.show" class="float-modal include-modal" :style="modalStyle(includePopup)">
      <div class="float-head" @mousedown="startModalDrag($event, includePopup)"><span>Alerta</span><button @click="includePopup.show = false">×</button></div>
      <div class="float-body"><p>¿Confirma que desea recuperar la OT seleccionada?</p><label>Motivo<select v-model="includePopup.motivo"><option value=""></option><option v-for="m in motivos" :key="m" :value="m">{{ m }}</option></select></label><label>Nota<textarea v-model="includePopup.nota" placeholder="Opcional" rows="3"></textarea></label></div>
      <div class="float-actions"><button class="btn-outline" @click="includePopup.show = false">CANCELAR</button><button class="btn-cyan" @click="confirmarIncluir">ACEPTAR</button></div>
    </div>

    <div v-if="excludePopup.show" class="float-modal include-modal" :style="modalStyle(excludePopup)">
      <div class="float-head" @mousedown="startModalDrag($event, excludePopup)"><span>Alerta</span><button @click="excludePopup.show = false">×</button></div>
      <div class="float-body"><p>Confirma que desea excluir la OT seleccionada?</p><label>Motivo<select v-model="excludePopup.motivo"><option value=""></option><option v-for="m in motivos" :key="m" :value="m">{{ m }}</option></select></label><label>Nota<textarea v-model="excludePopup.nota" placeholder="Opcional" rows="3"></textarea></label></div>
      <div class="float-actions"><button class="btn-outline" @click="excludePopup.show = false">CANCELAR</button><button class="btn-cyan" @click="openConfirmarExclusion">ACEPTAR</button></div>
    </div>

    <div v-if="confirmExcludePopup.show" class="float-modal include-modal" :style="modalStyle(confirmExcludePopup)">
      <div class="float-head" @mousedown="startModalDrag($event, confirmExcludePopup)"><span>Confirmación</span><button @click="confirmExcludePopup.show = false">×</button></div>
      <div class="float-body"><p>¿Está seguro que este es el motivo que desea?</p><p class="confirm-line"><strong>Motivo:</strong> {{ excludePopup.motivo }}</p><p v-if="excludePopup.nota" class="confirm-line"><strong>Nota:</strong> {{ excludePopup.nota }}</p></div>
      <div class="float-actions"><button class="btn-outline" @click="volverAExclusion">CANCELAR</button><button class="btn-cyan" @click="confirmarExcluir">ACEPTAR</button></div>
    </div>

    <FmAlertDialog :show="alert.show" :title="alert.title" :message="alert.message" @close="alert.show = false" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import FmAlertDialog from '../shared/FmAlertDialog.vue'
import { contratistasFallidasMock, motivosRecuperoFallidasMock } from '../../mocks/registroOtFallidasMock.js'
import { excludeRegistroOtFallidas, includeRegistroOtFallida, processRegistroOtFallidas, searchRegistroOtFallidas } from '../../services/registroOtFallidasService.js'
import { downloadExcel } from '../../utils/excelExport.js'

const openFilters = ref(true), openGrid = ref(true), loading = ref(false), rows = ref([]), page = ref(1), perPage = ref(10)
const contratistas = contratistasFallidasMock, motivos = motivosRecuperoFallidasMock
const filters = reactive({ nroOt: '', fechaDesde: '', fechaHasta: '', contratista: '', descripcionError: '', excluida: '', pais: '' })
const alert = reactive({ show: false, title: 'Alerta', message: '' })
const notaPopup = reactive({ show: false, row: null, x: 420, y: 120 })
const includePopup = reactive({ show: false, row: null, motivo: '', nota: '', x: 430, y: 120 })
const excludePopup = reactive({ show: false, rows: [], motivo: '', nota: '', x: 430, y: 120 })
const confirmExcludePopup = reactive({ show: false, x: 460, y: 160 })
const sortState = reactive({ field: '', direction: '' })
const columns = [
  { field: 'nroOt', label: 'Nro. OT', width: '120px' }, { field: 'fechaCierre', label: 'FECHA CIERRE', width: '135px' }, { field: 'codTarea', label: 'COD TAREA', width: '110px' }, { field: 'direccion', label: 'DIRECCION', width: '150px' }, { field: 'ciudad', label: 'CIUDAD', width: '130px' }, { field: 'provincia', label: 'PROVINCIA', width: '130px' }, { field: 'region', label: 'REGION', width: '110px' }, { field: 'pais', label: 'PAIS', width: '90px' }, { field: 'contratista', label: 'CONTRATISTA', width: '155px' }, { field: 'tecnicoCierre', label: 'TECNICO CIERRE', width: '130px' }, { field: 'actividades', label: 'ACTIVIDADES', width: '160px' }, { field: 'sistemaOrigen', label: 'SISTEMA ORIGEN', width: '130px' }, { field: 'descripcionError', label: 'DESCRIPCION ERROR', width: '180px' }, { field: 'excluida', label: 'EXCLUIDA', width: '105px' }, { field: 'motivoExclusion', label: 'MOTIVO_EXCLUSION', width: '170px' }, { field: 'nota', label: 'NOTA', width: '90px' }, { field: 'incluir', label: 'INCLUIR', width: '90px' }
]
const initialColumnWidths = Object.fromEntries(columns.map((col) => [col.field, Number.parseInt(col.width, 10) || 120]))
const columnWidths = reactive({ ...initialColumnWidths })
const columnFilters = reactive(Object.fromEntries(columns.map((c) => [c.field, ''])))
const norm = (value) => String(value || '').toLowerCase()
const filteredRows = computed(() => rows.value.filter((row) => columns.every((col) => !norm(columnFilters[col.field]) || norm(row[col.field]).includes(norm(columnFilters[col.field])))))
const sortedRows = computed(() => {
  const data = [...filteredRows.value]
  if (!sortState.field || !sortState.direction) return data
  return data.sort((a, b) => {
    const left = String(a[sortState.field] ?? '')
    const right = String(b[sortState.field] ?? '')
    const result = left.localeCompare(right, 'es', { numeric: true, sensitivity: 'base' })
    return sortState.direction === 'asc' ? result : -result
  })
})
const totalPages = computed(() => Math.ceil(sortedRows.value.length / perPage.value) || 1)
const pageRows = computed(() => sortedRows.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))
const fromRow = computed(() => sortedRows.value.length ? ((page.value - 1) * perPage.value) + 1 : 0)
const toRow = computed(() => Math.min(page.value * perPage.value, sortedRows.value.length))
const selectablePageRows = computed(() => pageRows.value.filter((row) => row.excluida !== 'S'))
const allPageSelected = computed(() => selectablePageRows.value.length > 0 && selectablePageRows.value.every((row) => row.selected))
const colStyle = (field) => ({ width: `${columnWidths[field] || 120}px`, minWidth: `${columnWidths[field] || 120}px`, maxWidth: `${columnWidths[field] || 120}px` })
const normalizePage = () => { if (!page.value || page.value < 1) page.value = 1; if (page.value > totalPages.value) page.value = totalPages.value }
const toggleAllPage = (event) => selectablePageRows.value.forEach((row) => { row.selected = event.target.checked })
const toggleRowSelection = (row) => { if (!row || row.excluida === 'S') return; row.selected = !row.selected }
const toggleSort = (field) => { if (sortState.field !== field) { sortState.field = field; sortState.direction = 'asc' } else if (sortState.direction === 'asc') { sortState.direction = 'desc' } else { sortState.field = ''; sortState.direction = '' } page.value = 1 }
const limpiar = () => { Object.assign(filters, { nroOt: '', fechaDesde: '', fechaHasta: '', contratista: '', descripcionError: '', excluida: '', pais: '' }); rows.value = []; page.value = 1 }
const buscar = async () => { loading.value = true; try { rows.value = await searchRegistroOtFallidas({ ...filters }); page.value = 1; if (!rows.value.length) showAlert('Alerta', 'No hay datos para la consulta efectuada') } finally { loading.value = false } }
const exportarIncluidas = () => { const incluidas = filteredRows.value.filter((row) => row.excluida !== 'S'); if (!incluidas.length) return showAlert('Alerta', 'No hay OTs incluidas para exportar.'); downloadExcel({ filename: 'ots_fallidas_incluidas.xls', title: 'OTs Fallidas Incluidas', columns, rows: incluidas }) }
const reprocesar = async () => { const seleccionadas = rows.value.filter((row) => row.selected && row.excluida !== 'S'); if (!seleccionadas.length) return showAlert('Alerta', 'No hay datos para la consulta efectuada'); loading.value = true; try { await processRegistroOtFallidas(seleccionadas); seleccionadas.forEach((row) => { row.selected = false }); showAlert('Reproceso finalizado', 'Las OTs seleccionadas fueron reprocesadas correctamente.') } finally { loading.value = false } }
const openNota = (row) => { notaPopup.row = row; notaPopup.x = Math.max(window.innerWidth / 2 - 270, 20); notaPopup.y = 120; notaPopup.show = true }
const openIncluir = (row) => { includePopup.row = row; includePopup.motivo = ''; includePopup.nota = ''; includePopup.x = Math.max(window.innerWidth / 2 - 285, 20); includePopup.y = 120; includePopup.show = true }
const confirmarIncluir = async () => { if (!includePopup.motivo) return showAlert('Alerta', 'Debe seleccionar un motivo.'); await includeRegistroOtFallida({ nroOt: includePopup.row.nroOt, motivo: includePopup.motivo, nota: includePopup.nota }); includePopup.row.excluida = 'N'; includePopup.row.disabled = false; includePopup.row.motivoExclusion = ''; includePopup.row.incluir = '-'; includePopup.row.recovered = true; includePopup.row.selected = false; includePopup.row.nota = includePopup.nota || includePopup.row.nota; includePopup.show = false; normalizePage() }
const openExcluirSeleccionadas = () => { const seleccionadas = rows.value.filter((row) => row.selected && row.excluida !== 'S'); if (!seleccionadas.length) return showAlert('Alerta', 'Debe seleccionar al menos una OT para excluir.'); excludePopup.rows = seleccionadas; excludePopup.motivo = ''; excludePopup.nota = ''; excludePopup.x = Math.max(window.innerWidth / 2 - 285, 20); excludePopup.y = 120; excludePopup.show = true }
const openConfirmarExclusion = () => { if (!excludePopup.motivo) return showAlert('Alerta', 'Debe seleccionar un motivo.'); excludePopup.show = false; confirmExcludePopup.x = excludePopup.x + 20; confirmExcludePopup.y = excludePopup.y + 30; confirmExcludePopup.show = true }
const volverAExclusion = () => { confirmExcludePopup.show = false; excludePopup.show = true }
const confirmarExcluir = async () => { loading.value = true; try { await excludeRegistroOtFallidas({ ots: excludePopup.rows.map((row) => row.nroOt), motivo: excludePopup.motivo, nota: excludePopup.nota }); excludePopup.rows.forEach((row) => { row.excluida = 'S'; row.disabled = true; row.recovered = false; row.selected = false; row.motivoExclusion = excludePopup.motivo; row.nota = excludePopup.nota || row.nota; row.incluir = 'RECUPERAR' }); confirmExcludePopup.show = false; showAlert('OT excluida', 'La grilla fue actualizada correctamente con la OT excluida.') } finally { loading.value = false; normalizePage() } }
const showAlert = (title, message) => { alert.title = title; alert.message = message; alert.show = true }
const modalStyle = (popup) => ({ left: `${popup.x}px`, top: `${popup.y}px` })
let dragTarget = null, sx = 0, sy = 0, ox = 0, oy = 0
const startModalDrag = (event, popup) => { dragTarget = popup; sx = event.clientX; sy = event.clientY; ox = popup.x; oy = popup.y; document.addEventListener('mousemove', dragModal); document.addEventListener('mouseup', stopModalDrag) }
const dragModal = (event) => { if (!dragTarget) return; dragTarget.x = ox + event.clientX - sx; dragTarget.y = oy + event.clientY - sy }
const stopModalDrag = () => { dragTarget = null; document.removeEventListener('mousemove', dragModal); document.removeEventListener('mouseup', stopModalDrag) }
let resizingField = null, resizeStartX = 0, resizeStartWidth = 0
const startColumnResize = (event, field) => { resizingField = field; resizeStartX = event.clientX; resizeStartWidth = columnWidths[field] || initialColumnWidths[field] || 120; document.body.classList.add('column-resizing'); document.addEventListener('mousemove', resizeColumn); document.addEventListener('mouseup', stopColumnResize) }
const resizeColumn = (event) => { if (!resizingField) return; const nextWidth = resizeStartWidth + event.clientX - resizeStartX; columnWidths[resizingField] = Math.max(38, nextWidth) }
const stopColumnResize = () => { resizingField = null; document.body.classList.remove('column-resizing'); document.removeEventListener('mousemove', resizeColumn); document.removeEventListener('mouseup', stopColumnResize) }
const resetColumnWidth = (field) => { columnWidths[field] = initialColumnWidths[field] || 120 }
onBeforeUnmount(() => { stopModalDrag(); stopColumnResize() })
</script>

<style scoped>
.fallidas-page{font-size:14px;color:#111}.thin-accordion{border:1px solid #d8d8d8;background:white;margin-bottom:6px}.thin-header{width:100%;height:30px;border:0;border-bottom:1px solid #d8d8d8;background:#f7f7f7;display:flex;justify-content:space-between;align-items:center;padding:0 10px;text-align:left;font-size:14px;cursor:pointer}.thin-content{border-left:4px solid #00bcd4}.filters-grid{display:grid;grid-template-columns:repeat(4,minmax(180px,1fr));gap:12px 18px;padding:18px 20px 12px}.filters-grid label{font-weight:700}.filters-grid input,.filters-grid select{display:block;width:100%;height:30px;margin-top:6px;border:1px solid #bdbdbd;border-radius:3px;background:white;padding:4px 8px}.center-actions{display:flex;justify-content:center;gap:8px;padding:14px;border-top:1px solid #d8d8d8}.grid-box{padding:8px}.grid-scroll{height:390px;overflow:auto;border:1px solid #d1d1d1;border-bottom:0}.fallidas-grid{width:max-content;min-width:100%;border-collapse:collapse;table-layout:fixed}.fallidas-grid th,.fallidas-grid td{border-right:1px solid #c9c9c9;border-bottom:1px solid #c9c9c9;padding:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fallidas-grid th{background:#f7f7f7;font-weight:700}.resizable-th{position:relative}.resize-handle{position:absolute;right:-3px;top:0;width:8px;height:100%;cursor:col-resize;z-index:40}.resize-handle:hover{background:rgba(0,188,212,.28)}.sort-header{width:100%;height:100%;border:0;background:transparent;color:#455a64;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;font:inherit;font-weight:800;cursor:pointer;padding:0}.sort-header:hover{color:#008fa1}.sort-icons{display:inline-flex;flex-direction:column;gap:0;font-size:9px;line-height:8px;color:#aab5bc;min-width:10px}.sort-icons .on{color:#00a9bd}.filter-row th{background:white;padding:5px}.filter-row input{width:72px;height:28px;border:1px solid #c7c7c7;border-radius:3px}.filter-row button{border:0;background:transparent;font-weight:800;cursor:pointer}.check-col{width:38px;text-align:center}.fallidas-grid tbody tr.selectable{cursor:pointer}.fallidas-grid tbody tr.selectable:hover td{background-image:linear-gradient(rgba(0,188,212,.075),rgba(0,188,212,.075))}.excluded td{background:#eeeeee;color:#8a8a8a}.recovered td{background:#9eeff7;color:#004a53}.selected td{background:#8de9f4;color:#003f47}.empty-row{text-align:center;padding:30px;color:#607d8b}.icon-cell{width:22px;height:22px;padding:0;border:0;background:transparent;cursor:pointer;color:#263238;display:inline-flex;align-items:center;justify-content:center}.icon-cell .material-icons{font-size:18px;line-height:1}.icon-cell:disabled{opacity:.35;cursor:not-allowed}.include-icon:not(:disabled){color:#00a9bd}.grid-footer{min-height:42px;border:1px solid #d1d1d1;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:6px 10px}.footer-left,.footer-pages{display:flex;align-items:center;gap:7px}.footer-icon,.footer-reprocess{width:24px;height:24px;padding:0;border:0;background:transparent;cursor:pointer;color:#111;display:inline-flex;align-items:center;justify-content:center}.footer-icon .material-icons,.footer-reprocess .material-icons{font-size:18px;line-height:1}.footer-pages button{border:0;background:transparent;cursor:pointer;color:#111;font-size:13px;padding:0 3px}.footer-pages input{width:40px;text-align:center;height:26px}.footer-pages select{height:28px}.footer-count{justify-self:end}.btn-cyan,.btn-outline{border-radius:18px;padding:8px 18px;font-weight:800;cursor:pointer;transition:background-color .2s ease,border-color .2s ease,color .2s ease,box-shadow .2s ease,transform .2s ease}.btn-cyan{background:#00a9bd;color:white;border:1px solid #00a9bd}.btn-cyan:hover:not(:disabled){background:#008fa1;border-color:#008fa1;box-shadow:0 4px 10px rgba(0,143,161,.25)}.btn-outline{background:white;color:#00a9bd;border:1px solid #00a9bd}.btn-outline:hover:not(:disabled){background:#e0f7fa;color:#008fa1;border-color:#008fa1;box-shadow:0 3px 8px rgba(0,143,161,.16)}.float-modal{position:fixed;z-index:8000;width:min(540px,calc(100vw - 24px));background:white;box-shadow:0 16px 45px rgba(0,0,0,.25);border-radius:4px;overflow:hidden}.include-modal{width:min(590px,calc(100vw - 24px))}.float-head{height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-bottom:1px solid #e0e0e0;cursor:move;font-size:18px;color:#444}.float-head button{border:0;background:transparent;font-size:24px;color:#bbb;cursor:pointer}.float-body{padding:14px}.float-body p{margin:0 0 12px}.float-body textarea,.float-body select{width:100%;border:1px solid #bdbdbd;border-radius:3px;padding:8px;margin:6px 0 10px}.float-body select{height:32px}.confirm-line{background:#f7f7f7;border:1px solid #e0e0e0;border-radius:4px;padding:8px}.float-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid #e0e0e0}.loader-backdrop{position:fixed;inset:0;background:rgba(255,255,255,.6);display:flex;align-items:center;justify-content:center;z-index:9000}.typing-loader{width:230px;background:white;border-radius:10px;box-shadow:0 12px 42px rgba(0,0,0,.25);padding:24px;text-align:center;color:#00838f;font-weight:800}.head-dot{width:48px;height:48px;border-radius:50%;margin:0 auto 10px;background:#00bcd4;animation:pulse 1s infinite}.screen{height:38px;border-radius:6px;background:#263238;display:flex;align-items:end;justify-content:center;gap:5px;padding:8px}.screen span{width:24px;height:4px;background:#00bcd4;animation:type .8s infinite alternate}.screen span:nth-child(2){animation-delay:.15s}.screen span:nth-child(3){animation-delay:.3s}@keyframes pulse{50%{transform:scale(1.08)}}@keyframes type{to{height:18px}}@media(max-width:980px){.filters-grid{grid-template-columns:repeat(2,minmax(180px,1fr))}.grid-footer{grid-template-columns:1fr;justify-items:center}.footer-count{justify-self:center}}@media(max-width:560px){.filters-grid{grid-template-columns:1fr;padding:12px}.center-actions,.float-actions{flex-direction:column}.btn-cyan,.btn-outline{width:100%}}
</style>
