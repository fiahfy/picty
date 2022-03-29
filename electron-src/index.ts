import { readdirSync, Stats, statSync } from 'fs'
import { basename, dirname, join } from 'path'

import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  ipcMain,
  systemPreferences,
  protocol,
  BrowserView,
  WebContents,
} from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import windowStateKeeper from 'electron-window-state'
import contextMenu from 'electron-context-menu'

const webContents = (
  win: BrowserWindow | BrowserView | Electron.WebviewTag | WebContents
) => ('webContents' in win ? win.webContents : win)

contextMenu({
  prepend: (_defaultActions, parameters, browserWindow) => {
    return [
      {
        label: 'Search',
        visible: parameters.selectionText.trim().length > 0,
        click: () => {
          const text = parameters.selectionText
          const wc = webContents(browserWindow)
          wc && wc.send('searchText', text)
        },
      },
    ]
  },
})

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

ipcMain.handle('getHomePath', () => {
  return app.getPath('home')
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
