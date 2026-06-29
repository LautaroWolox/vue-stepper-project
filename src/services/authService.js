import { apiClient, clearAuthToken, getAuthToken, setAuthToken } from './apiClient.js'

const USER_STORAGE_KEY = 'fm_user'

const isDemoAuthEnabled = () => import.meta.env.VITE_AUTH_DEMO !== 'false'

const persistSession = ({ token, user }) => {
  setAuthToken(token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user || null))
  return { token, user }
}

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) return null

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export const hasStoredSession = () => Boolean(getAuthToken())

export const loginWithCredentials = async (username, password) => {
  if (isDemoAuthEnabled() && username === 'admin' && password === 'admin') {
    return persistSession({
      token: `demo-token-${Date.now()}`,
      user: {
        username: 'admin',
        displayName: 'Lautaro Buson',
        roles: ['DEMO']
      }
    })
  }

  const response = await apiClient.post('/auth/login', { username, password })
  const token = response?.token || response?.accessToken || response?.data?.token
  const user = response?.user || response?.data?.user || { username }

  if (!token) {
    throw new Error('El backend no devolvió token de autenticación.')
  }

  return persistSession({ token, user })
}

export const logoutSession = () => {
  clearAuthToken()
  localStorage.removeItem(USER_STORAGE_KEY)
}
