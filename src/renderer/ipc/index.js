import { ipcRenderer } from 'electron'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('openDirectory', (event, { dirpath }) => {
    store.dispatch('openDirectory', { dirpath })
  })
  ipcRenderer.on('openImages', (event, { filepathes }) => {
    store.dispatch('openImages', { filepathes })
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: true })
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: false })
  })
  ipcRenderer.on('openLocation', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
    const selector = '.location input'
    store.dispatch('focus', { selector })
    store.dispatch('select', { selector })
  })
}
