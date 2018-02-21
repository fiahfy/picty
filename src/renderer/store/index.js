import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import router from '../router'
import explorer from './explorer'
import bookmark from './bookmark'
import settings from './settings'
import viewer from './viewer'
import File from '../utils/file'

Vue.use(Vuex)

const Selector = {
  locationInput: '.location>input',
  searchInput: '.search>input',
  explorerList: '.explorer-list',
  bookmarkList: '.bookmark-list',
  viewer: '.viewer'
}

export default new Vuex.Store({
  state: {
    message: '',
    viewing: false,
    fullScreen: false
  },
  actions: {
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
    focusLocationInput ({ dispatch }) {
      dispatch('focus', { selector: Selector.locationInput })
      dispatch('select', { selector: Selector.locationInput })
    },
    focusSearchInput ({ dispatch }) {
      dispatch('focus', { selector: Selector.searchInput })
      dispatch('select', { selector: Selector.searchInput })
    },
    focusExplorerList ({ dispatch }) {
      dispatch('focus', { selector: Selector.explorerList })
    },
    focusBookmarkList ({ dispatch }) {
      dispatch('focus', { selector: Selector.bookmarkList })
    },
    open ({ dispatch }, { filepathes }) {
      const file = new File(filepathes[0])
      if (filepathes.length === 1 && file.isDirectory()) {
        dispatch('openDirectory', { dirpath: file.path })
      } else {
        dispatch('openImages', { filepathes })
      }
    },
    openDirectory ({ dispatch }, { dirpath }) {
      dispatch('explorer/changeDirectory', { dirpath })
    },
    openImages ({ dispatch }, { filepathes }) {
      dispatch('viewer/show', { filepathes })
    },
    showMessage ({ commit }, { message }) {
      commit('setMessage', { message })
      // wait dom updated
      setTimeout(() => {
        commit('setMessage', { message: '' })
      })
    },
    showViewer ({ commit, dispatch, state }) {
      commit('setViewing', { viewing: true })
      dispatch('focus', { selector: Selector.viewer })
      if (state.settings.fullScreen) {
        dispatch('enterFullScreen')
      }
    },
    dismissViewer ({ commit, dispatch, state }) {
      commit('setViewing', { viewing: false })
      if (router.app.$route.name === 'explorer') {
        dispatch('focus', { selector: Selector.explorerList })
      } else {
        dispatch('focus', { selector: Selector.bookmarkList })
      }
      if (state.settings.fullScreen || process.platform !== 'darwin') {
        dispatch('leaveFullScreen')
      }
    }
  },
  mutations: {
    setMessage (state, { message }) {
      state.message = message
    },
    setViewing (state, { viewing }) {
      state.viewing = viewing
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
    bookmark,
    settings,
    viewer
  },
  plugins: [
    createPersistedState({
      paths: [
        'explorer.directory',
        'bookmark.bookmarks',
        'settings'
      ]
    })
  ]
})
