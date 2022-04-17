import { join } from 'path'
import { BrowserWindow, app, protocol } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import windowStateKeeper from 'electron-window-state'
import { createApplicationMenu } from './application-menu'
import { createContextMenu } from './context-menu'
import { addHandlers } from './handlers'

let mainWindow: BrowserWindow

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const windowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  })

  mainWindow = new BrowserWindow({
    ...windowState,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      webSecurity: !isDev,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:8000/')
    mainWindow.webContents.openDevTools()
  } else {
    const pathname = join(__dirname, '../renderer/out/index.html')
    const url = `file://${pathname}`
    mainWindow.loadURL(url)
  }

  windowState.manage(mainWindow)

  addHandlers(mainWindow)
  createApplicationMenu(mainWindow)
  createContextMenu()
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// @see https://github.com/electron/electron/issues/23757#issuecomment-640146333
app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURIComponent(request.url.replace('file:///', ''))
    callback(pathname)
  })
})
