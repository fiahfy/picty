import path from 'path'
import { remote } from 'electron'
import { getFile, listFiles, isImage } from '../utils/file'

export default {
  namespaced: true,
  state: {
    error: null,
    isViewing: false,
    files: [],
    currentFile: {},
    fullScreen: false
  },
  actions: {
    showViewer ({ commit, dispatch, rootState }, filepath) {
      try {
        let files
        let file = getFile(filepath)
        if (file.stats.isDirectory()) {
          files = listFiles(file.path)
          files = files.filter((file) => isImage(file.path))
          file = files[0]
          if (!files.length) {
            throw new Error('Image Not Found')
          }
        } else {
          const dir = path.dirname(file.path)
          files = listFiles(dir)
          files = files.filter((file) => isImage(file.path))
        }
        commit('setError', null)
        commit('setFiles', files)
        commit('setCurrentFile', file)
      } catch (e) {
        let error = e.message === 'Image Not Found' ? e : new Error('Invalid Image')
        commit('setError', error)
        commit('setFiles', [])
        commit('setCurrentFile', {})
      }
      commit('setViewing', true)
      dispatch('focusSelector', '.viewer', { root: true })
      if (rootState.settings.fullScreen) {
        dispatch('enableFullScreen')
      }
    },
    showViewerWithSelectedFile ({ dispatch, rootState }) {
      dispatch('showViewer', rootState.explorer.selectedFile.path)
    },
    dismissViewer ({ commit, dispatch }) {
      commit('setViewing', false)
      dispatch('focusSelector', '.file-list', { root: true })
      dispatch('disableFullScreen')
    },
    viewPreviousImage ({ commit, getters, state }) {
      let index = getters.currentIndex - 1
      if (index < 0) {
        index = state.files.length - 1
      }
      commit('setCurrentFile', state.files[index])
    },
    viewNextImage ({ commit, getters, state }) {
      let index = getters.currentIndex + 1
      if (index > state.files.length - 1) {
        index = 0
      }
      commit('setCurrentFile', state.files[index])
    },
    enableFullScreen ({ commit }) {
      const browserWindow = remote.getCurrentWindow()
      browserWindow.setFullScreen(true)
      browserWindow.setMenuBarVisibility(false)
      commit('setFullScreen', true)
    },
    disableFullScreen ({ commit }) {
      const browserWindow = remote.getCurrentWindow()
      browserWindow.setFullScreen(false)
      browserWindow.setMenuBarVisibility(true)
      commit('setFullScreen', false)
    }
  },
  mutations: {
    setError (state, error) {
      state.error = error
    },
    setViewing (state, isViewing) {
      state.isViewing = isViewing
    },
    setFiles (state, files) {
      state.files = files
    },
    setCurrentFile (state, file) {
      state.currentFile = file
    },
    setFullScreen (state, fullScreen) {
      state.fullScreen = fullScreen
    },
    setCurrentIndex (state, index) {
      state.currentFile = state.files[index]
    }
  },
  getters: {
    currentIndex (state) {
      return state.files.findIndex((file) => {
        return file.path === state.currentFile.path
      })
    }
  }
}
