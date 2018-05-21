import Vue from 'vue'
import Vuetify from 'vuetify'
import VueMoment from 'vue-moment'
import VueLongPress from 'vue-long-press-directive'
import { buildText } from '~/utils/accelerator'

Vue.use(Vuetify, {
  theme: {
    primary: '#ff4081',
    accent: '#ff4081'
  }
})

Vue.use(VueMoment)

Vue.use(VueLongPress, { duration: 300 })

Vue.filter('accelerator', (title, accelerator) => {
  return `${title} (${buildText(accelerator)})`
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
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
})
