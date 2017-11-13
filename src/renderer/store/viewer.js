import { getFile, listFiles, isImage } from '../utils/file'

export default {
  namespaced: true,
  state: {
    error: null,
    display: false,
    files: [],
    currentFile: null
  },
  actions: {
    show ({ commit, dispatch, rootState }, { filepath }) {
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
          files = [file]
        }
        commit('setError', { error: null })
        commit('setFiles', { files })
        commit('setCurrentFile', { file })
      } catch (e) {
        let error = e.message === 'Image Not Found' ? e : new Error('Invalid Image')
        commit('setError', { error })
        commit('setFiles', { files: [] })
        commit('setCurrentFile', { file: null })
      }
      commit('setDisplay', { flag: true })
      dispatch('focus', { selector: '.viewer' }, { root: true })
      if (rootState.settings.fullScreen && process.platform !== 'darwin') {
        dispatch('enterFullScreen', null, { root: true })
      }
    },
    showSelectedFile ({ dispatch, rootState }) {
      if (rootState.explorer.selectedFile) {
        const filepath = rootState.explorer.selectedFile.path
        dispatch('show', { filepath })
      }
    },
    dismiss ({ commit, dispatch, rootState }) {
      commit('setDisplay', { flag: false })
      dispatch('focus', { selector: '.file-list' }, { root: true })
      if (process.platform !== 'darwin') {
        dispatch('leaveFullScreen', null, { root: true })
      }
    },
    viewPreviousImage ({ commit, getters, state }) {
      let index = getters.currentIndex - 1
      if (index < 0) {
        index = state.files.length - 1
      }
      const file = state.files[index]
      commit('setCurrentFile', { file })
    },
    viewNextImage ({ commit, getters, state }) {
      let index = getters.currentIndex + 1
      if (index > state.files.length - 1) {
        index = 0
      }
      const file = state.files[index]
      commit('setCurrentFile', { file })
    }
  },
  mutations: {
    setError (state, { error }) {
      state.error = error
    },
    setDisplay (state, { flag }) {
      state.display = flag
    },
    setFiles (state, { files }) {
      state.files = files
    },
    setCurrentFile (state, { file }) {
      state.currentFile = file
    },
    setCurrentIndex (state, { index }) {
      state.currentFile = state.files[index]
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
