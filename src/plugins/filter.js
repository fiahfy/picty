import Vue from 'vue'
import { format } from '@fiahfy/electron-accelerator-formatter'

Vue.filter('accelerator', (title, accelerator) => {
  return `${title} (${format(accelerator)})`
})

Vue.filter('readableSize', (bytes) => {
  if (bytes === null) {
    return ''
  }
  if (bytes === 0) {
    return '0 Byte'
  }
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / 1024 ** i, 2) + ' ' + sizes[i]
})
