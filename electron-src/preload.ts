import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doubleClickTitleBar: () => ipcRenderer.invoke('doubleClickTitleBar'),
  getDirname: (filePath: string) => ipcRenderer.invoke('getDirname', filePath),
  getHomePath: () => ipcRenderer.invoke('getHomePath'),
  isDarwin: () => ipcRenderer.invoke('isDarwin'),
  listContents: (dirPath: string) =>
    ipcRenderer.invoke('listContents', dirPath),
})
