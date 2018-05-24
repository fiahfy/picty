import File from '~/utils/file'

const scales = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]

export default {
  namespaced: true,
  state: {
    error: null,
    items: [],
    filepath: '',
    originalScale: 0,
    scale: 0,
    scaling: false
  },
  actions: {
    load ({ commit, dispatch }, { filepathes, filepath }) {
      try {
        const items = filepathes.map(filepath => new File(filepath)).filter((file) => file.isImage()).map((file) => file.toObject())
        if (!items.length) {
          throw new Error('No Images')
        }
        commit('setError', { error: null })
        commit('setItems', { items })
        commit('setFilepath', { filepath: filepath || items[0].path })
      } catch (e) {
        const error = e.message === 'No Images' ? e : new Error('Invalid Image')
        commit('setError', { error })
        commit('setItems', { items: [] })
        commit('setFilepath', { filepath: null })
      }
    },
    movePrevious ({ commit, getters, state }) {
      let index = getters.currentIndex - 1
      if (index < 0) {
        index = state.items.length - 1
      }
      const filepath = state.items[index].path
      commit('setFilepath', { filepath })
    },
    moveNext ({ commit, getters, state }) {
      let index = getters.currentIndex + 1
      if (index > state.items.length - 1) {
        index = 0
      }
      const filepath = state.items[index].path
      commit('setFilepath', { filepath })
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
    setItems (state, { items }) {
      state.items = items
    },
    setFilepath (state, { filepath }) {
      state.filepath = filepath
    },
    setCurrentIndex (state, { currentIndex }) {
      state.filepath = state.items[currentIndex].path
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
      return state.items.findIndex((file) => state.filepath === file.path)
    }
  }
}
