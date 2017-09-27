import { ipcRenderer } from 'electron'

export function setup (store) {
  ipcRenderer.on('open', (event, { filepath }) => {
    store.dispatch('explorer/action', { filepath })
  })
  ipcRenderer.on('openLocation', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
    store.dispatch('focus', { selector: '.location input' })
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('changeRoute', { name: 'explorer' })
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', { name: 'settings' })
  })
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', { flag: true })
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', { flag: false })
  })
}
