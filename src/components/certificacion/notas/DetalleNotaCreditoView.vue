<template>
  <div class="detalle-nota-view">
    <button class="btn-cyan-outline back-button" type="button" @click="$emit('volver')">VOLVER A BÚSQUEDA</button>

    <section class="fm-box">
      <div class="fm-box-header" @click="openDetalle = !openDetalle"><span>DETALLE DE ACTA DE {{ notaTipoUpper }}</span><span class="material-icons">{{ openDetalle ? 'remove' : 'add' }}</span></div>
      <div v-show="openDetalle" class="fm-box-content form-section">
        <div class="form-grid note-detail-grid">
          <div class="form-group"><label>Numero Nota {{ notaTipoCapitalizada }}</label><input class="form-control" :value="nota?.nro_nota" disabled /></div>
          <div class="form-group"><label>Numero de Acta</label><input class="form-control" :value="nota?.acta" disabled /></div>
          <div class="form-group"><label>Provincia</label><input class="form-control" :value="nota?.prov" disabled /></div>
          <div class="form-group"><label>Empresa Contratista</label><input class="form-control" :value="nota?.contra" disabled /></div>
          <div class="form-group"><label>Sociedad</label><input class="form-control" :value="nota?.soc" disabled /></div>
          <div class="form-group"><label>Tipo de Contrato</label><input class="form-control" :value="nota?.tipo" disabled /></div>
          <div class="form-group"><label>Periodo</label><input class="form-control" :value="nota?.periodo" disabled /></div>
          <div class="form-group"><label>Estado</label><input class="form-control" :value="nota?.estado" disabled /></div>
          <div class="form-group"><label>N° de OT</label><input class="form-control" v-model.trim="otFilter" /></div>
        </div>
        <div class="center-actions"><button class="btn-cyan" type="button" @click="otFilter = ''">CERRAR</button></div>
      </div>
    </section>

    <section class="fm-box">
      <div class="fm-box-header" @click="openOrdenes = !openOrdenes"><span>ORDENES DE TRABAJO</span><span class="material-icons">{{ openOrdenes ? 'remove' : 'add' }}</span></div>
      <div v-show="openOrdenes" class="fm-box-content grid-section">
        <div class="table-wrap">
          <table class="fm-grid">
            <thead>
              <tr><th class="check-col"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th><th v-for="column in otColumns" :key="column.field">{{ column.label }}</th></tr>
              <tr class="filter-row"><th></th><th v-for="column in otColumns" :key="`f-${column.field}`"><div class="col-filter"><span>~</span><input v-model="otColumnFilters[column.field]" @input="currentPage = 1" /><button type="button" @click="clearColumnFilter(column.field)">x</button></div></th></tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedOts" :key="row.nro_ot" :class="{ selected: row.selected }"><td class="check-col"><input type="checkbox" v-model="row.selected" @change="syncSelectAll" /></td><td v-for="column in otColumns" :key="`${row.nro_ot}-${column.field}`"><span v-if="column.field === 'nro_ot'" class="ot-link" @click="openOtDetail(row.nro_ot)">{{ row[column.field] }}</span><span v-else>{{ row[column.field] }}</span></td></tr>
              <tr v-if="paginatedOts.length === 0"><td :colspan="otColumns.length + 1" class="empty-row">No hay OTs para mostrar.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="grid-footer"><div></div><div class="pagination"><button :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button><button :disabled="currentPage === 1" @click="currentPage--">&lt;</button><span>Página</span><input v-model.number="currentPage" type="number" min="1" :max="totalPages" @change="normalizePage" /><span>de {{ totalPages }}</span><button :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button><button :disabled="currentPage >= totalPages" @click="currentPage = totalPages">&gt;|</button><select v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option></select></div><div class="footer-count">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredOts.length }}</div></div>
        <div class="bottom-actions"><button class="btn-cyan" @click="openExportDialog">EXPORTAR NOTA DE {{ notaTipoUpper }}</button><button class="btn-cyan" @click="showConfirm = true">VALIDAR ACTIVIDADES</button></div>
      </div>
    </section>

    <DetalleOtCreditoPopup :show="showOt" :otNumber="selectedOt" @close="showOt = false" />
    <ExportExcelDialog :show="showExportDialog" description="Elegí qué órdenes de trabajo querés exportar a Excel." @close="showExportDialog = false" @confirm="confirmExportExcel" />
    <FmConfirmDialog :show="showConfirm" message="¿Confirma que desea validar las actividades?" @cancel="showConfirm = false" @confirm="confirmValidate" />
    <FmAlertDialog :show="showSuccess" title="Validación realizada" message="Las actividades fueron validadas correctamente." @close="showSuccess = false" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import DetalleOtCreditoPopup from '../../popup/DetalleOtCreditoPopup.vue'
import ExportExcelDialog from '../../shared/ExportExcelDialog.vue'
import FmConfirmDialog from '../../shared/FmConfirmDialog.vue'
import FmAlertDialog from '../../shared/FmAlertDialog.vue'
import { downloadExcel } from '../../../utils/excelExport.js'

const props = defineProps({ nota: { type: Object, required: true }, tipoNota: { type: String, default: 'credito' } })
defineEmits(['volver'])
const openDetalle = ref(true), openOrdenes = ref(true), showOt = ref(false), showExportDialog = ref(false), showConfirm = ref(false), showSuccess = ref(false)
const selectedOt = ref(''), otFilter = ref(''), selectAll = ref(false), currentPage = ref(1), itemsPerPage = ref(10)
const notaTipoCapitalizada = computed(() => props.tipoNota === 'debito' ? 'Debito' : 'Credito')
const notaTipoUpper = computed(() => notaTipoCapitalizada.value.toUpperCase())
const otColumns = [{ field: 'acta', label: 'NUMERO DE ACTA' }, { field: 'nro_ot', label: 'NRO_OT' }, { field: 'fecha_cierre', label: 'FECHA_CIERRE' }, { field: 'codigo_tarea', label: 'CÓDIGO_TAREA' }, { field: 'direccion', label: 'DIRECCION' }, { field: 'ciudad', label: 'CIUDAD' }, { field: 'sector', label: 'SECTOR' }, { field: 'provincia', label: 'PROVINCIA' }, { field: 'pais', label: 'PAIS' }, { field: 'base', label: 'BASE' }, { field: 'region', label: 'REGION' }, { field: 'contratista', label: 'CONTRATISTA' }, { field: 'contrato', label: 'CONTRATO' }, { field: 'sociedad', label: 'SOCIEDAD' }, { field: 'area', label: 'AREA' }, { field: 'tech_num', label: 'TECH_NUM' }, { field: 'reglas', label: 'REGLAS VALIDADAS' }, { field: 'excluida', label: 'EXCLUIDA' }, { field: 'nota', label: 'NOTA' }, { field: 'acts_validadas', label: 'ACTS VALIDADAS' }]
const ots = ref(Array.from({ length: 22 }, (_, index) => ({ selected: false, acta: index === 0 ? (props.nota?.acta || 'A2732') : `A${2732 + index}`, nro_ot: index === 0 ? 'M00966068' : `M0098${String(1720 + index).padStart(4, '0')}`, fecha_cierre: index === 0 ? '13/06/2026 12:04:01' : `13/06/2026 ${String(10 + (index % 8)).padStart(2, '0')}:${String((index * 5) % 60).padStart(2, '0')}:00`, codigo_tarea: '9HDA0 | DOM - ALTAS HFC', direccion: index === 0 ? 'DE LUJAN NTRA SRA 1525' : `CALLE ${index} NRO ${index * 100}`, ciudad: index % 2 ? 'SAN ISIDRO' : 'TRONCOS DEL TALAR', sector: `TRC${String(62 + index).padStart(3, '0')}`, provincia: props.nota?.prov || 'BUENOS AIRES', pais: props.nota?.pais || 'ARGENTINA', base: 'BOULOGNE', region: props.nota?.reg || 'AMBA', contratista: props.nota?.contra || 'NET AND WORK S.A.', contrato: props.nota?.tipo || 'Eventos', sociedad: props.nota?.soc || 'Telecom Argentina S.A.', area: index % 2 ? 'Tigre' : 'San Isidro', tech_num: index === 0 ? '23TID240' : `23TID${240 + index}`, reglas: 'Reglas B Valida', excluida: 'N', nota: '-', acts_validadas: 'N' })))
const otColumnFilters = reactive(Object.fromEntries(otColumns.map((column) => [column.field, ''])))
const normalize = (value) => String(value || '').toLowerCase()
const filteredOts = computed(() => ots.value.filter((row) => (!otFilter.value || normalize(row.nro_ot).includes(normalize(otFilter.value))) && otColumns.every((column) => !normalize(otColumnFilters[column.field]) || normalize(row[column.field]).includes(normalize(otColumnFilters[column.field])))))
const totalPages = computed(() => Math.ceil(filteredOts.value.length / itemsPerPage.value) || 1)
const paginatedOts = computed(() => filteredOts.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredOts.value.length ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredOts.value.length))
const clearColumnFilter = (field) => { otColumnFilters[field] = ''; currentPage.value = 1 }
const normalizePage = () => { if (!currentPage.value || currentPage.value < 1) currentPage.value = 1; if (currentPage.value > totalPages.value) currentPage.value = totalPages.value }
const openOtDetail = (nro) => { selectedOt.value = nro; showOt.value = true }
const toggleSelectAll = () => { paginatedOts.value.forEach((row) => { row.selected = selectAll.value }) }
const syncSelectAll = () => { selectAll.value = paginatedOts.value.length > 0 && paginatedOts.value.every((row) => row.selected) }
const openExportDialog = () => { if (filteredOts.value.length) showExportDialog.value = true }
const confirmExportExcel = ({ scope, columnMode }) => { const rows = scope === 'visibleRows' ? paginatedOts.value : filteredOts.value; downloadExcel({ filename: `Exportar_Nota_${notaTipoCapitalizada.value}.xls`, title: `Nota ${notaTipoCapitalizada.value}`, columns: otColumns, rows, mode: columnMode }); showExportDialog.value = false }
const confirmValidate = () => { showConfirm.value = false; showSuccess.value = true }
watch([filteredOts, totalPages], () => { if (currentPage.value > totalPages.value) currentPage.value = totalPages.value || 1; syncSelectAll() })
</script>

<style scoped>
.detalle-nota-view { color: #111; font-size: 14px; }.back-button { margin-bottom: 10px; }.fm-box { border: 1px solid #d8d8d8; background: #fff; margin-bottom: 8px; }.fm-box-header { height: 32px; display: flex; justify-content: space-between; align-items: center; padding: 0 10px; background: #f7f7f7; border-bottom: 1px solid #d8d8d8; cursor: pointer; }.form-section { border-left: 4px solid #00bcd4; }.note-detail-grid { grid-template-columns: repeat(4, minmax(180px, 1fr)); padding: 12px 20px; gap: 18px; }.form-control { height: 30px; }.center-actions { text-align: center; padding: 15px; border-top: 1px solid #d8d8d8; }.grid-section { padding: 10px; }.table-wrap { overflow: auto; min-height: 430px; border: 1px solid #d1d1d1; border-bottom: 0; }.fm-grid { width: max-content; min-width: 100%; border-collapse: collapse; table-layout: fixed; }.fm-grid th, .fm-grid td { border-right: 1px solid #c9c9c9; border-bottom: 1px solid #c9c9c9; padding: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }.fm-grid th { background: #f7f7f7; font-weight: 500; }.check-col { width: 38px; text-align: center; }.filter-row th { background: #fff; }.col-filter { display: grid; grid-template-columns: 14px 80px 13px; gap: 5px; align-items: center; }.col-filter input { height: 28px; border: 1px solid #c7c7c7; border-radius: 3px; }.col-filter button { border: 0; background: transparent; font-weight: 800; cursor: pointer; }.ot-link { color: #00a9bd; font-weight: 800; cursor: pointer; }.ot-link:hover { text-decoration: underline; }.selected td { background: #e0f7fa; }.empty-row { text-align: center; padding: 30px; color: #607d8b; }.grid-footer { min-height: 38px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 6px 10px; border: 1px solid #d1d1d1; }.pagination { display: flex; align-items: center; gap: 8px; }.pagination button { border: 0; background: transparent; cursor: pointer; }.pagination button:disabled { opacity: .35; cursor: not-allowed; }.pagination input { width: 40px; height: 26px; text-align: center; }.footer-count { justify-self: end; white-space: nowrap; }.bottom-actions { display: flex; justify-content: space-between; padding-top: 14px; }.btn-cyan, .btn-cyan-outline { border-radius: 18px; padding: 8px 18px; font-weight: 800; cursor: pointer; }.btn-cyan { background: #00a9bd; color: #fff; border: 1px solid #00a9bd; }.btn-cyan-outline { background: #fff; color: #00a9bd; border: 1px solid #00a9bd; }@media (max-width: 900px) { .note-detail-grid { grid-template-columns: repeat(2, minmax(180px, 1fr)); } .grid-footer { grid-template-columns: 1fr; justify-items: center; } .bottom-actions { flex-direction: column; gap: 10px; } }@media (max-width: 560px) { .note-detail-grid { grid-template-columns: 1fr; padding: 12px; } .pagination { flex-wrap: wrap; } .btn-cyan, .btn-cyan-outline { width: 100%; } }
</style>
