import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Package from '~~/package.json'
import { remote } from 'electron'
import router from '~/router'
import * as File from '~/utils/file'
import explorer from './explorer'
import starred from './starred'
import viewer from './viewer'
import bookmark from './bookmark'
import settings from './settings'

Vue.use(Vuex)

export const Selector = {
  directoryInput: 'input[name=directory]',
  queryInput: 'input[name=query]',
  explorerTable: '.explorer-table',
  starredTable: '.starred-table',
  viewer: '.viewer'
}

export default new Vuex.Store({
  state: {
    title: Package.productName,
    message: '',
    fullScreen: false,
    viewing: false,
    directory: remote.app.getPath('home')
  },
  getters: {
    titleBar (state) {
      return process.platform === 'darwin' && !state.fullScreen
    }
  },
  actions: {
    initialize ({ dispatch }) {
      dispatch('explorer/initialize')
      dispatch('starred/initialize')
    },
    open ({ dispatch }, { filepathes }) {
      const file = File.get(filepathes[0])
      if (filepathes.length === 1 && file.directory) {
        dispatch('openDirectory', { dirpath: file.path })
      } else {
        dispatch('showViewer', { filepathes })
      }
    },
    openDirectory ({ dispatch }, { dirpath }) {
      dispatch('explorer/changeDirectory', { dirpath })
      dispatch('changeRoute', { name: 'explorer' })
    },
    showViewer ({ commit, dispatch, state }, { filepathes, filepath }) {
      dispatch('viewer/loadFiles', { filepathes, filepath })
      commit('setViewing', { viewing: true })
      dispatch('focus', { selector: Selector.viewer })
      if (state.settings.fullScreen) {
        dispatch('enterFullScreen')
      }
    },
    dismissViewer ({ commit, dispatch, state }) {
      if (state.settings.fullScreen || process.platform !== 'darwin') {
        dispatch('leaveFullScreen')
      }
      commit('setViewing', { viewing: false })
      if (router.app.$route.name === 'explorer') {
        dispatch('focus', { selector: Selector.explorerTable })
      } else {
        dispatch('focus', { selector: Selector.starredTable })
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
    changeRoute ({ dispatch }, payload) {
      router.push(payload)
    },
    changeTitle ({ commit }, { title = Package.productName }) {
      document.title = title
      commit('setTitle', { title })
    },
    showMessage ({ commit, dispatch, state }, { message }) {
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
    },
    setDirectory (state, { directory }) {
      state.directory = directory
    }
  },
  modules: {
    explorer,
    starred,
    viewer,
    bookmark,
    settings
  },
  plugins: [
    createPersistedState({
      paths: [
        'directory',
        'bookmark',
        'settings'
      ]
    })
  ]
})
