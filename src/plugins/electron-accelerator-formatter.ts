import Vue from 'vue'
import { format } from '@fiahfy/electron-accelerator-formatter'

Vue.filter('accelerator', (title: string, accelerator?: string): string => {
  return accelerator ? `${title} (${format(accelerator)})` : title
})
