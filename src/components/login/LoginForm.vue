<template>
  <form @submit.prevent="handleSubmit">
    <span class="material-icons">admin_panel_settings</span>
    <h2>Acceso al Sistema</h2>

    <div class="input-group">
      <span class="material-icons">person</span>
      <input v-model="username" type="text" placeholder="Usuario" autocomplete="username" :disabled="isLoading" required />
    </div>

    <div class="input-group">
      <span class="material-icons">lock</span>
      <input v-model="password" type="password" placeholder="Contraseña" autocomplete="current-password" :disabled="isLoading" required />
    </div>

    <button class="btn login-btn" type="submit" :disabled="isLoading">
      <span class="material-icons btn-icon">login</span> {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
    </button>

    <div v-if="errorMessage" class="error-msg">
      <span class="material-icons">error</span> {{ errorMessage }}
    </div>

    <p v-if="demoAuthEnabled" style="font-size: 12px; color: #90a4ae; margin-top: 12px; text-align: center;">
      Demo local: admin / admin. Para backend real usar VITE_AUTH_DEMO=false.
    </p>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const { login, error: authError, isLoading } = useAuth()
const username = ref('')
const password = ref('')
const localError = ref('')
const demoAuthEnabled = import.meta.env.VITE_AUTH_DEMO !== 'false'

const errorMessage = computed(() => localError.value || authError.value)

const handleSubmit = async () => {
  localError.value = ''
  const logged = await login(username.value, password.value)

  if (!logged) {
    localError.value = authError.value || 'Credenciales inválidas'
  }
}
</script>
