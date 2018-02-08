import { ipcRenderer } from 'electron'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: true })
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: false })
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('openDirectory', (event, { dirpath }) => {
    store.dispatch('openDirectory', { dirpath })
  })
  ipcRenderer.on('openImages', (event, { filepathes }) => {
    store.dispatch('openImages', { filepathes })
  })
  ipcRenderer.on('openLocation', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
    const selector = '.location input'
    store.dispatch('focus', { selector })
    store.dispatch('select', { selector })
  })
  ipcRenderer.on('zoomIn', () => {
    store.dispatch('viewer/zoomIn')
  })
  ipcRenderer.on('zoomOut', () => {
    store.dispatch('viewer/zoomOut')
  })
  ipcRenderer.on('resetZoom', () => {
    store.dispatch('viewer/resetZoom')
  })
}
