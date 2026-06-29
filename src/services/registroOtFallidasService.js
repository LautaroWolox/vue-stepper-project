import { apiClient } from './apiClient.js'
import { getRegistroOtFallidasMock } from '../mocks/registroOtFallidasMock.js'

const USE_MOCKS = () => import.meta.env.VITE_USE_MOCKS !== 'false'
const wait = (payload, time = 500) => new Promise((resolve) => setTimeout(() => resolve(payload), time))
const list = (response) => Array.isArray(response) ? response : response?.data || response?.items || response?.result || []

const PATHS = {
  search: '/certificacion/ots-fallidas/consultar',
  process: '/certificacion/ots-fallidas/procesar',
  include: '/certificacion/ots-fallidas/incluir'
}

export const searchRegistroOtFallidas = async (filters = {}) => {
  if (USE_MOCKS()) {
    const norm = (value) => String(value || '').toLowerCase()
    const rows = getRegistroOtFallidasMock().filter((row) => {
      return (!filters.nroOt || norm(row.nroOt).includes(norm(filters.nroOt)))
        && (!filters.descripcionError || norm(row.descripcionError).includes(norm(filters.descripcionError)))
        && (!filters.contratista || row.contratista === filters.contratista)
        && (!filters.pais || row.pais === filters.pais)
        && (!filters.excluida || row.excluida === filters.excluida)
    })
    return wait(rows)
  }
  return list(await apiClient.post(PATHS.search, filters))
}

export const processRegistroOtFallidas = async (rows = []) => {
  if (USE_MOCKS()) return wait({ ok: true, count: rows.length })
  return apiClient.post(PATHS.process, { rows })
}

export const includeRegistroOtFallida = async (payload) => {
  if (USE_MOCKS()) return wait({ ok: true, ...payload })
  return apiClient.post(PATHS.include, payload)
}
