<template>
  <div class="floating-popup" style="width: 95vw; max-width: 1400px; height: 80vh; z-index: 6000; left: 50%; top: 50%; transform: translate(-50%, -50%);" v-if="show">
    
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1;">
      <div class="popup-title" style="font-weight: bold; font-size: 16px;">Exportar Acta</div>
      <div class="popup-controls">
        <span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold; cursor: pointer;" @click="$emit('close')">close</span>
      </div>
    </div>
    
    <div class="popup-body" style="background: #fafafa; padding: 20px; display: flex; flex-direction: column; overflow-y: auto;">
      
      <div style="text-align: right; margin-bottom: 10px;">
        <label style="font-size: 13px; font-weight: bold; color: #263238; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <input type="checkbox" v-model="incluirExcluidas" class="custom-checkbox"> Incluir OTs EXCLUIDAS
        </label>
      </div>

      <div class="table-responsive" style="flex: 1; border: 1px solid #e0e0e0; background: white;">
        <table class="advanced-grid">
          <thead>
            <tr>
              <th v-for="col in visibleCols" :key="col.field">
                <div class="resizable-header">{{ col.label }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- AHORA RENDERIZA DINÁMICAMENTE LAS SELECCIONADAS DE VERDAD -->
            <tr v-for="(ot, index) in otsParaExportar" :key="index">
              <td v-for="col in visibleCols" :key="col.field">
                <span v-if="col.field === 'contratista'">TELEWORLD ARGENTINA</span>
                <span v-else-if="col.field === 'base'">MAR DEL PLATA</span>
                <span v-else-if="col.field === 'nro_ot'">{{ ot.nro_ot }}</span>
                <span v-else-if="col.field === 'fecha'">{{ ot.fecha_cierre }}</span>
                <span v-else-if="col.field === 'actividad'">1942-Acometida reconectada</span>
                <span v-else-if="col.field === 'cant'">1</span>
                <span v-else-if="col.field === 'concepto'">RECONEXION DE ACOMETIDA</span>
                <span v-else-if="col.field === 'estado'">Reglas B Aplicadas</span>
                <span v-else-if="col.field === 'excluida'">{{ ot.excluida }}</span>
                <span v-else-if="col.field === 'nota' && incluirExcluidas">{{ ot.nota || '-' }}</span>
                <span v-else-if="col.field === 'motivo' && incluirExcluidas">{{ ot.motivo_exclusion || '-' }}</span>
                <span v-else></span>
              </td>
            </tr>
            <tr v-if="otsParaExportar.length === 0">
              <td :colspan="visibleCols.length" style="text-align: center; padding: 30px; color: #90a4ae;">
                No hay OTs seleccionadas para exportar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- BOTONES EXPORTAR -->
    <div class="popup-actions" style="background: white; border-top: none; padding: 15px 20px; justify-content: flex-end; gap: 15px;">
      <button class="btn" style="background: #00acc1; font-weight: bold; border-radius: 20px; padding: 10px 20px;" @click="$emit('close')">EXPORTAR COMPLETO</button>
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 10px 20px;" @click="$emit('close')">EXPORTAR CAMPOS COMPLETOS</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['show', 'otsParaExportar'])
const emit = defineEmits(['close'])

const incluirExcluidas = ref(false)

const allColumns = [
  { field: 'contratista', label: 'CONTRATISTA' }, { field: 'base', label: 'BASE' },
  { field: 'nro_ot', label: 'NRO OT' }, { field: 'fecha', label: 'FECHA CIERRE' },
  { field: 'tipo_tarea', label: 'TIPO TAREA' }, { field: 'actividad', label: 'ACTIVIDAD' },
  { field: 'cant', label: 'CANTIDAD' }, { field: 'tipo_mot', label: 'TIPO MOTIVO' },
  { field: 'sap', label: 'CODIGO SAP' }, { field: 'concepto', label: 'CONCEPTO' },
  { field: 'importe', label: 'IMPORTE' }, { field: 'direccion', label: 'DIRECCION' },
  { field: 'ciudad', label: 'CIUDAD' }, { field: 'sector', label: 'SECTOR' },
  { field: 'lote', label: 'LOTE' }, { field: 'proyecto', label: 'PROYECTO' },
  { field: 'empresa', label: 'EMPRESA' }, { field: 'unidad', label: 'UNIDAD OPERATIVA' },
  { field: 'tecnico', label: 'CODIGO TECNICO' }, { field: 'barrio', label: 'BARRIO ESPECIAL' },
  { field: 'evaluacion', label: 'EVALUACION' }, { field: 'convenio', label: 'CONVENIO' },
  { field: 'contrato', label: 'CONTRATO' }, { field: 'estado', label: 'ESTADO REGLAS' },
  { field: 'excluida', label: 'EXCLUIDA' }, { field: 'nota', label: 'NOTA' }, { field: 'motivo', label: 'MOTIVO' }
]

const visibleCols = computed(() => {
  return allColumns.filter(c => {
    if (!incluirExcluidas.value && (c.field === 'nota' || c.field === 'motivo')) return false
    return true
  })
})
</script>