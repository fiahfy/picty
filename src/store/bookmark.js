export default {
  namespaced: true,
  state: {
    bookmarks: {}
  },
  getters: {
    isBookmarked (state) {
      return ({ filepath }) => !!state.bookmarks[filepath]
    }
  },
  actions: {
    add ({ commit, state }, { filepath }) {
      const bookmarks = {
        ...state.bookmarks,
        [filepath]: new Date()
      }
      commit('setBookmarks', { bookmarks })
    },
    remove ({ commit, state }, { filepath }) {
      const bookmarks = Object.keys(state.bookmarks)
        .filter((key) => key !== filepath)
        .reduce((carry, key) => {
          carry[key] = state.bookmarks[key]
          return carry
        }, {})
      commit('setBookmarks', { bookmarks })
    },
    toggle ({ dispatch, getters }, { filepath }) {
      if (getters.isBookmarked({ filepath })) {
        dispatch('remove', { filepath })
      } else {
        dispatch('add', { filepath })
      }
    }
  },
  mutations: {
    setBookmarks (state, { bookmarks }) {
      state.bookmarks = bookmarks
    }
  }
}
