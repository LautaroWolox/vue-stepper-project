import { downloadExcel } from '../excel/excelExport.js'

export const useExcelExport = () => {
  const exportExcel = ({ filename, title, columns, rows, mode = 'allColumns' }) => {
    downloadExcel({ filename, title, columns, rows, mode })
  }

  return { exportExcel }
}
