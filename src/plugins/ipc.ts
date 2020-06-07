import { Plugin } from '@nuxt/types'
import { ipcRenderer, remote } from 'electron'

const ipcPlugin: Plugin = (ctx) => {
  ipcRenderer.on('open', async () => {
    const { filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    const filePath = filePaths[0]
    if (filePath) {
      ctx.app.$eventBus.$emit('change-location', filePath)
    }
  })
  ipcRenderer.on('open-location', () => {
    ctx.app.$eventBus.$emit('focus-location')
  })
  ipcRenderer.on('find', () => {
    ctx.app.$eventBus.$emit('focus-query')
  })
  ipcRenderer.on('show-settings', () => {
    ctx.app.$eventBus.$emit('show-settings')
  })
}

export default ipcPlugin
