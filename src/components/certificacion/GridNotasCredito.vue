<template>
  <div>
    <div class="table-responsive" style="border: none;">
      <table class="advanced-grid" style="border-top: none;">
        <thead>
          <tr>
            <th><div class="resizable-header">NRO_NOTA</div></th><th><div class="resizable-header">NUMERO DE ACTA</div></th><th><div class="resizable-header">ESTADO_NOTA</div></th><th><div class="resizable-header">PERIODO</div></th><th><div class="resizable-header">AÑO</div></th>
            <th><div class="resizable-header">FECHA_CREACION</div></th><th><div class="resizable-header">FECHA_CIERRE</div></th><th><div class="resizable-header">CONTRATISTA</div></th><th><div class="resizable-header">PAIS</div></th><th><div class="resizable-header">PROVINCIA</div></th>
            <th><div class="resizable-header">REGION</div></th><th><div class="resizable-header">TIPO_CONTRATO</div></th><th><div class="resizable-header">SOCIEDAD</div></th><th><div class="resizable-header">USUARIO_CIERRE</div></th><th><div class="resizable-header">VALORACION_ACTA</div></th>
          </tr>
          <tr class="filter-row">
            <th v-for="i in 15" :key="i"><input type="text" class="col-filter-input" placeholder="~"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.id">
            <td><span class="clickable-link" @click="$emit('open-nota', row)">{{ row.nro_nota }}</span></td>
            <td>{{ row.acta }}</td><td>{{ row.estado }}</td><td>{{ row.periodo }}</td><td>{{ row.anio }}</td>
            <td>{{ row.f_crea }}</td><td>{{ row.f_cierre }}</td><td>{{ row.contra }}</td><td>{{ row.pais }}</td><td>{{ row.prov }}</td>
            <td>{{ row.reg }}</td><td>{{ row.tipo }}</td><td>{{ row.soc }}</td><td>{{ row.usu }}</td><td>{{ row.val }}</td>
          </tr>
          <tr v-if="data.length === 0"><td colspan="15" style="text-align: center; padding: 30px;">No hay resultados.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="grid-footer" style="justify-content: center;">
      <div class="modern-pagination">
        <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
        <span>Página <input type="number" value="1" disabled> de 1</span>
        <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
        <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;"><option value="500">500 v</option></select>
        <div style="margin-left: 10px;">Mostrando 1 - {{ data.length }} de {{ data.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['data'])
defineEmits(['open-nota'])
</script>