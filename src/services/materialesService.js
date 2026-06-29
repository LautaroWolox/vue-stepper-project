import { apiClient } from './apiClient.js'
import { getMaterialesColumns, searchMaterialesMock } from '../mocks/materialesMock.js'

export { getMaterialesColumns }

const isMockEnabled = () => import.meta.env.VITE_USE_MOCKS !== 'false'

const delay = (payload, time = 500) => {
  return new Promise((resolve) => setTimeout(() => resolve(payload), time))
}

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.result)) return response.result
  return []
}

const getSearchEndpoint = (type) => {
  return type === 'OT'
    ? '/materiales/ots/buscar'
    : '/materiales/descargados/buscar'
}

const getSaveEndpoint = (type) => {
  return type === 'OT'
    ? '/materiales/ots/guardar'
    : '/materiales/descargados/guardar'
}

export const searchMateriales = async (type, filters) => {
  if (isMockEnabled()) {
    return delay(searchMaterialesMock(type, filters))
  }

  const response = await apiClient.post(getSearchEndpoint(type), filters)
  return normalizeListResponse(response)
}

export const saveMaterialesChanges = async (type, payload) => {
  if (isMockEnabled()) {
    return delay({ ok: true, payload }, 400)
  }

  return apiClient.post(getSaveEndpoint(type), payload)
}
