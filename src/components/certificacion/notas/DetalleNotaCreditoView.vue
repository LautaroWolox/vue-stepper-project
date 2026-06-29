<template>
  <div class="detalle-nota-view">
    <button class="btn-cyan-outline back-button" type="button" @click="$emit('volver')">VOLVER A BÚSQUEDA</button>
    <section class="fm-box">
      <div class="fm-box-header" @click="openDetalle = !openDetalle"><span>DETALLE DE ACTA DE {{ notaTipoUpper }}</span><span class="material-icons">{{ openDetalle ? 'remove' : 'add' }}</span></div>
      <div v-show="openDetalle" class="fm-box-content form-section">
        <div class="form-grid note-detail-grid">
          <div v-for="field in detailFields" :key="field.label" class="form-group"><label>{{ field.label }}</label><input class="form-control" :value="field.value" disabled /></div>
          <div class="form-group"><label>N° de OT</label><input class="form-control" v-model.trim="otFilter" /></div>
        </div>
        <div class="center-actions"><button class="btn-cyan" type="button" @click="otFilter = ''">CERRAR</button></div>
      </div>
    </section>
    <section class="fm-box">
      <div class="fm-box-header" @click="openOrdenes = !openOrdenes"><span>ORDENES DE TRABAJO</span><span class="material-icons">{{ openOrdenes ? 'remove' : 'add' }}</span></div>
      <div v-show="openOrdenes" class="fm-box-content grid-section">
        <div class="table-wrap"><table class="fm-grid"><thead><tr><th></th><th v-for="column in otColumns" :key="column.field">{{ column.label }}</th></tr><tr class="filter-row"><th></th><th v-for="column in otColumns" :key="`f-${column.field}`"><input v-model="otColumnFilters[column.field]" @input="currentPage = 1" /></th></tr></thead><tbody><tr v-for="row in paginatedOts" :key="row.nro_ot"><td><input type="checkbox" v-model="row.selected" /></td><td v-for="column in otColumns" :key="`${row.nro_ot}-${column.field}`"><span v-if="column.field === 'nro_ot'" class="ot-link" @click="openOtDetail(row.nro_ot)">{{ row[column.field] }}</span><span v-else>{{ row[column.field] }}</span></td></tr></tbody></table></div>
        <div class="grid-footer"><button @click="currentPage = Math.max(1, currentPage - 1)">&lt;</button><span>Página {{ currentPage }} de {{ totalPages }}</span><button @click="currentPage = Math.min(totalPages, currentPage + 1)">&gt;</button><select v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option></select><span>Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredOts.length }}</span></div>
        <div class="bottom-actions"><button class="btn-cyan" @click="openExportDialog">EXPORTAR NOTA DE {{ notaTipoUpper }}</button><button class="btn-cyan" @click="showConfirm = true">VALIDAR ACTIVIDADES</button></div>
      </div>
    </section>
    <DetalleOtNotaPopup :show="showOt" :otNumber="selectedOt" @close="showOt = false" />
    <ExportExcelDialog :show="showExportDialog" description="Elegí qué órdenes de trabajo querés exportar a Excel." @close="showExportDialog = false" @confirm="confirmExportExcel" />
    <FmConfirmDialog :show="showConfirm" message="¿Confirma que desea validar las actividades?" @cancel="showConfirm = false" @confirm="confirmValidate" />
    <FmAlertDialog :show="showSuccess" title="Validación realizada" message="Las actividades fueron validadas correctamente." @close="showSuccess = false" />
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import DetalleOtNotaPopup from './DetalleOtNotaPopup.vue'
import ExportExcelDialog from '../../shared/ExportExcelDialog.vue'
import FmConfirmDialog from '../../shared/FmConfirmDialog.vue'
import FmAlertDialog from '../../shared/FmAlertDialog.vue'
import { downloadExcel } from '../../../utils/excelExport.js'
const props = defineProps({ nota: { type: Object, required: true }, tipoNota: { type: String, default: 'credito' } })
defineEmits(['volver'])
const openDetalle = ref(true), openOrdenes = ref(true), showOt = ref(false), showExportDialog = ref(false), showConfirm = ref(false), showSuccess = ref(false)
const selectedOt = ref(''), otFilter = ref(''), currentPage = ref(1), itemsPerPage = ref(10)
const notaTipoCapitalizada = computed(() => props.tipoNota === 'debito' ? 'Debito' : 'Credito')
const notaTipoUpper = computed(() => notaTipoCapitalizada.value.toUpperCase())
const detailFields = computed(() => [{ label: `Numero Nota ${notaTipoCapitalizada.value}`, value: props.nota?.nro_nota }, { label: 'Numero de Acta', value: props.nota?.acta }, { label: 'Provincia', value: props.nota?.prov }, { label: 'Empresa Contratista', value: props.nota?.contra }, { label: 'Sociedad', value: props.nota?.soc }, { label: 'Tipo de Contrato', value: props.nota?.tipo }, { label: 'Periodo', value: props.nota?.periodo }, { label: 'Estado', value: props.nota?.estado }])
const otColumns = [{ field: 'acta', label: 'NUMERO DE ACTA' }, { field: 'nro_ot', label: 'NRO_OT' }, { field: 'fecha_cierre', label: 'FECHA_CIERRE' }, { field: 'codigo_tarea', label: 'CÓDIGO_TAREA' }, { field: 'direccion', label: 'DIRECCION' }, { field: 'ciudad', label: 'CIUDAD' }, { field: 'sector', label: 'SECTOR' }, { field: 'provincia', label: 'PROVINCIA' }, { field: 'pais', label: 'PAIS' }, { field: 'base', label: 'BASE' }, { field: 'region', label: 'REGION' }, { field: 'contratista', label: 'CONTRATISTA' }, { field: 'contrato', label: 'CONTRATO' }, { field: 'sociedad', label: 'SOCIEDAD' }, { field: 'area', label: 'AREA' }, { field: 'tech_num', label: 'TECH_NUM' }, { field: 'reglas', label: 'REGLAS VALIDADAS' }, { field: 'excluida', label: 'EXCLUIDA' }, { field: 'nota', label: 'NOTA' }, { field: 'acts_validadas', label: 'ACTS VALIDADAS' }]
const ots = ref(Array.from({ length: 22 }, (_, i) => ({ selected: false, acta: i === 0 ? (props.nota?.acta || 'A2732') : `A${2732 + i}`, nro_ot: i === 0 ? 'M00966068' : `M0098${String(1720 + i).padStart(4, '0')}`, fecha_cierre: '13/06/2026 12:04:01', codigo_tarea: '9HDA0 | DOM - ALTAS HFC', direccion: i === 0 ? 'DE LUJAN NTRA SRA 1525' : `CALLE ${i} NRO ${i * 100}`, ciudad: 'TRONCOS DEL TALAR', sector: 'TRC062', provincia: props.nota?.prov || 'BUENOS AIRES', pais: props.nota?.pais || 'ARGENTINA', base: 'BOULOGNE', region: props.nota?.reg || 'AMBA', contratista: props.nota?.contra || 'NET AND WORK S.A.', contrato: props.nota?.tipo || 'Eventos', sociedad: props.nota?.soc || 'Telecom Argentina S.A.', area: 'Tigre', tech_num: '23TID240', reglas: 'Reglas B Valida', excluida: 'N', nota: '-', acts_validadas: 'N' })))
const otColumnFilters = reactive(Object.fromEntries(otColumns.map(c => [c.field, ''])))
const normalize = v => String(v || '').toLowerCase()
const filteredOts = computed(() => ots.value.filter(row => (!otFilter.value || normalize(row.nro_ot).includes(normalize(otFilter.value))) && otColumns.every(c => !normalize(otColumnFilters[c.field]) || normalize(row[c.field]).includes(normalize(otColumnFilters[c.field])))))
const totalPages = computed(() => Math.ceil(filteredOts.value.length / itemsPerPage.value) || 1)
const paginatedOts = computed(() => filteredOts.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredOts.value.length ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredOts.value.length))
const openOtDetail = nro => { selectedOt.value = nro; showOt.value = true }
const openExportDialog = () => { showExportDialog.value = true }
const confirmExportExcel = ({ scope, columnMode }) => { const rows = scope === 'visibleRows' ? paginatedOts.value : filteredOts.value; downloadExcel({ filename: `Exportar_Nota_${notaTipoCapitalizada.value}.xls`, title: `Nota ${notaTipoCapitalizada.value}`, columns: otColumns, rows, mode: columnMode }); showExportDialog.value = false }
const confirmValidate = () => { showConfirm.value = false; showSuccess.value = true }
</script>
<style scoped>
.detalle-nota-view { color:#111; font-size:14px }.back-button{margin-bottom:10px}.fm-box{border:1px solid #d8d8d8;background:#fff;margin-bottom:8px}.fm-box-header{height:32px;display:flex;justify-content:space-between;align-items:center;padding:0 10px;background:#f7f7f7;border-bottom:1px solid #d8d8d8;cursor:pointer}.form-section{border-left:4px solid #00bcd4}.note-detail-grid{grid-template-columns:repeat(4,minmax(180px,1fr));padding:12px 20px;gap:18px}.center-actions{text-align:center;padding:15px}.grid-section{padding:10px}.table-wrap{overflow:auto;min-height:430px;border:1px solid #d1d1d1}.fm-grid{width:max-content;min-width:100%;border-collapse:collapse}.fm-grid th,.fm-grid td{border:1px solid #c9c9c9;padding:8px;white-space:nowrap}.fm-grid th{background:#f7f7f7}.filter-row input{width:80px;height:26px}.ot-link{color:#00a9bd;font-weight:800;cursor:pointer}.grid-footer{display:flex;justify-content:center;align-items:center;gap:10px;padding:7px;border:1px solid #d1d1d1}.grid-footer input{width:40px}.bottom-actions{display:flex;justify-content:space-between;padding-top:14px}.btn-cyan,.btn-cyan-outline{border-radius:18px;padding:8px 18px;font-weight:800;cursor:pointer}.btn-cyan{background:#00a9bd;color:#fff;border:1px solid #00a9bd}.btn-cyan-outline{background:#fff;color:#00a9bd;border:1px solid #00a9bd}@media(max-width:900px){.note-detail-grid{grid-template-columns:repeat(2,minmax(180px,1fr))}.bottom-actions{flex-direction:column;gap:10px}}@media(max-width:560px){.note-detail-grid{grid-template-columns:1fr}.btn-cyan,.btn-cyan-outline{width:100%}}
</style>
