import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import Package from '~~/package.json'
import router from '~/router'
import * as File from '~/utils/file'
import local from './local'
import bookmark from './bookmark'
import rating from './rating'
import settings from './settings'

Vue.use(Vuex)

export const Selector = {
  directoryInput: 'input[name=directory]',
  queryInput: 'input[name=query]',
  explorerTable: '.explorer-table',
  explorerGridList: '.explorer-grid-list'
}

export default new Vuex.Store({
  state: {
    title: Package.productName,
    message: null,
    fullScreen: false,
    viewing: false
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  actions: {
    initialize ({ dispatch }) {
      dispatch('local/explorer/initialize')
    },
    open ({ dispatch }, { filepathes }) {
      const file = File.getFile(filepathes[0])
      if (filepathes.length === 1 && file.directory) {
        dispatch('openDirectory', { dirpath: file.path })
      } else {
        dispatch('showViewer', { filepathes })
      }
    },
    openDirectory ({ dispatch }, { dirpath }) {
      dispatch('local/explorer/changeDirectory', { dirpath })
      dispatch('changeRoute', { name: 'explorer' })
    },
    showViewer ({ commit, dispatch, state }, payload) {
      dispatch('local/viewer/loadFiles', payload)
      commit('setViewing', { viewing: true })
      if (state.settings.fullScreen) {
        dispatch('enterFullScreen')
      }
    },
    dismissViewer ({ commit, dispatch, state }) {
      if (state.local.viewer.loading) {
        return
      }
      if (state.settings.fullScreen || process.platform !== 'darwin') {
        dispatch('leaveFullScreen')
      }
      commit('setViewing', { viewing: false })
      if (router.app.$route.name === 'explorer') {
        dispatch('local/explorer/focus')
      }
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
    changeRoute (_, payload) {
      router.push(payload)
    },
    changeTitle ({ commit }, { title = Package.productName }) {
      document.title = title
      commit('setTitle', { title })
    },
    showMessage ({ commit }, message) {
      commit('setMessage', { message })
    }
  },
  mutations: {
    setTitle (state, { title }) {
      state.title = title
    },
    setMessage (state, { message }) {
      state.message = message
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    },
    setViewing (state, { viewing }) {
      state.viewing = viewing
    }
  },
  modules: {
    local,
    bookmark,
    rating,
    settings
  },
  plugins: [
    createPersistedState({
      paths: [
        'local.explorer.directory',
        'bookmark',
        'rating',
        'settings'
      ]
    })
  ]
})
