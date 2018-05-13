import Vue from 'vue'
import Vuetify from 'vuetify'
import VueMoment from 'vue-moment'
import { buildText } from '../utils/accelerator'

Vue.use(Vuetify, {
  theme: {
    primary: '#ff4081',
    accent: '#ff4081'
  }
})

Vue.use(VueMoment)

Vue.mixin({
  beforeMount () {
    const { asyncData } = this.$options
    if (asyncData) {
      this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

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
