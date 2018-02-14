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

export const Label = {
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste'
}

export const show = (e, template = []) => {
  e.preventDefault()
  e.stopPropagation()

  if (process.env.NODE_ENV !== 'production') {
    template = template.concat(inspectElementTemplate(e))
  }

  template = template.map((item) => {
    switch (item.label) {
      case Label.cut:
        return {
          label: item.label,
          click: () => document.execCommand('cut'),
          accelerator: 'CmdOrCtrl+X'
        }
      case Label.copy:
        return {
          label: item.label,
          click: () => document.execCommand('copy'),
          accelerator: 'CmdOrCtrl+C'
        }
      case Label.paste:
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
