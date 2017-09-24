import { ipcRenderer } from 'electron'

export function setup (store) {
  ipcRenderer.on('open', (event, { filepath }) => {
    store.dispatch('viewer/show', filepath)
  })
  ipcRenderer.on('showExplorer', () => {
    store.dispatch('changeRoute', 'explorer')
  })
  ipcRenderer.on('showSettings', () => {
    store.dispatch('changeRoute', 'settings')
  })
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', true)
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', false)
  })
}
