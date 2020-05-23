import { Plugin } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'
import '~/store' // For reloading if store is modified

const persistedStatePlugin: Plugin = ({ store }) => {
  createPersistedState()(store)
}

export default persistedStatePlugin
