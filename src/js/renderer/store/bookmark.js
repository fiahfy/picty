export default {
  namespaced: true,
  state: {
    bookmarks: []
  },
  actions: {
    add ({ commit, state }, { filepath }) {
      if (state.bookmarks.includes(filepath)) {
        return
      }
      const bookmarks = [
        ...state.bookmarks,
        filepath
      ]
      commit('setBookmarks', { bookmarks })
    },
    remove ({ commit, state }, { filepath }) {
      const bookmarks = state.bookmarks.filter((bookmark) => bookmark !== filepath)
      commit('setBookmarks', { bookmarks })
    },
    toggle ({ dispatch, state }, { filepath }) {
      if (state.bookmarks.includes(filepath)) {
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
  },
  getters: {
    isBookmarked (state) {
      return ({ filepath }) => {
        return state.bookmarks.includes(filepath)
      }
    }
  }
}
