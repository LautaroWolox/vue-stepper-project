<template>
  <div class="loader-overlay" v-if="show">
    <h3><span class="material-icons" style="vertical-align: middle;">sync</span> Cargando Grilla a Pantalla Completa...</h3>
    <div class="pull-animation-container">
      <div class="progress-bar-fill"></div>
      <div class="rope"></div>
      <div class="guy">🏃</div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean })
</script>