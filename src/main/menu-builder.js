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
          { label: 'Open Images...', accelerator: 'CmdOrCtrl+Shift+O', click: () => { this.openImages() } }
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
        label: 'Explorer',
        submenu: [
          { label: 'Open Location...', accelerator: 'CmdOrCtrl+L', click: () => { this.openLocation() } },
          { type: 'separator' },
          { label: 'Back Directory', accelerator: 'CmdOrCtrl+Left', click: () => { this.backDirectory() } },
          { label: 'Forward Directory', accelerator: 'CmdOrCtrl+Right', click: () => { this.forwardDirectory() } },
          { label: 'Change Parent Directory', accelerator: 'CmdOrCtrl+Shift+P', click: () => { this.changeParentDirectory() } },
          { label: 'Change Home Directory', accelerator: 'CmdOrCtrl+Shift+H', click: () => { this.changeHomeDirectory() } },
          { type: 'separator' },
          { label: 'Open Current Directory', click: () => { this.openCurrentDirectory() } },
          { label: 'Search...', accelerator: 'CmdOrCtrl+F', click: () => { this.search() } }
        ]
      },
      {
        label: 'Viewer',
        submenu: [
          { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => { this.zoomIn() } },
          { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => { this.zoomOut() } },
          { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => { this.resetZoom() } }
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
      template[6].submenu.push(
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      )
    }

    return template
  }
  open () {
    const filepathes = dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (!filepathes) {
      return
    }
    this.window.webContents.send('openDirectory', { dirpath: filepathes[0] })
  }
  openImages () {
    const filepathes = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    if (!filepathes) {
      return
    }
    this.window.webContents.send('openImages', { filepathes })
  }
  showExplorer () {
    this.window.webContents.send('showExplorer')
  }
  showSettings () {
    this.window.webContents.send('showSettings')
  }
  openLocation () {
    this.window.webContents.send('openLocation')
  }
  backDirectory () {
    this.window.webContents.send('backDirectory')
  }
  forwardDirectory () {
    this.window.webContents.send('forwardDirectory')
  }
  changeParentDirectory () {
    this.window.webContents.send('changeParentDirectory')
  }
  changeHomeDirectory () {
    this.window.webContents.send('changeHomeDirectory')
  }
  openCurrentDirectory () {
    this.window.webContents.send('openCurrentDirectory')
  }
  search () {
    this.window.webContents.send('search')
  }
  zoomIn () {
    this.window.webContents.send('zoomIn')
  }
  zoomOut () {
    this.window.webContents.send('zoomOut')
  }
  resetZoom () {
    this.window.webContents.send('resetZoom')
  }
}
