import { ref } from 'vue'

const isAuthenticated = ref(false)

export function useAuth() {
  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}