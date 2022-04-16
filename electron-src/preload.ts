import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doubleClickTitleBar: () => ipcRenderer.invoke('double-click-title-bar'),
  getDirname: (path: string) => ipcRenderer.invoke('get-dirname', path),
  getHomePath: () => ipcRenderer.invoke('get-home-path'),
  isDarwin: () => ipcRenderer.invoke('is-darwin'),
  listContents: (path: string) => ipcRenderer.invoke('list-contents', path),
  listContentsForPath: (path: string) =>
    ipcRenderer.invoke('list-contents-for-path', path),
  openPath: (path: string) => ipcRenderer.invoke('open-path', path),
  sendParamsForContextMenu: (params?: unknown) =>
    ipcRenderer.invoke('send-params-for-context-menu', params),
  subscribeStartPresentation: (callback: () => void) => {
    const cb = () => callback()
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
