import { join } from 'path'
import {
  BrowserView,
  BrowserWindow,
  WebContents,
  app,
  protocol,
} from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import windowStateKeeper from 'electron-window-state'
import contextMenu from 'electron-context-menu'
import { createIpcHandlers } from './handlers'

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
  createIpcHandlers(mainWindow)
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
