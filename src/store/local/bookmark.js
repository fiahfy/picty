export default {
  namespaced: true,
  state: {
    selectedBookmarkPath: null,
    scrollTop: 0
  },
  getters: {
    bookmarks (state, getters, rootState) {
      return Object.keys(rootState.bookmark.bookmarks).map((filepath) => {
        return {
          path: filepath
        }
      })
    },
    selectedBookmarkIndex (state, getters) {
      return getters.bookmarks.findIndex((bookmark) => getters.isBookmarkSelected({ filepath: bookmark.path }))
    },
    isBookmarkSelected (state) {
      return ({ filepath }) => state.selectedBookmarkPath === filepath
    }
  },
  actions: {
    selectBookmark ({ commit }, { filepath }) {
      commit('setSelectedBookmarkPath', { selectedBookmarkPath: filepath })
    },
    selectBookmarkIndex ({ dispatch, getters }, { index }) {
      const bookmark = getters.bookmarks[index]
      if (bookmark) {
        dispatch('selectBookmark', { filepath: bookmark.path })
      }
    },
    selectFirstBookmark ({ dispatch }) {
      dispatch('selectBookmarkIndex', { index: 0 })
    },
    selectLastBookmark ({ dispatch, getters }) {
      dispatch('selectBookmarkIndex', { index: getters.bookmarks.length - 1 })
    },
    selectPreviousBookmark ({ dispatch, getters }) {
      dispatch('selectBookmarkIndex', { index: getters.selectedBookmarkIndex - 1 })
    },
    selectNextBookmark ({ dispatch, getters }) {
      dispatch('selectBookmarkIndex', { index: getters.selectedBookmarkIndex + 1 })
    },
    openBookmark ({ dispatch }, { filepath }) {
      dispatch('openDirectory', { dirpath: filepath }, { root: true })
    }
  },
  mutations: {
    setSelectedBookmarkPath (state, { selectedBookmarkPath }) {
      state.selectedBookmarkPath = selectedBookmarkPath
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    }
  }
}
