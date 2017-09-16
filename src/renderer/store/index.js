import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import explorer from './explorer'
import settings from './settings'
import viewer from './viewer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    explorer,
    settings,
    viewer
  },
  mutations: {
    changeRoute (state, name) {
      router.push({ name })
    }
  },
  plugins: [
    createPersistedState({
      paths: [
        'explorer.directory',
        'settings'
      ]
    })
  ]
})
