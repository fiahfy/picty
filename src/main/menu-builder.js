import { app, dialog, shell, Menu } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

export default class MenuBuilder {
  constructor (window) {
    this.window = window
  }
  build () {
    if (process.env.NODE_ENV !== 'production') {
      this.setupDevelopmentEnvironment()
    }
    const template = this.buildTemplate()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
  setupDevelopmentEnvironment () {
    installExtension(VUEJS_DEVTOOLS)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
      })
    this.window.openDevTools()
    this.window.webContents.on('context-menu', (e, props) => {
      const { x, y } = props

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.window.inspectElement(x, y)
          }
        }])
        .popup(this.window)
    })
  }
  buildTemplate () {
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => { this.open() } },
          { label: 'Open Location...', accelerator: 'CmdOrCtrl+L', click: () => { this.openLocation() } }
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
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Explorer', accelerator: 'CmdOrCtrl+Shift+E', click: () => { this.showExplorer() } },
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
          { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => { this.showSettings() } },
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

      // Edit menu
      template[2].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      )

      // Window menu
      template[4].submenu.push(
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      )
    }

    return template
  }
  open () {
    const filepathes = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
    if (!filepathes) {
      return
    }
    this.window.webContents.send('open', { filepathes })
  }
  openLocation () {
    this.window.webContents.send('openLocation')
  }
  showExplorer () {
    this.window.webContents.send('showExplorer')
  }
  showSettings () {
    this.window.webContents.send('showSettings')
  }
}
