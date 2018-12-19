import { ipcRenderer, remote } from 'electron'
import selector from '~/consts/selector'

export default ({ store }) => {
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
    const filepathes = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (!filepathes || !filepathes.length) {
      return
    }
    const dirpath = filepathes[0]
    store.dispatch('openDirectory', { dirpath })
  })
  ipcRenderer.on('openImages', () => {
    const filepathes = remote.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    })
    if (!filepathes || !filepathes.length) {
      return
    }
    store.dispatch('showViewer', { filepathes })
  })
  ipcRenderer.on('search', () => {
    store.dispatch('focus', { selector: selector.QUERY_INPUT })
    store.dispatch('select', { selector: selector.QUERY_INPUT })
  })
  ipcRenderer.on('showExplorer', () => {
    store.$router.push('/explorer')
  })
  ipcRenderer.on('showBookmark', () => {
    store.$router.push('/bookmark')
  })
  ipcRenderer.on('showSettings', () => {
    store.$router.push('/settings')
  })
  ipcRenderer.on('openLocation', () => {
    store.$router.push('/explorer')
    setTimeout(() => {
      store.dispatch('focus', { selector: selector.DIRECTORY_INPUT })
      store.dispatch('select', { selector: selector.DIRECTORY_INPUT })
    }, 100)
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
