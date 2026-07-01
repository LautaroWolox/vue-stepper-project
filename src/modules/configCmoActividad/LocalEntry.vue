<template>
  <component :is="Pantalla" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const Pantalla = defineAsyncComponent(() => import('../../components/certificacion/ConfigCmoActividad.vue'))
</script>
