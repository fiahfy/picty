import { remote } from 'electron'

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
          click: () => document.execCommand('cut'),
          accelerator: 'CmdOrCtrl+X'
        }
      case LABEL_COPY:
        return {
          label: item.label,
          click: () => document.execCommand('copy'),
          accelerator: 'CmdOrCtrl+C'
        }
      case LABEL_PASTE:
        return {
          label: item.label,
          click: () => document.execCommand('paste'),
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
