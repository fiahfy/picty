import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import router from '../router'
import explorer from './explorer'
import settings from './settings'
import viewer from './viewer'
import { getFile } from '../utils/file'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: '',
    fullScreen: false
  },
  actions: {
    showMessage ({ commit }, { message }) {
      commit('setMessage', { message })
      // wait dom updated
      setTimeout(() => {
        commit('setMessage', { message: '' })
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
    },
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
      })
    },
    select (_, { selector }) {
      // wait dom updated
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.select()
        }
      })
    },
    open ({ dispatch }, { filepathes }) {
      if (filepathes.length === 1) {
        const filepath = filepathes[0]
        const file = getFile(filepath)
        if (file.stats.isDirectory()) {
          dispatch('explorer/changeDirectory', { dirpath: filepath })
          return
        }
      }
      const files = filepathes.map(filepath => getFile(filepath))
      dispatch('viewer/show', { files })
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
    },
    fullScreenAvailable (state) {
      return process.platform !== 'darwin'
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
        'settings'
      ]
    })
  ]
})
