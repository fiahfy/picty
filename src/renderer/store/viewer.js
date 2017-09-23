import path from 'path'
import { remote } from 'electron'
import { listFiles, isImage } from '../utils/file'

export default {
  namespaced: true,
  state: {
    error: null,
    isViewing: false,
    files: [],
    currentFile: {},
    currentIndex: -1,
    fullScreen: false
  },
  actions: {
    async showViewer ({ commit, dispatch, rootState }, file) {
      try {
        let files
        if (file.stats.isDirectory()) {
          files = await listFiles(file.path)
          files = files.filter((file) => isImage(file.path))
          file = files[0]
          if (!files.length) {
            throw new Error('Image Not Found')
          }
        } else {
          const dir = path.dirname(file.path)
          files = await listFiles(dir)
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
    dismissViewer ({ commit, dispatch }) {
      commit('setViewing', false)
      dispatch('focusSelector', '.file-list', { root: true })
      dispatch('disableFullScreen')
    },
    async showViewerWithSelectedFile ({ dispatch, rootState }) {
      await dispatch('showViewer', rootState.explorer.selectedFile)
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
      state.currentIndex = state.files.findIndex((file) => {
        return file.path === state.currentFile.path
      })
    },
    setCurrentIndex (state, index) {
      state.currentIndex = index
      state.currentFile = state.files[index]
    },
    setFullScreen (state, fullScreen) {
      state.fullScreen = fullScreen
    },
    viewPreviousImage (state) {
      let index = state.currentIndex - 1
      if (index < 0) {
        index = state.files.length - 1
      }
      state.currentIndex = index
      state.currentFile = state.files[index]
    },
    viewNextImage (state) {
      let index = state.currentIndex + 1
      if (index > state.files.length - 1) {
        index = 0
      }
      state.currentIndex = index
      state.currentFile = state.files[index]
    }
  }
}
