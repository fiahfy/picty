import { readdirSync, Stats, statSync } from 'fs'
import { basename, dirname, join } from 'path'
import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  ipcMain,
  shell,
  systemPreferences,
} from 'electron'

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

const getContent = (path: string): Content | undefined => {
  const stats = statSync(path)
  const type = getContentType(stats)
  if (type === 'other') {
    return undefined
  }
  return {
    dateModified: stats.mtimeMs,
    name: basename(path).normalize('NFC'),
    path,
    type,
  }
}

const listContents = (path: string, recursive = false): Content[] => {
  const filenames = readdirSync(path)
  return filenames.reduce((carry, filename) => {
    try {
      if (filename.match(/^\./)) {
        return carry
      }
      const childPath = join(path, filename)
      const content = getContent(childPath)
      if (!content) {
        return carry
      }
      if (!recursive || content.type === 'file') {
        return [...carry, content]
      }
      const contents = listContents(childPath, recursive)
      return [...carry, content, ...contents]
    } catch (e) {
      return carry
    }
  }, [] as Content[])
}

export const createIpcHandlers = (browserWindow: BrowserWindow) => {
  ipcMain.handle('getHomePath', () => app.getPath('home'))
  ipcMain.handle('isDarwin', () => process.platform === 'darwin')
  // @see https://github.com/electron/electron/issues/16385
  ipcMain.handle('doubleClickTitleBar', () => {
    const doubleClickAction = systemPreferences.getUserDefault(
      'AppleActionOnDoubleClick',
      'string'
    )
    if (doubleClickAction === 'Minimize') {
      browserWindow.minimize()
    } else if (doubleClickAction === 'Maximize') {
      if (browserWindow.isMaximized()) {
        browserWindow.unmaximize()
      } else {
        browserWindow.maximize()
      }
    }
  })
  ipcMain.handle(
    'listContents',
    (_event: IpcMainInvokeEvent, path: string, recursive = false) =>
      listContents(path, recursive)
  )
  ipcMain.handle('getDirname', (_event: IpcMainInvokeEvent, path: string) =>
    dirname(path)
  )
  ipcMain.handle(
    'listContentsForPath',
    (_event: IpcMainInvokeEvent, path: string, recursive = false) => {
      const directory = statSync(path).isDirectory()
      if (directory) {
        return listContents(path, recursive)
      } else {
        return listContents(dirname(path), recursive)
      }
    }
  )
  ipcMain.handle('openPath', (_event: IpcMainInvokeEvent, path: string) =>
    shell.openPath(path)
  )
}
