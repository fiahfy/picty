
import { remote } from 'electron'
import router from '~/router'
import File from '~/utils/file'
import explorer from './explorer'
import bookmark from './bookmark'
import viewer from './viewer'

export const Selector = {
  directoryInput: 'input[name=directory]',
  queryInput: 'input[name=query]',
  explorerTable: '.explorer-table',
  bookmarkTable: '.bookmark-table',
  viewer: '.viewer'
}

export default {
  namespaced: true,
  state: {
    message: '',
    messages: [],
    snackbar: false,
    viewing: false,
    fullScreen: false
  },
  actions: {
    initialize ({ dispatch }) {
      dispatch('explorer/initialize')
      dispatch('bookmark/initialize')
    },
    open ({ dispatch }, { filepathes }) {
      const file = new File(filepathes[0])
      if (filepathes.length === 1 && file.isDirectory()) {
        dispatch('showDirectory', { dirpath: file.path })
      } else {
        dispatch('showViewer', { filepathes })
      }
    },
    showDirectory ({ dispatch }, { dirpath }) {
      dispatch('explorer/changeDirectory', { dirpath })
      dispatch('changeRoute', { name: 'explorer' })
    },
    showViewer ({ commit, dispatch, rootState }, { filepathes, filepath }) {
      dispatch('viewer/load', { filepathes, filepath })
      commit('setViewing', { viewing: true })
      dispatch('focus', { selector: Selector.viewer })
      if (rootState.settings.fullScreen) {
        dispatch('enterFullScreen')
      }
    },
    dismissViewer ({ commit, dispatch, rootState }) {
      if (rootState.settings.fullScreen || process.platform !== 'darwin') {
        dispatch('leaveFullScreen')
      }
      commit('setViewing', { viewing: false })
      if (router.app.$route.name === 'explorer') {
        dispatch('focus', { selector: Selector.explorerTable })
      } else {
        dispatch('focus', { selector: Selector.bookmarkTable })
      }
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
    showMessage ({ commit, dispatch, state }, { message }) {
      if (state.snackbar) {
        commit('setMessages', { messages: [...state.messages, message] })
        return
      }
      commit('setMessage', { message })
      commit('setSnackbar', { snackbar: true })
    },
    showNextMessage ({ commit, state }) {
      if (!state.messages.length) {
        return
      }
      const message = state.messages[0]
      commit('setMessage', { message })
      commit('setMessages', { messages: state.messages.slice(1) })
      commit('setSnackbar', { snackbar: true })
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
    setMessages (state, { messages }) {
      state.messages = messages
    },
    setSnackbar (state, { snackbar }) {
      state.snackbar = snackbar
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
    viewer
  }
}
