<template>
  <div class="detalle-acta-local">
    <div class="detalle-actions"><button class="back-btn" @click="$emit('volver')"><span class="material-icons">arrow_back</span> VOLVER A BÚSQUEDA</button></div>
    <section class="detail-panel">
      <div class="detail-header">DETALLE DE ACTA</div>
      <div class="detail-grid">
        <label><span>Numero de Acta</span><input :value="acta?.nro_acta || ''" disabled /></label>
        <label><span>Provincia</span><input :value="acta?.provincia || ''" disabled /></label>
        <label><span>Empresa Contratista</span><input :value="acta?.contratista || ''" disabled /></label>
        <label><span>Sociedad</span><input :value="acta?.sociedad || ''" disabled /></label>
        <label><span>Tipo de Contrato</span><input :value="acta?.tipo_contrato || ''" disabled /></label>
        <label><span>Periodo</span><input :value="acta?.periodo || ''" disabled /></label>
        <label><span>Estado</span><input :value="acta?.estado || ''" disabled /></label>
        <label><span>Valoración</span><input :value="acta?.valoracion || ''" disabled /></label>
      </div>
    </section>
    <section class="detail-panel"><div class="detail-header">ORDENES DE TRABAJO</div><div class="empty-detail">Seleccione una OT o ejecute una búsqueda para visualizar el detalle.</div></section>
  </div>
</template>
<script setup>
defineProps({ acta: { type: Object, default: null } })
defineEmits(['volver'])
</script>
<style scoped>
.detalle-actions{margin-bottom:15px}.back-btn{border:1px solid #00a9bd;background:#fff;color:#00a9bd;border-radius:4px;height:32px;padding:0 16px;display:inline-flex;align-items:center;gap:7px;cursor:pointer}.back-btn:hover{background:#e0f7fa}.detail-panel{border:1px solid #d8d8d8;background:#fff;margin-bottom:10px}.detail-header{height:32px;display:flex;align-items:center;padding:0 10px;background:#f7f7f7;border-bottom:1px solid #d8d8d8;font-weight:600}.detail-grid{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:14px 18px;padding:15px;border-left:4px solid #00bcd4}.detail-grid label span{display:block;margin-bottom:6px;font-size:13px;font-weight:600}.detail-grid input{width:100%;height:32px;border:1px solid #cfd8dc;border-radius:3px;padding:4px 8px;background:#eee;color:#555}.empty-detail{border-left:4px solid #00bcd4;padding:25px;text-align:center;color:#607d8b}@media(max-width:900px){.detail-grid{grid-template-columns:repeat(2,minmax(160px,1fr))}}@media(max-width:560px){.detail-grid{grid-template-columns:1fr}}
</style>
