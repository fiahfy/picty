import { Stats, readdirSync, statSync } from 'fs'
import { basename, dirname, join, sep } from 'path'
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
type ContentNode = Content & { children?: ContentNode[] }

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

export const addHandlers = (browserWindow: BrowserWindow) => {
  // @see https://github.com/electron/electron/issues/16385
  ipcMain.handle('double-click-title-bar', () => {
    const action = systemPreferences.getUserDefault(
      'AppleActionOnDoubleClick',
      'string'
    )

    if (action === 'None') {
      // noop
    } else if (action === 'Minimize') {
      browserWindow.minimize()
    } else {
      if (browserWindow.isMaximized()) {
        browserWindow.unmaximize()
      } else {
        browserWindow.maximize()
      }
    }
  })
  ipcMain.handle('get-basename', (_event: IpcMainInvokeEvent, path: string) =>
    basename(path)
  )
  ipcMain.handle('get-dirname', (_event: IpcMainInvokeEvent, path: string) =>
    dirname(path)
  )
  ipcMain.handle('get-home-path', () => app.getPath('home'))
  ipcMain.handle('is-darwin', () => process.platform === 'darwin')
  ipcMain.handle(
    'list-contents',
    (_event: IpcMainInvokeEvent, path: string, recursive = false) =>
      listContents(path, recursive)
  )
  ipcMain.handle(
    'list-contents-for-path',
    (_event: IpcMainInvokeEvent, path: string, recursive = false) => {
      const directory = statSync(path).isDirectory()
      if (directory) {
        return listContents(path, recursive)
      } else {
        return listContents(dirname(path), recursive)
      }
    }
  )
  ipcMain.handle(
    'get-content-node',
    (_event: IpcMainInvokeEvent, path: string) => {
      const dirnames = path.split(sep)

      // for darwin
      if (dirnames[0] === '') {
        dirnames[0] = sep
      }

      const rootPath = dirnames[0]

      let node: ContentNode = {
        children: [
          {
            dateModified: Date.now(),
            name: rootPath,
            path: rootPath,
            type: 'directory',
          },
        ],
        dateModified: Date.now(),
        name: '',
        path: '',
        type: 'directory',
      }

      node = dirnames.reduce((node, _dirname, i) => {
        const targetNode = dirnames
          .slice(0, i + 1)
          .reduce(
            (carry: ContentNode | undefined, dirname) =>
              carry?.children?.find((node) => node.name === dirname),
            node
          )
        if (targetNode) {
          const path = dirnames.slice(0, i + 1).join(sep)
          targetNode.children = listContents(path)
        }
        return node
      }, node)

      return node.children?.[0]
    }
  )
  ipcMain.handle('open-path', (_event: IpcMainInvokeEvent, path: string) =>
    shell.openPath(path)
  )
}
