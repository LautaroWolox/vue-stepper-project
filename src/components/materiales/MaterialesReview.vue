<template>
  <div>
    <h3 style="color: #00838f;">Revisión de Gestión</h3>

    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 300px; background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #cfd8dc;">
        <h4 style="margin-top: 0; color: #455a64;">Para Exportación</h4>
        <p style="font-size: 24px; font-weight: bold; color: #00bcd4; margin: 10px 0;">{{ selectedRows.length }}</p>
        <button class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" @click="$emit('view-export-detail', $event)">
          Ver Detalle
        </button>
      </div>

      <div style="flex: 1; min-width: 300px; background: #f0fbfc; padding: 20px; border-radius: 8px; border: 1px solid #b2ebf2;">
        <h4 style="margin-top: 0; color: #00838f;">OTs Modificadas</h4>
        <p style="font-size: 24px; font-weight: bold; color: #00bcd4; margin: 10px 0;">{{ modifiedOts.length }}</p>

        <ul style="padding-left: 20px; font-size: 13px;">
          <li v-for="(mod, index) in modifiedOts" :key="index" style="margin-bottom: 8px;">
            OT: <strong>{{ mod.ot?.nroot }}</strong>
            <button class="btn btn-danger" style="padding: 2px 8px; font-size: 11px; margin-left: 10px;" @click="$emit('view-mod-detail', $event, mod)">
              Ver Detalle
            </button>
          </li>
        </ul>

        <p v-if="modifiedOts.length === 0" style="font-size: 13px; color: #90a4ae;">No se han validado cambios.</p>
      </div>
    </div>

    <div style="margin-top: 25px; display: flex; justify-content: space-between;">
      <button class="btn" @click="$emit('back')">
        <span class="material-icons btn-icon">arrow_back</span> Atrás
      </button>
      <button class="btn" @click="$emit('next')">
        Siguiente a Exportación <span class="material-icons btn-icon">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedRows: {
    type: Array,
    default: () => []
  },
  modifiedOts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['back', 'next', 'view-export-detail', 'view-mod-detail'])
</script>
