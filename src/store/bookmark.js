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
    toggleBookmarked ({ commit, getters }, { filepath }) {
      if (getters.isBookmarked({ filepath })) {
        commit('removeBookmark', { filepath })
      } else {
        commit('addBookmark', { filepath })
      }
    }
  },
  mutations: {
    addBookmark (state, { filepath }) {
      state.bookmarks = {
        ...state.bookmarks,
        [filepath]: {
          added_at: new Date()
        }
      }
    },
    removeBookmark (state, { filepath }) {
      state.bookmarks = Object.keys(state.bookmarks)
        .filter((key) => key !== filepath)
        .reduce((carry, key) => {
          carry[key] = state.bookmarks[key]
          return carry
        }, {})
    }
  }
}
