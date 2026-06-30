<template>
  <div class="main-layout">
    <AppMenu @load-module="loadModule" />
    
    <div class="content-area" style="padding: 20px; max-width: 100%; margin: 0 auto;">
      <div v-if="activeModule === 'none'" class="welcome-fm-screen">
        <FmSplash />
      </div>
      
      <SearchAccordion v-if="activeModule === 'search-classic'" />
      <ErroresGestionSucursal v-if="activeModule === 'errores-gestion-sucursal'" />
      <GestionMaterialesOt v-if="activeModule === 'materiales-ot'" />
      <ErroresGestion v-if="activeModule === 'errores-gestion'" />
      <GestionMateriales v-if="activeModule === 'materiales-descargados'" title="Materiales Descargados" type="DESC" />
      <ConfigJobtype v-if="activeModule === 'config-jobtype'" />
      <ConfigCmoActividad v-if="activeModule === 'config-cmo'" />
      <ConsultarActas v-if="activeModule === 'consultar-actas'" />
      <ConsultarNotaCredito v-if="activeModule === 'consultar-nota-credito'" />
      <ConsultarNotaDebito v-if="activeModule === 'consultar-nota-debito'" />
      <RegistroOtFallidas v-if="activeModule === 'registro-ots-fallidas'" />
      <ReporteSas v-if="activeModule === 'reporte-sas'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppMenu from '../components/menu/AppMenu.vue'
import FmSplash from '../components/brand/FmSplash.vue'
import SearchAccordion from '../components/accordion/SearchAccordion.vue'
import ErroresGestionSucursal from '../components/materiales/ErroresGestionSucursal.vue'
import GestionMaterialesOt from '../components/materiales/GestionMaterialesOt.vue'
import ErroresGestion from '../components/materiales/ErroresGestion.vue'
import GestionMateriales from '../components/materiales/GestionMateriales.vue'
import ConfigJobtype from '../components/certificacion/ConfigJobtype.vue'
import ConfigCmoActividad from '../components/certificacion/ConfigCmoActividad.vue'
import ConsultarActas from '../components/certificacion/ConsultarActas.vue'
import ConsultarNotaCredito from '../components/certificacion/ConsultarNotaCredito.vue'
import ConsultarNotaDebito from '../components/certificacion/ConsultarNotaDebito.vue'
import RegistroOtFallidas from '../components/certificacion/RegistroOtFallidas.vue'
import ReporteSas from '../components/reportes/ReporteSas.vue'

const activeModule = ref('none')

const loadModule = (action) => {
  activeModule.value = action
}
</script>

<style scoped>
.welcome-fm-screen {
  width: 100%;
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
