import { apiClient } from './apiClient.js'
import { getActasMock, getNotasCreditoMock, getNotasDebitoMock } from '../mocks/certificacionMock.js'

const isMockEnabled = () => import.meta.env.VITE_USE_MOCKS !== 'false'

const delay = (payload, time = 500) => new Promise((resolve) => setTimeout(() => resolve(payload), time))

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.result)) return response.result
  return []
}

export const searchActas = async (filters, listas) => {
  if (isMockEnabled()) {
    return delay(getActasMock(listas))
  }

  const response = await apiClient.post('/certificacion/actas/consultar', filters)
  return normalizeListResponse(response)
}

export const searchNotasCredito = async (filters) => {
  if (isMockEnabled()) {
    return delay(getNotasCreditoMock())
  }

  const response = await apiClient.post('/certificacion/notas/credito/consultar', filters)
  return normalizeListResponse(response)
}

export const searchNotasDebito = async (filters) => {
  if (isMockEnabled()) {
    return delay(getNotasDebitoMock())
  }

  const response = await apiClient.post('/certificacion/notas/debito/consultar', filters)
  return normalizeListResponse(response)
}
