import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.invoke('message', message),
  isDarwin: () => ipcRenderer.invoke('isDarwin'),
  doubleClickTitleBar: () => ipcRenderer.invoke('doubleClickTitleBar'),
})
