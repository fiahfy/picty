import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import explorer from './explorer'
import settings from './settings'
import viewer from './viewer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: ''
  },
  actions: {
    changeRoute (_, name) {
      router.push({ name })
    },
    focusSelector (_, selector) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.focus()
        }
      }, 0)
    },
    showMessage ({ commit }, message) {
      commit('setMessage', message)
      // wait dom updated
      setTimeout(() => {
        commit('setMessage', '')
      })
    }
  },
  mutations: {
    setMessage (state, message) {
      state.message = message
    }
  },
  modules: {
    explorer,
    settings,
    viewer
  },
  plugins: [
    createPersistedState({
      paths: [
        'explorer.directory',
        'explorer.sortKey',
        'explorer.sortOrder',
        'settings'
      ]
    })
  ]
})
