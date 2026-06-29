const API_BASE_URL = import.meta.env.VITE_FM_MV_URL_2 || ''
const TOKEN_STORAGE_KEY = 'fm_token'

const normalizePath = (path) => (path.startsWith('/') ? path : `/${path}`)

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_FM_MV_URL_2 para consumir el backend.')
  }
  return `${API_BASE_URL}${normalizePath(path)}`
}

export const getAuthToken = () => localStorage.getItem(TOKEN_STORAGE_KEY)
export const setAuthToken = (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token)
export const clearAuthToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY)

const parseResponse = async (response) => {
  if (response.status === 204) return null

  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const request = async (path, options = {}) => {
  const { method = 'GET', body, headers = {}, ...rest } = options
  const token = getAuthToken()
  const isFormData = body instanceof FormData

  const requestHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json;charset=UTF-8' }),
    ...headers
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: body == null ? undefined : isFormData ? body : JSON.stringify(body),
    ...rest
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    const message = payload?.message || payload?.error || `Error HTTP ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' })
}
