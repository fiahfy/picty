import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doubleClickTitleBar: () => ipcRenderer.invoke('double-click-title-bar'),
  getBasename: (path: string) => ipcRenderer.invoke('get-basename', path),
  getDirname: (path: string) => ipcRenderer.invoke('get-dirname', path),
  getFileNode: (path: string) => ipcRenderer.invoke('get-file-node', path),
  getHomePath: () => ipcRenderer.invoke('get-home-path'),
  isDarwin: () => ipcRenderer.invoke('is-darwin'),
  listContents: (path: string) => ipcRenderer.invoke('list-contents', path),
  listFiles: (path: string) => ipcRenderer.invoke('list-files', path),
  listFilesWithPath: (path: string) =>
    ipcRenderer.invoke('list-files-with-path', path),
  openPath: (path: string) => ipcRenderer.invoke('open-path', path),
  sendParamsForContextMenu: (params?: unknown) =>
    ipcRenderer.invoke('send-params-for-context-menu', params),
  subscribeAddToFavorites: (callback: (path: string) => void) => {
    const cb = (_e: IpcRendererEvent, path: string) => callback(path)
    ipcRenderer.on('add-favorite', cb)
    return () => {
      ipcRenderer.removeListener('add-favorite', cb)
    }
  },
  subscribeRemoveFromFavorites: (callback: (path: string) => void) => {
    const cb = (_e: IpcRendererEvent, path: string) => callback(path)
    ipcRenderer.on('remove-favorite', cb)
    return () => {
      ipcRenderer.removeListener('remove-favorite', cb)
    }
  },
  subscribeShowSettings: (callback: () => void) => {
    const cb = () => callback()
    ipcRenderer.on('show-settings', cb)
    return () => {
      ipcRenderer.removeListener('show-settings', cb)
    }
  },
  subscribeStartPresentation: (callback: (path: string) => void) => {
    const cb = (_e: IpcRendererEvent, path: string) => callback(path)
    ipcRenderer.on('start-presentation', cb)
    return () => {
      ipcRenderer.removeListener('start-presentation', cb)
    }
  },
  subscribeSearch: (callback: () => void) => {
    const cb = () => callback()
    ipcRenderer.on('search', cb)
    return () => {
      ipcRenderer.removeListener('search', cb)
    }
  },
})
