import { ipcRenderer, remote } from 'electron'
import { Selector } from '~/store'

export const addIpcRendererListeners = (store) => {
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: true })
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', { fullScreen: false })
  })
  ipcRenderer.on('appCommand', (e, cmd) => {
    switch (cmd) {
      case 'browser-backward':
        store.dispatch('local/explorer/backDirectory')
        break
      case 'browser-forward':
        store.dispatch('local/explorer/forwardDirectory')
        break
    }
  })
  ipcRenderer.on('openDirectory', () => {
    const filepathes = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (!filepathes || !filepathes.length) {
      return
    }
    const dirpath = filepathes[0]
    store.dispatch('openDirectory', { dirpath })
  })
  ipcRenderer.on('openImages', () => {
    const filepathes = remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    if (!filepathes || !filepathes.length) {
      return
    }
    store.dispatch('showViewer', { filepathes })
  })
  ipcRenderer.on('search', () => {
    store.dispatch('focus', { selector: Selector.queryInput })
    store.dispatch('select', { selector: Selector.queryInput })
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('showBookmark', () => {
    store.dispatch('changeRoute', { name: 'bookmark' })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('openLocation', () => {
    store.dispatch('focus', { selector: Selector.directoryInput })
    store.dispatch('select', { selector: Selector.directoryInput })
    store.dispatch('changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('backDirectory', () => {
    store.dispatch('local/explorer/backDirectory')
  })
  ipcRenderer.on('forwardDirectory', () => {
    store.dispatch('local/explorer/forwardDirectory')
  })
  ipcRenderer.on('upDirectory', () => {
    store.dispatch('local/explorer/upDirectory')
  })
  ipcRenderer.on('changeHomeDirectory', () => {
    store.dispatch('local/explorer/changeHomeDirectory')
  })
  ipcRenderer.on('bookmarkDirectory', () => {
    store.dispatch('local/explorer/toggleDirectoryBookmarked')
  })
  ipcRenderer.on('browseDirectory', () => {
    store.dispatch('local/explorer/browseDirectory')
  })
  ipcRenderer.on('zoomIn', () => {
    store.dispatch('local/viewer/zoomIn')
  })
  ipcRenderer.on('zoomOut', () => {
    store.dispatch('local/viewer/zoomOut')
  })
  ipcRenderer.on('resetZoom', () => {
    store.dispatch('local/viewer/resetZoom')
  })
}
