<template>
  <div id="app-root">
    <LoginModal v-if="!isAuthenticated" />
    <template v-else>
      <FmSplash />
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { useAuth } from './composables/useAuth.js'
import LoginModal from './components/login/LoginModal.vue'
import FmSplash from './components/brand/FmSplash.vue'
const { isAuthenticated } = useAuth()
</script>

<style>
@import './assets/css/common.css';
@import './assets/css/login.css';
@import './assets/css/menu.css';
@import './assets/css/accordion.css';
@import './assets/css/stepper.css';
@import './assets/css/grid.css';
@import './assets/css/loading.css';
@import './assets/css/popup.css';
@import './assets/css/modal.css';
@import './assets/css/search-accordion.css';
@import './assets/css/step-two.css';
@import './assets/css/step-three.css';
@import './assets/css/materiales.css';
@import './assets/css/certificacion.css';
</style>
