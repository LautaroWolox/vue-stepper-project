import { computed, ref } from 'vue'

export const useGridPagination = (rows, initialPageSize = 10) => {
  const currentPage = ref(1)
  const itemsPerPage = ref(initialPageSize)

  const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / itemsPerPage.value)))
  const pageRows = computed(() => rows.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
  const fromRow = computed(() => rows.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
  const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, rows.value.length))

  const firstPage = () => { currentPage.value = 1 }
  const prevPage = () => { currentPage.value = Math.max(1, currentPage.value - 1) }
  const nextPage = () => { currentPage.value = Math.min(totalPages.value, currentPage.value + 1) }
  const lastPage = () => { currentPage.value = totalPages.value }

  return { currentPage, itemsPerPage, totalPages, pageRows, fromRow, toRow, firstPage, prevPage, nextPage, lastPage }
}
