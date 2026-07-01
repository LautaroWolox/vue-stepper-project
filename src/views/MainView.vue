<template>
  <div class="main-layout">
    <AppMenu @load-module="loadModule" />
    <div class="content-area" style="padding: 20px; max-width: 100%; margin: 0 auto;">
      <div v-if="activeModule === 'none'" class="welcome-fm-screen"><FmSplash /></div>
      <SearchClassicScreen v-if="activeModule === 'search-classic'" />
      <ErroresGestionSucursalScreen v-if="activeModule === 'errores-gestion-sucursal'" />
      <GestionMaterialesOtScreen v-if="activeModule === 'materiales-ot'" />
      <ErroresGestionScreen v-if="activeModule === 'errores-gestion'" />
      <MaterialesDescargadosScreen v-if="activeModule === 'materiales-descargados'" />
      <RegistroOtsFallidasMaterialesScreen v-if="activeModule === 'registro-ots-fallidas-materiales'" />
      <ValidacionOtRedesScreen v-if="activeModule === 'validacion-ot-redes'" />
      <ConfigJobtypeScreen v-if="activeModule === 'config-jobtype'" />
      <ConfigCmoActividadScreen v-if="activeModule === 'config-cmo'" />
      <ActasListaScreen v-if="activeModule === 'consultar-actas'" />
      <NcScreen v-if="activeModule === 'consultar-nota-credito'" />
      <NdScreen v-if="activeModule === 'consultar-nota-debito'" />
      <RegistroOtFallidasScreen v-if="activeModule === 'registro-ots-fallidas-certificacion' || activeModule === 'registro-ots-fallidas'" />
      <OtSearchScreen v-if="activeModule === 'busqueda-ots'" />
      <ReporteSasScreen v-if="activeModule === 'reporte-sas'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppMenu from '../components/menu/AppMenu.vue'
import FmSplash from '../components/brand/FmSplash.vue'
import SearchClassicScreen from '../modules/busquedaClasica/Screen.vue'
import ErroresGestionSucursalScreen from '../modules/gestion-materiales/errores-gestion-sucursal/ErroresGestionSucursalScreen.vue'
import GestionMaterialesOtScreen from '../modules/gestionMaterialesOt/GestionMaterialesOt.vue'
import ErroresGestionScreen from '../modules/gestion-materiales/errores-gestion/ErroresGestionScreen.vue'
import MaterialesDescargadosScreen from '../modules/materialesDescargados/Screen.vue'
import RegistroOtsFallidasMaterialesScreen from '../modules/otFallidasGM/OtFallidasGM.vue'
import ValidacionOtRedesScreen from '../modules/validacionOtRedes/ValidacionOtRedes.vue'
import ConfigJobtypeScreen from '../modules/configJobtypeContrato/ConfigJobtypeContrato.vue'
import ConfigCmoActividadScreen from '../modules/configCmoActividad/ConfigCmoActividad.vue'
import ActasListaScreen from '../modules/consultarActas/ConsultarActas.vue'
import NcScreen from '../modules/notaCredito/NotaCreditoScreen.vue'
import NdScreen from '../modules/notaDebito/NotaDebitoScreen.vue'
import RegistroOtFallidasScreen from '../modules/registroOtsFallidasCT/RegistroOtsFallidasCT.vue'
import OtSearchScreen from '../modules/busquedaOts/Screen.vue'
import ReporteSasScreen from '../modules/reporteSas/ReporteSas.vue'

const allowedModules = new Set(['search-classic', 'errores-gestion-sucursal', 'materiales-ot', 'errores-gestion', 'materiales-descargados', 'registro-ots-fallidas-materiales', 'validacion-ot-redes', 'config-jobtype', 'config-cmo', 'consultar-actas', 'consultar-nota-credito', 'consultar-nota-debito', 'registro-ots-fallidas-certificacion', 'registro-ots-fallidas', 'busqueda-ots', 'reporte-sas'])
const getInitialModule = () => {
  const moduleFromUrl = new URLSearchParams(window.location.search).get('module')
  return allowedModules.has(moduleFromUrl) ? moduleFromUrl : 'none'
}
const activeModule = ref(getInitialModule())
const loadModule = (action) => { activeModule.value = action }
</script>

<style scoped>
.welcome-fm-screen { width: 100%; min-height: calc(100vh - 90px); display: flex; align-items: center; justify-content: center; margin: 0 auto; }
</style>