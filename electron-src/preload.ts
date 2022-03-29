import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doubleClickTitleBar: () => ipcRenderer.invoke('doubleClickTitleBar'),
  getDirname: (filePath: string) => ipcRenderer.invoke('getDirname', filePath),
  getHomePath: () => ipcRenderer.invoke('getHomePath'),
  isDarwin: () => ipcRenderer.invoke('isDarwin'),
  listContents: (dirPath: string) =>
    ipcRenderer.invoke('listContents', dirPath),
  onSearchText: (callback: (event: IpcRendererEvent, text: string) => void) => {
    ipcRenderer.on('searchText', callback)
  },
})
