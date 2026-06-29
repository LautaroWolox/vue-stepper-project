const EXCEL_MIME = 'application/vnd.ms-excel;charset=utf-8;'

const normalizeFilename = (filename = 'exportacion') => {
  const cleanName = String(filename || 'exportacion').replace(/\.(csv|xls|xlsx)$/i, '')
  return `${cleanName}.xls`
}

const escapeHtml = (value) => {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const isFilledValue = (value) => {
  if (value === null || value === undefined) return false
  return String(value).trim() !== ''
}

export const filterColumnsForExport = (columns = [], rows = [], mode = 'all') => {
  const normalizedColumns = columns.filter((column) => column && column.field && column.label)

  if (mode !== 'filled') {
    return normalizedColumns
  }

  return normalizedColumns.filter((column) => rows.some((row) => isFilledValue(row?.[column.field])))
}

export const buildExcelHtml = ({ title = 'Exportacion', columns = [], rows = [] }) => {
  const header = columns
    .map((column) => `<th style="background:#e9eef2;border:1px solid #b8c4cc;font-weight:bold;text-align:left;">${escapeHtml(column.label)}</th>`)
    .join('')

  const body = rows
    .map((row) => {
      const cells = columns
        .map((column) => `<td style="border:1px solid #d0d7de;mso-number-format:'\\@';">${escapeHtml(row?.[column.field])}</td>`)
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${escapeHtml(title).slice(0, 31)}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <table>
          <thead><tr>${header}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </body>
    </html>
  `.trim()
}

export const downloadExcel = ({ filename = 'exportacion.xls', title = 'Exportacion', columns = [], rows = [], mode = 'all' }) => {
  const exportColumns = filterColumnsForExport(columns, rows, mode)
  const html = buildExcelHtml({ title, columns: exportColumns, rows })
  const blob = new Blob([html], { type: EXCEL_MIME })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = normalizeFilename(filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
