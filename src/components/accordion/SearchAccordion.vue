<template>
  <div>
    <div class="accordion">
      <div class="accordion-header" @click="openA = !openA">
        <span style="display:flex; align-items:center; gap:10px;">
          <span class="material-icons">filter_alt</span> Filtros de Búsqueda
        </span> 
        <span class="material-icons">{{ openA ? 'expand_less' : 'expand_more' }}</span>
      </div>
      <div class="accordion-content" v-show="openA">
        <div class="search-form">
          <input type="text" class="search-input" placeholder="Ingrese término para buscar..." />
          <button class="btn">
            <span class="material-icons btn-icon">search</span> Buscar
          </button>
          <button class="btn btn-danger">
            <span class="material-icons btn-icon">clear</span> Limpiar
          </button>
        </div>
      </div>
    </div>

    <div class="accordion">
      <div class="accordion-header" @click="openB = !openB">
        <span style="display:flex; align-items:center; gap:10px;">
          <span class="material-icons">view_list</span> Resultados (Stepper)
        </span> 
        <span class="material-icons">{{ openB ? 'expand_less' : 'expand_more' }}</span>
      </div>
      <div class="accordion-content" v-show="openB">
        <StepperContainer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepperContainer from '../stepper/StepperContainer.vue'

const openA = ref(true)
const openB = ref(true)
</script>