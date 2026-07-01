<template>
  <component :is="Pantalla" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const Pantalla = defineAsyncComponent(() => import('../../components/materiales/ErroresGestionSucursal.vue'))
</script>
