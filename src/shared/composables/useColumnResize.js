export const useColumnResize = () => {
  const startResize = (column, event, minWidth = 80) => {
    const startX = event.clientX
    const startWidth = column.width

    const onMove = (moveEvent) => {
      column.width = Math.max(minWidth, startWidth + moveEvent.clientX - startX)
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return { startResize }
}
