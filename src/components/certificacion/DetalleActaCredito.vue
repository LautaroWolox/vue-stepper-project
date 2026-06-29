<template>
  <div style="position: relative;">
    <div style="margin-bottom: 15px;"><button class="btn btn-danger" style="border-radius: 20px; padding: 8px 25px;" @click="$emit('volver')"><span class="material-icons btn-icon">arrow_back</span> VOLVER A BÚSQUEDA</button></div>

    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openDetalle = !openDetalle">
        <span><span class="material-icons">info</span> DETALLE DE ACTA DE {{ notaTipoUpper }}</span>
        <span class="material-icons">{{ openDetalle ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openDetalle">
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="form-group"><label>Numero Nota {{ notaTipoCapitalizada }}</label><input type="text" class="form-control" :value="nota?.nro_nota" disabled></div>
          <div class="form-group"><label>Numero de Acta</label><input type="text" class="form-control" :value="nota?.acta" disabled></div>
          <div class="form-group"><label>Provincia</label><input type="text" class="form-control" :value="nota?.prov" disabled></div>
          <div class="form-group"><label>Empresa Contratista</label><input type="text" class="form-control" :value="nota?.contra" disabled></div>
        </div>
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr); border-bottom: 2px solid #eceff1; padding-bottom: 15px; margin-bottom: 15px;">
          <div class="form-group"><label>Sociedad</label><input type="text" class="form-control" :value="nota?.soc" disabled></div>
          <div class="form-group"><label>Tipo de Contrato</label><input type="text" class="form-control" :value="nota?.tipo" disabled></div>
          <div class="form-group"><label>Periodo</label><input type="text" class="form-control" :value="nota?.periodo" disabled></div>
          <div class="form-group"><label>Estado</label><input type="text" class="form-control" :value="nota?.estado" disabled></div>
        </div>
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="form-group"><label>N° de OT</label><input type="text" class="form-control" v-model="otFilter"></div>
        </div>
        <div style="text-align: center; margin-top: 10px;"><button class="btn" style="border-radius: 20px; padding: 10px 30px; background: #00bcd4;" @click="otFilter = ''">CERRAR</button></div>
      </div>
    </div>

    <!-- OTs de la Nota -->
    <div class="soft-accordion">
      <div class="soft-accordion-header"><span><span class="material-icons">manage_accounts</span> ORDENES DE TRABAJO</span></div>
      <div class="soft-accordion-content" style="padding: 0;">
        <div class="table-responsive" style="border: none; max-height: 400px;">
          <table class="advanced-grid">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;"><input type="checkbox" class="custom-checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
                <th><div class="resizable-header">NUMERO DE ACTA</div></th><th><div class="resizable-header">NRO_OT</div></th>
                <th><div class="resizable-header">FECHA_CIERRE</div></th><th><div class="resizable-header">CÓDIGO_TAREA</div></th>
                <th><div class="resizable-header">DIRECCION</div></th><th><div class="resizable-header">CIUDAD</div></th>
                <th><div class="resizable-header">SECTOR</div></th><th><div class="resizable-header">PROVINCIA</div></th>
                <th><div class="resizable-header">PAIS</div></th><th><div class="resizable-header">BASE</div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filteredOts" :key="row.nro_ot" :class="{ 'active-row': row.selected }">
                <td style="text-align: center;"><input type="checkbox" class="custom-checkbox" v-model="row.selected" @change="syncSelectAll"></td>
                <td>{{ nota?.acta }}</td>
                <td><span class="clickable-link" @click="openOtDetail(row.nro_ot)">{{ row.nro_ot }}</span></td>
                <td>{{ row.fecha_cierre }}</td><td>{{ row.codigo_tarea }}</td><td>{{ row.direccion }}</td><td>{{ row.ciudad }}</td>
                <td>{{ row.sector }}</td><td>{{ row.provincia }}</td><td>{{ row.pais }}</td><td>{{ row.base }}</td>
              </tr>
              <tr v-if="filteredOts.length === 0"><td colspan="11" style="text-align: center; padding: 30px;">No hay OTs para mostrar.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="grid-footer">
          <div class="grid-footer-left"></div>
          <div class="modern-pagination">
            <span class="material-icons icon-nav disabled">first_page</span><span class="material-icons icon-nav disabled">chevron_left</span>
            <span>Página <input type="number" value="1" disabled style="width: 30px;"> de 1</span>
            <span class="material-icons icon-nav disabled">chevron_right</span><span class="material-icons icon-nav disabled">last_page</span>
            <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;"><option value="100">100 v</option></select>
          </div>
        </div>
        <div style="padding: 15px; border-top: 1px solid #eceff1; display: flex; justify-content: space-between;">
          <button class="btn btn-danger" style="background: #00bcd4; color: white; border: none; border-radius: 20px;" @click="exportNota">EXPORTAR NOTA DE {{ notaTipoUpper }}</button>
          <button class="btn" style="background: #00bcd4; border-radius: 20px;" @click="validarActividades">VALIDAR ACTIVIDADES</button>
        </div>
      </div>
    </div>

    <DetalleOtCreditoPopup :show="showOt" :otNumber="selectedOt" @close="showOt = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DetalleOtCreditoPopup from '../popup/DetalleOtCreditoPopup.vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const props = defineProps({
  nota: {
    type: Object,
    required: true
  },
  tipoNota: {
    type: String,
    default: 'credito'
  }
})

defineEmits(['volver'])

const openDetalle = ref(true)
const showOt = ref(false)
const selectedOt = ref('')
const otFilter = ref('')
const selectAll = ref(false)

const notaTipoCapitalizada = computed(() => props.tipoNota === 'debito' ? 'Debito' : 'Credito')
const notaTipoUpper = computed(() => notaTipoCapitalizada.value.toUpperCase())

const ots = ref([
  { selected: false, nro_ot: 'M00966068', fecha_cierre: '13/06/2026 12:45', codigo_tarea: '9HDA0 | DOM - ALTAS HFC', direccion: 'DE LUJAN NTRA SRA 1525', ciudad: 'TRONCOS DEL TALAR', sector: 'TRC062', provincia: 'BUENOS AIRES', pais: 'ARGENTINA', base: 'BOULOGNE' },
  { selected: false, nro_ot: 'M00966069', fecha_cierre: '14/06/2026 09:15', codigo_tarea: '9HDA0 | DOM - ALTAS HFC', direccion: 'AVENIDA SIEMPREVIVA 742', ciudad: 'SAN ISIDRO', sector: 'TRC063', provincia: 'BUENOS AIRES', pais: 'ARGENTINA', base: 'BOULOGNE' }
])

const filteredOts = computed(() => {
  if (!otFilter.value) return ots.value
  return ots.value.filter((row) => row.nro_ot.toLowerCase().includes(otFilter.value.toLowerCase()))
})

const openOtDetail = (nro) => {
  selectedOt.value = nro
  showOt.value = true
}

const toggleSelectAll = () => {
  filteredOts.value.forEach((row) => { row.selected = selectAll.value })
}

const syncSelectAll = () => {
  selectAll.value = filteredOts.value.length > 0 && filteredOts.value.every((row) => row.selected)
}

const exportNota = () => {
  const headers = ['NUMERO DE ACTA', 'NRO_OT', 'FECHA_CIERRE', 'CODIGO_TAREA', 'DIRECCION', 'CIUDAD', 'SECTOR', 'PROVINCIA', 'PAIS', 'BASE']
  const rows = filteredOts.value.map((row) => [props.nota?.acta, row.nro_ot, row.fecha_cierre, row.codigo_tarea, row.direccion, row.ciudad, row.sector, row.provincia, row.pais, row.base])
  downloadCsv(`Exportar_Nota_${notaTipoCapitalizada.value}.csv`, buildCsv(headers, rows))
}

const validarActividades = () => {
  alert(`Actividades de nota de ${notaTipoCapitalizada.value.toLowerCase()} validadas correctamente.`)
}
</script>
