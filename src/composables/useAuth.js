import { computed, ref } from 'vue'
import { getAuthToken } from '../services/apiClient.js'
import { getStoredUser, loginWithCredentials, logoutSession } from '../services/authService.js'

const token = ref(getAuthToken())
const user = ref(getStoredUser())
const isLoading = ref(false)
const error = ref(null)

const isAuthenticated = computed(() => Boolean(token.value))

export function useAuth() {
  const login = async (username, password) => {
    isLoading.value = true
    error.value = null

    try {
      const session = await loginWithCredentials(username, password)
      token.value = session.token
      user.value = session.user
      return true
    } catch (err) {
      token.value = null
      user.value = null
      error.value = err.message || 'No se pudo iniciar sesión.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    logoutSession()
    token.value = null
    user.value = null
  }

  return { isAuthenticated, user, isLoading, error, login, logout }
}
