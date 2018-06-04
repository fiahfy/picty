import * as File from '~/utils/file'

const scales = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]

export default {
  namespaced: true,
  state: {
    error: null,
    files: [],
    currentFilepath: '',
    originalScale: 0,
    scale: 0,
    scaling: false
  },
  getters: {
    currentFileIndex (state) {
      return state.files.findIndex((file) => state.currentFilepath === file.path)
    }
  },
  actions: {
    loadFiles ({ commit, dispatch, rootGetters }, { filepathes, filepath }) {
      try {
        const files = filepathes.map(filepath => File.get(filepath)).filter((file) => rootGetters['settings/isAllowedFile']({ filepath: file.path }))
        if (!files.length) {
          throw new Error('No Images')
        }
        commit('setError', { error: null })
        commit('setFiles', { files })
        commit('setCurrentFilepath', { currentFilepath: filepath || files[0].path })
      } catch (e) {
        const error = e.message === 'No Images' ? e : new Error('Invalid Image')
        commit('setError', { error })
        commit('setFiles', { files: [] })
        commit('setCurrentFilepath', { currentFilepath: null })
      }
    },
    movePreviousFile ({ dispatch, getters, state }) {
      let index = getters.currentFileIndex - 1
      if (index < 0) {
        index = state.files.length - 1
      }
      dispatch('moveFileIndex', { index })
    },
    moveNextFile ({ dispatch, getters, state }) {
      let index = getters.currentFileIndex + 1
      if (index > state.files.length - 1) {
        index = 0
      }
      dispatch('moveFileIndex', { index })
    },
    moveFileIndex ({ commit, state }, { index }) {
      const file = state.files[index]
      if (file) {
        commit('setCurrentFilepath', { currentFilepath: file.path })
      }
    },
    setupZoom ({ commit, state }, { scale }) {
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
    setCurrentFilepath (state, { currentFilepath }) {
      state.currentFilepath = currentFilepath
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
  }
}
