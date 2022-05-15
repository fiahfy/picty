import { Dirent, Stats, promises } from 'fs'
import { basename, dirname, join, sep } from 'path'
import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  ipcMain,
  shell,
  systemPreferences,
} from 'electron'

const { readdir, stat } = promises

type File = {
  name: string
  path: string
  type: 'file' | 'directory' | 'other'
}
type FileNode = File & { children?: FileNode[] }
type Content = File & { dateModified: number }

const getFileType = (obj: Stats | Dirent) => {
  if (obj.isFile()) {
    return 'file'
  } else if (obj.isDirectory()) {
    return 'directory'
  } else {
    return 'other'
  }
}

const getContent = async (path: string): Promise<Content> => {
  const stats = await stat(path)
  const type = getFileType(stats)
  return {
    dateModified: stats.mtimeMs,
    name: basename(path).normalize('NFC'),
    path,
    type,
  }
}

const listContents = async (path: string): Promise<Content[]> => {
  const filenames = await readdir(path)
  const contents = await filenames.reduce(async (c, filename) => {
    const carry = await c
    const childPath = join(path, filename)
    const content = await getContent(childPath)
    return [...carry, content]
  }, Promise.resolve([]) as Promise<Content[]>)
  return contents.filter(
    (content) => !content.name.match(/^\./) && content.type !== 'other'
  )
}

const listFiles = async (path: string): Promise<File[]> => {
  const dirents = await readdir(path, { withFileTypes: true })
  return dirents
    .map(
      (dirent) =>
        ({
          name: dirent.name,
          path: join(path, dirent.name),
          type: getFileType(dirent),
        } as const)
    )
    .filter((file) => !file.name.match(/^\./) && file.type !== 'other')
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
  ipcMain.handle(
    'get-file-node',
    async (_event: IpcMainInvokeEvent, path: string) => {
      const dirnames = path.split(sep)

      let rootPath = dirnames[0]
      // for darwin
      if (!rootPath) {
        rootPath = sep
      }
      dirnames[0] = rootPath

      let node: FileNode = {
        children: [
          {
            name: rootPath,
            path: rootPath,
            type: 'directory',
          },
        ],
        name: '',
        path: '',
        type: 'directory',
      }

      node = await dirnames.reduce(async (n, _dirname, i) => {
        const node = await n
        const targetNode = dirnames
          .slice(0, i + 1)
          .reduce(
            (carry: FileNode | undefined, dirname) =>
              carry?.children?.find((node) => node.name === dirname),
            node
          )
        if (targetNode) {
          const path = dirnames.slice(0, i + 1).join(sep)
          targetNode.children = await listFiles(path)
        }
        return node
      }, Promise.resolve(node))

      return node.children?.[0]
    }
  )
  ipcMain.handle('get-home-path', () => app.getPath('home'))
  ipcMain.handle('is-darwin', () => process.platform === 'darwin')
  ipcMain.handle('list-contents', (_event: IpcMainInvokeEvent, path: string) =>
    listContents(path)
  )
  ipcMain.handle('list-files', (_event: IpcMainInvokeEvent, path: string) =>
    listFiles(path)
  )
  ipcMain.handle(
    'list-files-with-path',
    async (_event: IpcMainInvokeEvent, path: string) => {
      const stats = await stat(path)
      const directory = stats.isDirectory()
      return directory ? listFiles(path) : listFiles(dirname(path))
    }
  )
  ipcMain.handle('open-path', (_event: IpcMainInvokeEvent, path: string) =>
    shell.openPath(path)
  )
}
