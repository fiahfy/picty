import { ipcRenderer } from 'electron'

export function setup (store) {
  ipcRenderer.on('open', (event, { filepath }) => {
    store.dispatch('viewer/show', filepath)
  })
  ipcRenderer.on('enterFullScreen', () => {
    store.commit('setFullScreen', true)
  })
  ipcRenderer.on('leaveFullScreen', () => {
    store.commit('setFullScreen', false)
  })
}
