// Native
import { readdirSync, Stats, statSync } from 'fs'
import { basename, dirname, join } from 'path'
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
ipcMain.handle('message', (_event: IpcMainInvokeEvent, message: string) => {
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
type Content = {
  dateModified: number
  name: string
  path: string
  type: 'file' | 'directory'
}
const getContentType = (stats: Stats) => {
  if (stats.isFile()) {
    return 'file'
  } else if (stats.isDirectory()) {
    return 'directory'
  } else {
    return 'other'
  }
}
const getContent = (filePath: string): Content | undefined => {
  const stats = statSync(filePath)
  const type = getContentType(stats)
  if (type === 'other') {
    return undefined
  }
  return {
    dateModified: stats.mtimeMs,
    name: basename(filePath).normalize('NFC'),
    path: filePath,
    type,
  }
}
const listContents = (dirPath: string, recursive = false): Content[] => {
  const filenames = readdirSync(dirPath)
  return filenames.reduce((carry, filename) => {
    try {
      if (filename.match(/^\./)) {
        return carry
      }
      const filePath = join(dirPath, filename)
      const content = getContent(filePath)
      if (!content) {
        return carry
      }
      if (!recursive || content.type === 'file') {
        return [...carry, content]
      }
      const contents = listContents(filePath, recursive)
      return [...carry, content, ...contents]
    } catch (e) {
      return carry
    }
  }, [] as Content[])
}
ipcMain.handle(
  'listContents',
  (_event: IpcMainInvokeEvent, dirPath: string, recursive = false) => {
    return listContents(dirPath, recursive)
  }
)
ipcMain.handle('getDirname', (_event: IpcMainInvokeEvent, filePath: string) => {
  return dirname(filePath)
})
