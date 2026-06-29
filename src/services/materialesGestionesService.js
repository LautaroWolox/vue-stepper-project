import { apiClient } from './apiClient.js'
import {
  searchErroresGestionMock,
  searchErroresGestionSucursalMock,
  searchOtsPendientesGestionMock
} from '../mocks/materialesGestionesMock.js'

const isMockEnabled = () => import.meta.env.VITE_USE_MOCKS !== 'false'
const delay = (payload, time = 450) => new Promise((resolve) => setTimeout(() => resolve(payload), time))

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.result)) return response.result
  if (Array.isArray(response?.rows)) return response.rows
  return []
}

export const searchOtsPendientesGestion = async (filters) => {
  if (isMockEnabled()) {
    return delay(searchOtsPendientesGestionMock(filters))
  }

  const response = await apiClient.post('/materiales/ots-pendientes-gestion/buscar', filters)
  return normalizeListResponse(response)
}

export const searchErroresGestionSucursal = async (filters) => {
  if (isMockEnabled()) {
    return delay(searchErroresGestionSucursalMock(filters))
  }

  const response = await apiClient.post('/materiales/errores-gestion-sucursal/buscar', filters)
  return normalizeListResponse(response)
}

export const searchErroresGestion = async (filters) => {
  if (isMockEnabled()) {
    return delay(searchErroresGestionMock(filters))
  }

  const response = await apiClient.post('/materiales/errores-gestion/buscar', filters)
  return normalizeListResponse(response)
}

export const reprocessGestionError = async (payload) => {
  if (isMockEnabled()) {
    return delay({ ok: true, action: 'reprocess', payload }, 350)
  }

  return apiClient.post('/materiales/errores-gestion/reprocesar', payload)
}

export const replaceGestionError = async (payload) => {
  if (isMockEnabled()) {
    return delay({ ok: true, action: 'replace', payload }, 350)
  }

  return apiClient.post('/materiales/errores-gestion/reemplazar', payload)
}
