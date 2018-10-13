import { app, shell, BrowserWindow, Menu } from 'electron'
import windowStateKeeper from 'electron-window-state'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

let mainWindow

const send = (...args) => {
  mainWindow && mainWindow.webContents.send(...args)
}

const createTemplate = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => send('openDirectory')
        },
        {
          label: 'Open Images...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => send('openImages')
        }
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
        {
          label: 'Search...',
          accelerator: 'CmdOrCtrl+F',
          click: () => send('search')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Explorer',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => send('showExplorer')
        },
        {
          label: 'Bookmark',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => send('showBookmark')
        },
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
        {
          label: 'Open Location...',
          accelerator: 'CmdOrCtrl+L',
          click: () => send('openLocation')
        },
        { type: 'separator' },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+Left',
          click: () => send('backDirectory')
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+Right',
          click: () => send('forwardDirectory')
        },
        {
          label: 'Up',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => send('upDirectory')
        },
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+Shift+H',
          click: () => send('changeHomeDirectory')
        },
        {
          label: 'Bookmark',
          accelerator: 'CmdOrCtrl+D',
          click: () => send('bookmarkDirectory')
        },
        { label: 'Browse', click: () => send('browseDirectory') }
      ]
    },
    {
      label: 'Viewer',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => send('zoomIn')
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => send('zoomOut')
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => send('resetZoom')
        }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'close' }, { role: 'minimize' }]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://github.com/fiahfy/picty')
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => send('showSettings')
        },
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
            submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
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
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  }

  let url = `file://${__dirname}/app/index.html`

  if (process.env.HMR) {
    const port = process.env.PORT || 3000
    url = `http://localhost:${port}/index.html`
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
    installExtension(VUEJS_DEVTOOLS.id).catch((err) => {
      console.log('Unable to install `vue-devtools`: \n', err) // eslint-disable-line no-console
    })
    mainWindow.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('enter-full-screen', () => {
    send('enterFullScreen')
  })

  mainWindow.on('leave-full-screen', () => {
    send('leaveFullScreen')
  })

  mainWindow.on('app-command', (e, cmd) => {
    send('appCommand', cmd)
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
