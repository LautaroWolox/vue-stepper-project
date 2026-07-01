import { reactive, ref, watch } from 'vue'

export const createNotaCreditoForm = () => ({
  provincia: '',
  contratista: '',
  sociedad: '',
  tipo_contrato: '',
  anio: '',
  periodo: '',
  estado: '',
  nota_credito: '',
  nro_ot: '',
  acta_asociada: ''
})

export function useNotaCreditoStore() {
  const form = reactive(createNotaCreditoForm())
  const openFilters = ref(true)
  const openResults = ref(true)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const gridData = ref([])

  watch(() => form.anio, (anio) => {
    if (!anio) form.periodo = ''
  })

  const resetForm = () => {
    Object.assign(form, createNotaCreditoForm())
    openFilters.value = true
  }

  return {
    form,
    openFilters,
    openResults,
    hasSearched,
    isLoading,
    gridData,
    resetForm
  }
}
