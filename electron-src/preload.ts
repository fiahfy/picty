import { IpcRendererEvent, ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doubleClickTitleBar: () => ipcRenderer.invoke('doubleClickTitleBar'),
  getDirname: (path: string) => ipcRenderer.invoke('getDirname', path),
  getHomePath: () => ipcRenderer.invoke('getHomePath'),
  isDarwin: () => ipcRenderer.invoke('isDarwin'),
  listContents: (path: string) => ipcRenderer.invoke('listContents', path),
  listContentsForPath: (path: string) =>
    ipcRenderer.invoke('listContentsForPath', path),
  onSearchText: (callback: (event: IpcRendererEvent, text: string) => void) => {
    ipcRenderer.on('searchText', callback)
  },
  openPath: (path: string) => ipcRenderer.invoke('openPath', path),
})
