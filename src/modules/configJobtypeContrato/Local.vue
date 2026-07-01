<template>
  <div class="local-jobtype-module"><component :is="modulo" /></div>
</template>

<script setup>
import { shallowRef } from 'vue'
import Pantalla from '../../components/certificacion/ConfigJobtype.vue'
const modulo = shallowRef(Pantalla)
</script>
