<template>
  <div style="position: relative;">
    <div style="margin-bottom: 15px;"><button class="btn btn-danger" style="border-radius: 20px; padding: 8px 25px;" @click="$emit('volver')"><span class="material-icons btn-icon">arrow_back</span> VOLVER A BÚSQUEDA</button></div>

    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openDetalle = !openDetalle">
        <span><span class="material-icons">info</span> DETALLE DE ACTA DE CREDITO</span>
        <span class="material-icons">{{ openDetalle ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openDetalle">
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="form-group"><label>Numero Nota Credito</label><input type="text" class="form-control" :value="nota.nro_nota" disabled></div>
          <div class="form-group"><label>Numero de Acta</label><input type="text" class="form-control" :value="nota.acta" disabled></div>
          <div class="form-group"><label>Provincia</label><input type="text" class="form-control" :value="nota.prov" disabled></div>
          <div class="form-group"><label>Empresa Contratista</label><input type="text" class="form-control" :value="nota.contra" disabled></div>
        </div>
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr); border-bottom: 2px solid #eceff1; padding-bottom: 15px; margin-bottom: 15px;">
          <div class="form-group"><label>Sociedad</label><input type="text" class="form-control" :value="nota.soc" disabled></div>
          <div class="form-group"><label>Tipo de Contrato</label><input type="text" class="form-control" :value="nota.tipo" disabled></div>
          <div class="form-group"><label>Periodo</label><input type="text" class="form-control" :value="nota.periodo" disabled></div>
          <div class="form-group"><label>Estado</label><input type="text" class="form-control" :value="nota.estado" disabled></div>
        </div>
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="form-group"><label>N° de OT</label><input type="text" class="form-control"></div>
        </div>
        <div style="text-align: center; margin-top: 10px;"><button class="btn" style="border-radius: 20px; padding: 10px 30px; background: #00bcd4;">CERRAR</button></div>
      </div>
    </div>

    <!-- OTs del Crédito -->
    <div class="soft-accordion">
      <div class="soft-accordion-header"><span><span class="material-icons">manage_accounts</span> ORDENES DE TRABAJO</span></div>
      <div class="soft-accordion-content" style="padding: 0;">
        <div class="table-responsive" style="border: none; max-height: 400px;">
          <table class="advanced-grid">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;"><input type="checkbox" class="custom-checkbox"></th>
                <th><div class="resizable-header">NUMERO DE ACTA</div></th><th><div class="resizable-header">NRO_OT</div></th>
                <th><div class="resizable-header">FECHA_CIERRE</div></th><th><div class="resizable-header">CÓDIGO_TAREA</div></th>
                <th><div class="resizable-header">DIRECCION</div></th><th><div class="resizable-header">CIUDAD</div></th>
                <th><div class="resizable-header">SECTOR</div></th><th><div class="resizable-header">PROVINCIA</div></th>
                <th><div class="resizable-header">PAIS</div></th><th><div class="resizable-header">BASE</div></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;"><input type="checkbox" class="custom-checkbox"></td>
                <td>{{ nota.acta }}</td>
                <td><span class="clickable-link" @click="openOtDetail('M00966068')">M00966068</span></td>
                <td>13/06/2026 12:45</td><td>9HDA0 | DOM - ALTAS HFC</td><td>DE LUJAN NTRA SRA 1525</td><td>TRONCOS DEL TALAR</td>
                <td>TRC062</td><td>BUENOS AIRES</td><td>ARGENTINA</td><td>BOULOGNE</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid-footer">
          <div class="grid-footer-left"></div>
          <div class="modern-pagination">
            <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
            <span>Página <input type="number" value="1" disabled style="width: 30px;"> de 1</span>
            <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
            <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;"><option value="100">100 v</option></select>
          </div>
        </div>
        <div style="padding: 15px; border-top: 1px solid #eceff1; display: flex; justify-content: space-between;">
          <button class="btn btn-danger" style="background: #00bcd4; color: white; border: none; border-radius: 20px;">EXPORTAR NOTA DE CREDITO</button>
          <button class="btn" style="background: #00bcd4; border-radius: 20px;">VALIDAR ACTIVIDADES</button>
        </div>
      </div>
    </div>

    <!-- Mega Popup de OT adaptado a Crédito -->
    <DetalleOtCreditoPopup :show="showOt" :otNumber="selectedOt" @close="showOt = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DetalleOtCreditoPopup from '../popup/DetalleOtCreditoPopup.vue'

const props = defineProps(['nota'])
const emit = defineEmits(['volver'])
const openDetalle = ref(true)
const showOt = ref(false)
const selectedOt = ref('')

const openOtDetail = (nro) => {
  selectedOt.value = nro
  showOt.value = true
}
</script>