import { app, shell, Menu } from 'electron'

export default class MenuBuilder {
  constructor (window) {
    this.window = window
  }
  build () {
    const template = this.buildTemplate()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
  buildTemplate () {
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => { this.window.sendMessage('openDirectory') } },
          { label: 'Open Images...', accelerator: 'CmdOrCtrl+Shift+O', click: () => { this.window.sendMessage('openImages') } }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          // { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          { type: 'separator' },
          { label: 'Search...', accelerator: 'CmdOrCtrl+F', click: () => { this.window.sendMessage('search') } }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Explorer', accelerator: 'CmdOrCtrl+Shift+E', click: () => { this.window.sendMessage('showExplorer') } },
          { label: 'Bookmark', accelerator: 'CmdOrCtrl+Shift+B', click: () => { this.window.sendMessage('showBookmark') } },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          // { role: 'resetzoom' },
          // { role: 'zoomin' },
          // { role: 'zoomout' },
          // { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Explorer',
        submenu: [
          { label: 'Open Location...', accelerator: 'CmdOrCtrl+L', click: () => { this.window.sendMessage('openLocation') } },
          { type: 'separator' },
          { label: 'Back Directory', accelerator: 'CmdOrCtrl+Left', click: () => { this.window.sendMessage('backDirectory') } },
          { label: 'Forward Directory', accelerator: 'CmdOrCtrl+Right', click: () => { this.window.sendMessage('forwardDirectory') } },
          { label: 'Change Parent Directory', accelerator: 'CmdOrCtrl+Shift+P', click: () => { this.window.sendMessage('changeParentDirectory') } },
          { label: 'Change Home Directory', accelerator: 'CmdOrCtrl+Shift+H', click: () => { this.window.sendMessage('changeHomeDirectory') } },
          { label: 'Open Current Directory', click: () => { this.window.sendMessage('openCurrentDirectory') } }
        ]
      },
      {
        label: 'Viewer',
        submenu: [
          { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => { this.window.sendMessage('zoomIn') } },
          { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => { this.window.sendMessage('zoomOut') } },
          { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => { this.window.sendMessage('resetZoom') } }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'close' },
          { role: 'minimize' }
        ]
      },
      {
        role: 'help',
        submenu: [
          { label: 'Learn More', click: () => { shell.openExternal('https://github.com/fiahfy/picty') } }
        ]
      }
    ]

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => { this.window.sendMessage('showSettings') } },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })

      template.forEach((menu) => {
        if (menu.label === 'Edit') {
          menu.submenu.push(
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' }
              ]
            }
          )
        } else if (menu.role === 'window') {
          menu.submenu.push(
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
          )
        }
      })
    }

    return template
  }
}
