import { app, shell, BrowserWindow, Menu } from 'electron'
import windowStateKeeper from 'electron-window-state'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

let mainWindow

const createTemplate = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => { mainWindow.webContents.send('openDirectory') } },
        { label: 'Open Images...', accelerator: 'CmdOrCtrl+Shift+O', click: () => { mainWindow.webContents.send('openImages') } }
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
        { label: 'Search...', accelerator: 'CmdOrCtrl+F', click: () => { mainWindow.webContents.send('search') } }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Explorer', accelerator: 'CmdOrCtrl+Shift+E', click: () => { mainWindow.webContents.send('showExplorer') } },
        { label: 'Starred', accelerator: 'CmdOrCtrl+Shift+B', click: () => { mainWindow.webContents.send('showBookmark') } },
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
        { label: 'Open Location...', accelerator: 'CmdOrCtrl+L', click: () => { mainWindow.webContents.send('openLocation') } },
        { type: 'separator' },
        { label: 'Back', accelerator: 'CmdOrCtrl+Left', click: () => { mainWindow.webContents.send('backDirectory') } },
        { label: 'Forward', accelerator: 'CmdOrCtrl+Right', click: () => { mainWindow.webContents.send('forwardDirectory') } },
        { label: 'Up', accelerator: 'CmdOrCtrl+Shift+P', click: () => { mainWindow.webContents.send('upDirectory') } },
        { label: 'Home', accelerator: 'CmdOrCtrl+Shift+H', click: () => { mainWindow.webContents.send('changeHomeDirectory') } },
        { label: 'Open', click: () => { mainWindow.webContents.send('openCurrentDirectory') } }
      ]
    },
    {
      label: 'Viewer',
      submenu: [
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => { mainWindow.webContents.send('zoomIn') } },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => { mainWindow.webContents.send('zoomOut') } },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => { mainWindow.webContents.send('resetZoom') } }
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
        { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => { mainWindow.webContents.send('showSettings') } },
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

const createWindow = () => {
  const windowState = windowStateKeeper({
    defaultWidth: 820,
    defaultHeight: 600
  })

  const options = {
    ...windowState,
    titleBarStyle: 'hidden'
  }

  let url = `file://${__dirname}/app/index.html`

  if (process.env.HMR) {
    url = 'http://localhost:3000/index.html'
    options.webPreferences = {
      ...options.webPreferences,
      webSecurity: false
    }
  }

  mainWindow = new BrowserWindow(options)
  mainWindow.loadURL(url)

  windowState.manage(mainWindow)

  const template = createTemplate()
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  if (process.env.NODE_ENV !== 'production') {
    installExtension(VUEJS_DEVTOOLS.id)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
      })
    mainWindow.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('enterFullScreen')
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('leaveFullScreen')
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
