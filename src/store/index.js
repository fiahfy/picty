import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import Package from '~~/package.json'
import * as File from '~/utils/file'

export const state = () => ({
  title: Package.productName,
  message: null,
  fullScreen: false,
  viewing: false
})

export const getters = {
  titleBar(state) {
    return process.platform === 'darwin' && !state.fullScreen
  }
}

export const actions = {
  initialize({ dispatch }) {
    dispatch('local/explorer/initialize')
  },
  open({ dispatch }, { filepathes }) {
    const file = File.getFile(filepathes[0])
    if (filepathes.length === 1 && file.directory) {
      dispatch('openDirectory', { dirpath: file.path })
    } else {
      dispatch('showViewer', { filepathes })
    }
  },
  openDirectory({ dispatch }, { dirpath }) {
    dispatch('local/explorer/changeDirectory', { dirpath })
    this.$router.push('/explorer')
  },
  showViewer({ commit, dispatch, state }, payload) {
    dispatch('local/viewer/loadFiles', payload)
    commit('setViewing', { viewing: true })
    if (state.settings.fullScreen) {
      dispatch('enterFullScreen')
    }
  },
  dismissViewer({ commit, dispatch, state }) {
    if (state.local.viewer.loading) {
      return
    }
    if (state.settings.fullScreen || process.platform !== 'darwin') {
      dispatch('leaveFullScreen')
    }
    commit('setViewing', { viewing: false })
    if (this.$route.path === '/explorer') {
      dispatch('local/explorer/focus')
    }
  },
  enterFullScreen() {
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(true)
    browserWindow.setMenuBarVisibility(false)
  },
  leaveFullScreen() {
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(false)
    browserWindow.setMenuBarVisibility(true)
  },
  focus(_, { selector }) {
    const el = document.querySelector(selector)
    if (el) {
      el.focus()
    }
  },
  select(_, { selector }) {
    const el = document.querySelector(selector)
    if (el) {
      el.select()
    }
  },
  showMessage({ commit }, message) {
    commit('setMessage', { message })
  }
}

export const mutations = {
  setTitle(state, { title }) {
    state.title = title
  },
  setMessage(state, { message }) {
    state.message = message
  },
  setFullScreen(state, { fullScreen }) {
    state.fullScreen = fullScreen
  },
  setViewing(state, { viewing }) {
    state.viewing = viewing
  }
}

export const plugins = [
  createPersistedState({
    paths: [
      'local.explorer.directory',
      'bookmark',
      'rating',
      'views',
      'settings'
    ]
  })
]
