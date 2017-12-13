import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import router from '../router'
import explorer from './explorer'
import settings from './settings'
import viewer from './viewer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: '',
    fullScreen: false
  },
  actions: {
    changeRoute (_, payload) {
      router.push(payload)
    },
    focus (_, { selector }) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.focus()
        }
      }, 0)
    },
    showMessage ({ commit }, { message }) {
      commit('setMessage', { message })
      // wait dom updated
      setTimeout(() => {
        commit('setMessage', '')
      })
    },
    enterFullScreen () {
      const browserWindow = remote.getCurrentWindow()
      browserWindow.setFullScreen(true)
      browserWindow.setMenuBarVisibility(false)
    },
    leaveFullScreen () {
      const browserWindow = remote.getCurrentWindow()
      browserWindow.setFullScreen(false)
      browserWindow.setMenuBarVisibility(true)
    }
  },
  mutations: {
    setMessage (state, { message }) {
      state.message = message
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    }
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
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
