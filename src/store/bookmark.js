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
    addBookmark ({ commit, state }, { filepath }) {
      const bookmarks = {
        ...state.bookmarks,
        [filepath]: {
          added_at: new Date()
        }
      }
      commit('setBookmarks', { bookmarks })
    },
    removeBookmark ({ commit, state }, { filepath }) {
      const bookmarks = Object.keys(state.bookmarks)
        .filter((key) => key !== filepath)
        .reduce((carry, key) => {
          carry[key] = state.bookmarks[key]
          return carry
        }, {})
      commit('setBookmarks', { bookmarks })
    },
    toggleBookmarked ({ dispatch, getters }, { filepath }) {
      if (getters.isBookmarked({ filepath })) {
        dispatch('removeBookmark', { filepath })
      } else {
        dispatch('addBookmark', { filepath })
      }
    }
  },
  mutations: {
    setBookmarks (state, { bookmarks }) {
      state.bookmarks = bookmarks
    }
  }
}
