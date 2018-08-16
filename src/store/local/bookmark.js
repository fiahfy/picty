const reversed = {
  path: false,
  added_at: true
}

export default {
  namespaced: true,
  state: {
    selectedBookmarkPath: null,
    scrollTop: 0,
    order: {
      by: 'path',
      descending: false
    },
    dialog: false
  },
  getters: {
    bookmarks (state, getters, rootState) {
      const { by, descending } = state.order
      return Object.keys(rootState.bookmark.bookmarks).map((filepath) => {
        return {
          path: filepath,
          ...rootState.bookmark.bookmarks[filepath]
        }
      }).sort((a, b) => {
        let result = 0
        if (a[by] > b[by]) {
          result = 1
        } else if (a[by] < b[by]) {
          result = -1
        }
        if (result === 0) {
          if (a.path > b.path) {
            result = 1
          } else if (a.path < b.path) {
            result = -1
          }
        }
        result = reversed[by] ? -1 * result : result
        return descending ? -1 * result : result
      })
    },
    canRemoveBookmark (state) {
      return !!state.selectedBookmarkPath
    },
    selectedBookmarkIndex (state, getters) {
      return getters.bookmarks.findIndex((bookmark) => getters.isBookmarkSelected({ filepath: bookmark.path }))
    },
    isBookmarkSelected (state) {
      return ({ filepath }) => state.selectedBookmarkPath === filepath
    }
  },
  actions: {
    addBookmark ({ dispatch }, { filepath }) {
      dispatch('bookmark/add', { filepath }, { root: true })
      dispatch('selectBookmark', { filepath })
    },
    removeBookmark ({ dispatch, getters, state }) {
      const oldIndex = getters.selectedBookmarkIndex
      dispatch('bookmark/remove', { filepath: state.selectedBookmarkPath }, { root: true })
      const index = oldIndex < getters.bookmarks.length ? oldIndex : getters.bookmarks.length - 1
      dispatch('selectBookmarkIndex', { index })
    },
    selectBookmark ({ commit }, { filepath }) {
      commit('setSelectedBookmarkPath', { selectedBookmarkPath: filepath })
    },
    unselectBookmark ({ commit }) {
      commit('setSelectedBookmarkPath', { selectedBookmarkPath: null })
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
    },
    changeOrderBy ({ commit, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
    },
    showDialog ({ commit }) {
      commit('setDialog', { dialog: true })
    },
    dismissDialog ({ commit }) {
      commit('setDialog', { dialog: false })
    }
  },
  mutations: {
    setSelectedBookmarkPath (state, { selectedBookmarkPath }) {
      state.selectedBookmarkPath = selectedBookmarkPath
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setOrder (state, { order }) {
      state.order = order
    },
    setDialog (state, { dialog }) {
      state.dialog = dialog
    }
  }
}
