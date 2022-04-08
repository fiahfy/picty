import { IpcRendererEvent, ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doubleClickTitleBar: () => ipcRenderer.invoke('doubleClickTitleBar'),
  getDirname: (path: string) => ipcRenderer.invoke('getDirname', path),
  getHomePath: () => ipcRenderer.invoke('getHomePath'),
  isDarwin: () => ipcRenderer.invoke('isDarwin'),
  listContents: (path: string) => ipcRenderer.invoke('listContents', path),
  listContentsForPath: (path: string) =>
    ipcRenderer.invoke('listContentsForPath', path),
  subscribeSearchText: (callback: (text: string) => void) => {
    const cb = (_e: IpcRendererEvent, text: string) => callback(text)
    ipcRenderer.on('searchText', cb)
    return () => {
      ipcRenderer.removeListener('searchText', cb)
    }
  },
  openPath: (path: string) => ipcRenderer.invoke('openPath', path),
})
