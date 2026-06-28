<template>
  <form @submit.prevent="handleSubmit">
    <span class="material-icons">admin_panel_settings</span>
    <h2>Acceso al Sistema</h2>
    <div class="input-group">
      <span class="material-icons">person</span>
      <input v-model="username" type="text" placeholder="Usuario (admin)" required />
    </div>
    <div class="input-group">
      <span class="material-icons">lock</span>
      <input v-model="password" type="password" placeholder="Contraseña (admin)" required />
    </div>
    <button class="btn login-btn" type="submit">
      <span class="material-icons btn-icon">login</span> Ingresar
    </button>
    <div v-if="error" class="error-msg">
      <span class="material-icons">error</span> Credenciales inválidas
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const { login } = useAuth()
const username = ref('')
const password = ref('')
const error = ref(false)

const handleSubmit = () => {
  if (!login(username.value, password.value)) {
    error.value = true
  }
}
</script>