<template>
  <div class="main-layout">
    <AppMenu @load-module="moduleLoaded = true" />
    
    <div class="content-area" style="padding: 30px; max-width: 1400px; margin: 0 auto;">
      <div v-if="!moduleLoaded" style="text-align: center; margin-top: 50px; color: #546e7a;">
        <span class="material-icons" style="font-size: 80px; opacity: 0.5;">widgets</span>
        <h1>Bienvenido al Field Manager</h1>
        <p>Por favor, despliega el menú "Gestión Principal" y haz clic en "Cargar Módulo Búsqueda".</p>
      </div>
      
      <SearchAccordion v-if="moduleLoaded" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppMenu from '../components/menu/AppMenu.vue'
import SearchAccordion from '../components/accordion/SearchAccordion.vue'

const moduleLoaded = ref(false)
</script>