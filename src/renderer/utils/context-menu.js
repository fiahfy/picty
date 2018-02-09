import { clipboard, remote } from 'electron'

const { Menu } = remote

const inspectElementTemplate = (e) => {
  const { clientX: x, clientY: y } = e

  return [
    { type: 'separator' },
    {
      label: 'Inspect Element',
      click: () => {
        remote.getCurrentWindow().inspectElement(x, y)
      }
    }
  ]
}

export const LABEL_CUT = 'Cut'
export const LABEL_COPY = 'Copy'
export const LABEL_PASTE = 'Paste'

export const show = (e, template = []) => {
  e.preventDefault()
  e.stopPropagation()

  if (process.env.NODE_ENV !== 'production') {
    template = template.concat(inspectElementTemplate(e))
  }

  template = template.map((item) => {
    switch (item.label) {
      case LABEL_CUT:
        return {
          label: item.label,
          click: () => {
            const text = e.target.value.slice(e.target.selectionStart, e.target.selectionEnd)
            clipboard.writeText(text)
            const position = e.target.selectionStart
            e.target.value = e.target.value.slice(0, e.target.selectionStart) + e.target.value.slice(e.target.selectionEnd)
            e.target.setSelectionRange(position, position)
          },
          accelerator: 'CmdOrCtrl+X'
        }
      case LABEL_COPY:
        return {
          label: item.label,
          click: () => {
            const text = e.target.value.slice(e.target.selectionStart, e.target.selectionEnd)
            clipboard.writeText(text)
          },
          accelerator: 'CmdOrCtrl+C'
        }
      case LABEL_PASTE:
        return {
          label: item.label,
          click: () => {
            const text = clipboard.readText()
            const position = e.target.selectionStart + text.length
            e.target.value = e.target.value.slice(0, e.target.selectionStart) + text + e.target.value.slice(e.target.selectionEnd)
            e.target.setSelectionRange(position, position)
          },
          accelerator: 'CmdOrCtrl+V'
        }
      default:
        return item
    }
  })

  Menu
    .buildFromTemplate(template)
    .popup(remote.getCurrentWindow(), { async: true })
}
