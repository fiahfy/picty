import File from '../utils/file'

const scales = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]

export default {
  namespaced: true,
  state: {
    error: null,
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
      const file = new File(filepath)
      if (file.isDirectory()) {
        dispatch('showDirectory', { dirpath: filepath, recursive: true })
      } else {
        dispatch('showDirectory', { dirpath: file.parent.path, currentFilepath: filepath })
      }
    },
    showDirectory ({ dispatch }, { dirpath, currentFilepath, recursive = false }) {
      const filepathes = File.listFiles(dirpath, { recursive }).map(file => file.path)
      dispatch('show', { filepathes, currentFilepath })
    },
    show ({ commit, dispatch, rootState }, { filepathes, currentFilepath }) {
      try {
        const files = filepathes.map(filepath => new File(filepath)).filter((file) => file.isImage())
        if (!files.length) {
          throw new Error('Image Not Found')
        }
        const currentFile = currentFilepath ? new File(currentFilepath) : files[0]
        commit('setError', { error: null })
        commit('setFiles', { files })
        commit('setCurrentFile', { currentFile })
      } catch (e) {
        const error = e.message === 'Image Not Found' ? e : new Error('Invalid Image')
        commit('setError', { error })
        commit('setFiles', { files: [] })
        commit('setCurrentFile', { currentFile: null })
      }
      dispatch('showViewer', null, { root: true })
    },
    dismiss ({ commit, dispatch, rootState }) {
      dispatch('dismissViewer', null, { root: true })
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
