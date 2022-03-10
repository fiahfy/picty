// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  ipcMain,
  systemPreferences,
} from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import windowStateKeeper from 'electron-window-state'
import contextMenu from 'electron-context-menu'

contextMenu()

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
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:8000/')
    mainWindow.webContents.openDevTools()
  } else {
    const url = format({
      pathname: join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    })
    mainWindow.loadURL(url)
  }

  windowState.manage(mainWindow)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.handle('message', (_event: IpcMainInvokeEvent, message: any) => {
  console.log(message)
  return 'hi from electron'
})
ipcMain.handle('isDarwin', () => {
  return process.platform === 'darwin'
})
// @see https://github.com/electron/electron/issues/16385
ipcMain.handle('doubleClickTitleBar', () => {
  const doubleClickAction = systemPreferences.getUserDefault(
    'AppleActionOnDoubleClick',
    'string'
  )
  if (doubleClickAction === 'Minimize') {
    mainWindow.minimize()
  } else if (doubleClickAction === 'Maximize') {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})
