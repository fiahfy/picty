import { ipcRenderer, remote } from 'electron'
import { Selector } from '~/store/modules'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('app/setFullScreen', { fullScreen: true })
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('app/setFullScreen', { fullScreen: false })
  })
  ipcRenderer.on('openDirectory', () => {
    const filepathes = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (!filepathes.length) {
      return
    }
    const dirpath = filepathes[0]
    store.dispatch('app/openDirectory', { dirpath })
  })
  ipcRenderer.on('openImages', () => {
    const filepathes = remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    if (!filepathes.length) {
      return
    }
    store.dispatch('app/openImages', { filepathes })
  })
  ipcRenderer.on('search', () => {
    store.dispatch('app/focus', { selector: Selector.queryInput })
    store.dispatch('app/select', { selector: Selector.queryInput })
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('app/changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('showBookmark', () => {
    store.dispatch('app/changeRoute', { name: 'bookmark' })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('app/changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('openLocation', () => {
    store.dispatch('app/focus', { selector: Selector.directoryInput })
    store.dispatch('app/select', { selector: Selector.directoryInput })
    store.dispatch('app/changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('backDirectory', () => {
    store.dispatch('app/explorer/backDirectory')
  })
  ipcRenderer.on('forwardDirectory', () => {
    store.dispatch('app/explorer/forwardDirectory')
  })
  ipcRenderer.on('upDirectory', () => {
    store.dispatch('app/explorer/upDirectory')
  })
  ipcRenderer.on('changeHomeDirectory', () => {
    store.dispatch('app/explorer/changeHomeDirectory')
  })
  ipcRenderer.on('openCurrentDirectory', () => {
    store.dispatch('app/explorer/openDirectory')
  })
  ipcRenderer.on('zoomIn', () => {
    store.dispatch('app/viewer/zoomIn')
  })
  ipcRenderer.on('zoomOut', () => {
    store.dispatch('app/viewer/zoomOut')
  })
  ipcRenderer.on('resetZoom', () => {
    store.dispatch('app/viewer/resetZoom')
  })
}
