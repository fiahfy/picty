import { Plugin } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'

const persistedStatePlugin: Plugin = ({ store }) => {
  ;(<any>window).onNuxtReady(() => {
    createPersistedState()(store)
  })
}

export default persistedStatePlugin
