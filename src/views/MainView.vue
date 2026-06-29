<template>
  <div class="main-layout">
    <AppMenu @load-module="loadModule" />
    
    <div class="content-area" style="padding: 20px; max-width: 100%; margin: 0 auto;">
      <div v-if="activeModule === 'none'" style="text-align: center; margin-top: 50px; color: #90a4ae;">
        <span class="material-icons" style="font-size: 80px; opacity: 0.5;">widgets</span>
        <h2>Bienvenido al Field Manager</h2>
        <p>Selecciona un módulo desde el menú superior.</p>
      </div>
      
      <SearchAccordion v-if="activeModule === 'search-classic'" />
      <GestionMateriales v-if="activeModule === 'materiales-ot'" title="Gestionar Materiales en OTs" type="OT" />
      <GestionMateriales v-if="activeModule === 'materiales-descargados'" title="Materiales Descargados" type="DESC" />
      <ConfigJobtype v-if="activeModule === 'config-jobtype'" />
      <ConfigCmoActividad v-if="activeModule === 'config-cmo'" />
      <ConsultarActas v-if="activeModule === 'consultar-actas'" />
      <ConsultarNotaCredito v-if="activeModule === 'consultar-nota-credito'" />
      <ConsultarNotaDebito v-if="activeModule === 'consultar-nota-debito'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppMenu from '../components/menu/AppMenu.vue'
import SearchAccordion from '../components/accordion/SearchAccordion.vue'
import GestionMateriales from '../components/materiales/GestionMateriales.vue'
import ConfigJobtype from '../components/certificacion/ConfigJobtype.vue'
import ConfigCmoActividad from '../components/certificacion/ConfigCmoActividad.vue'
import ConsultarActas from '../components/certificacion/ConsultarActas.vue'
import ConsultarNotaCredito from '../components/certificacion/ConsultarNotaCredito.vue'
import ConsultarNotaDebito from '../components/certificacion/ConsultarNotaDebito.vue'

const activeModule = ref('none')

const loadModule = (action) => {
  activeModule.value = action
}
</script>
