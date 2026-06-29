const escapeCsvValue = (value) => {
  if (value == null) return ''
  const stringValue = String(value)
  const needsEscaping = /[",\n\r;]/.test(stringValue)

  if (!needsEscaping) return stringValue

  return `"${stringValue.replace(/"/g, '""')}"`
}

export const buildCsv = (headers, rows) => {
  const headerLine = headers.map(escapeCsvValue).join(',')
  const rowLines = rows.map((row) => row.map(escapeCsvValue).join(','))

  return [headerLine, ...rowLines].join('\n')
}

export const downloadCsv = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
