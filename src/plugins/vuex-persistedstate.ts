import { Plugin } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'
import '~/store' // For reloading if store is modified

const persistedStatePlugin: Plugin = ({ store }) => {
  ;(<any>window).onNuxtReady(() => {
    createPersistedState()(store)
  })
}

export default persistedStatePlugin
