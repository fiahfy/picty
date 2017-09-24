import { ipcRenderer } from 'electron'

export function setup (store) {
  ipcRenderer.on('open', (event, { filepath }) => {
    store.dispatch('viewer/show', filepath)
  })
}
