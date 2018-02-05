import path from 'path'
import { getFile, listFiles, isImage } from '../utils/file'

const scales = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]

export default {
  namespaced: true,
  state: {
    error: null,
    display: false,
    files: [],
    currentFile: null,
    originalScale: 0,
    scale: 0,
    scaling: false
  },
  actions: {
    showSelectedFile ({ dispatch, rootState }) {
      if (rootState.explorer.selectedFile) {
        const filepath = rootState.explorer.selectedFile.path
        dispatch('showFile', { filepath })
      }
    },
    showFile ({ dispatch }, { filepath }) {
      const file = getFile(filepath)
      if (file.stats.isDirectory()) {
        dispatch('showDirectory', { dirpath: filepath, recursive: true })
      } else {
        dispatch('showDirectory', { dirpath: path.dirname(filepath), currentFile: file })
      }
    },
    showDirectory ({ dispatch }, { dirpath, currentFile, recursive = false }) {
      const files = listFiles(dirpath, { recursive })
      dispatch('show', { files, currentFile })
    },
    show ({ commit, dispatch, rootGetters, rootState }, { files, currentFile }) {
      try {
        files = files.filter((file) => isImage(file.path))
        if (!files.length) {
          throw new Error('Image Not Found')
        }
        commit('setError', { error: null })
        commit('setFiles', { files })
        currentFile = currentFile || files[0]
        commit('setCurrentFile', { currentFile })
      } catch (e) {
        const error = e.message === 'Image Not Found' ? e : new Error('Invalid Image')
        commit('setError', { error })
        commit('setFiles', { files: [] })
        commit('setCurrentFile', { currentFile: null })
      }
      commit('setDisplay', { display: true })
      dispatch('focus', { selector: '.viewer' }, { root: true })
      if (rootState.settings.fullScreen && rootGetters.fullScreenAvailable) {
        dispatch('enterFullScreen', null, { root: true })
      }
    },
    dismiss ({ commit, dispatch, rootGetters }) {
      commit('setDisplay', { display: false })
      dispatch('focus', { selector: '.file-list table' }, { root: true })
      if (rootGetters.fullScreenAvailable) {
        dispatch('leaveFullScreen', null, { root: true })
      }
    },
    viewPreviousImage ({ commit, getters, state }) {
      let index = getters.currentIndex - 1
      if (index < 0) {
        index = state.files.length - 1
      }
      const currentFile = state.files[index]
      commit('setCurrentFile', { currentFile })
    },
    viewNextImage ({ commit, getters, state }) {
      let index = getters.currentIndex + 1
      if (index > state.files.length - 1) {
        index = 0
      }
      const currentFile = state.files[index]
      commit('setCurrentFile', { currentFile })
    },
    initZoom ({ commit, state }, { scale }) {
      commit('setScale', { scale })
      commit('setOriginalScale', { originalScale: scale })
      commit('setScaling', { scaling: false })
    },
    zoomIn ({ commit, state }) {
      const scale = scales.find((scale) => {
        return scale > state.scale
      }) || state.scale
      commit('setScale', { scale })
      commit('setScaling', { scaling: true })
    },
    zoomOut ({ commit, state }) {
      const scale = scales.concat().reverse().find((scale) => {
        return scale < state.scale
      }) || state.scale
      commit('setScale', { scale })
      commit('setScaling', { scaling: true })
    },
    resetZoom ({ commit, state }) {
      commit('setScale', { scale: state.originalScale })
      commit('setScaling', { scaling: false })
    }
  },
  mutations: {
    setError (state, { error }) {
      state.error = error
    },
    setDisplay (state, { display }) {
      state.display = display
    },
    setFiles (state, { files }) {
      state.files = files
    },
    setCurrentFile (state, { currentFile }) {
      state.currentFile = currentFile
    },
    setCurrentIndex (state, { currentIndex }) {
      state.currentFile = state.files[currentIndex]
    },
    setOriginalScale (state, { originalScale }) {
      state.originalScale = originalScale
    },
    setScale (state, { scale }) {
      state.scale = scale
    },
    setScaling (state, { scaling }) {
      state.scaling = scaling
    }
  },
  getters: {
    currentIndex (state) {
      return state.files.findIndex((file) => {
        return state.currentFile && file.path === state.currentFile.path
      })
    }
  }
}
