import File from '../utils/file'

const sortOrderDefaults = {
  name: 'asc',
  size: 'asc',
  date_modified: 'desc'
}

export default {
  namespaced: true,
  state: {
    bookmarks: [],
    selectedBookmark: null,
    scrollTop: 0,
    sortOption: {
      key: 'name',
      order: 'asc'
    }
  },
  actions: {
    addSelectedFileToBookmark ({ commit, rootState }) {
      if (rootState.explorer.selectedFile) {
        const filepath = rootState.explorer.selectedFile.path
        commit('addBookmark', { filepath })
      }
    },
    removeBookmark () {

    },
    selectBookmark ({ commit }, { filepath }) {
      commit('setSelectedBookmark', { selectedBookmark: filepath })
    },
    selectPreviousBookmark ({ commit, getters, state }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const selectedBookmark = getters.files[index]
      commit('setSelectedBookmark', { selectedBookmark })
    },
    selectNextBookmark ({ commit, getters, state }) {
      const index = getters.selectedIndex + 1
      if (index > getters.files.length - 1) {
        return
      }
      const selectedBookmark = getters.files[index]
      commit('setSelectedBookmark', { selectedBookmark })
    },
    changeSortKey ({ commit, dispatch, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.sortOption.key === sortKey) {
        sortOrder = state.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption })
      dispatch('sortBookmarks')
    },
    sortBookmarks ({ commit, getters, state }) {
      const bookmarks = getters.files.sort((a, b) => {
        let result = 0
        if (a.exists() && b.exists()) {
          switch (state.sortOption.key) {
            case 'date_modified':
              if (a.mtime > b.mtime) {
                result = 1
              } else if (a.mtime < b.mtime) {
                result = -1
              }
              break
            case 'size':
              const size = (file) => {
                if (file.isDirectory()) {
                  return -1
                }
                return file.size
              }
              if (size(a) > size(b)) {
                result = 1
              } else if (size(a) < size(b)) {
                result = -1
              }
              break
          }
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        return state.sortOption.order === 'asc' ? result : -1 * result
      }).map((file) => file.path)
      commit('setBookmarks', { bookmarks })
    }
  },
  mutations: {
    setBookmarks (state, { bookmarks }) {
      state.bookmarks = bookmarks
    },
    addBookmark (state, { filepath }) {
      state.bookmarks = [
        ...state.bookmarks,
        filepath
      ]
    },
    removeBookmark (state, { filepath }) {
      state.bookmarks = state.bookmarks.filter((bookmark) => {
        return bookmark !== filepath
      })
    },
    setSelectedBookmark (state, { selectedBookmark }) {
      state.selectedBookmark = selectedBookmark
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setSortOption (state, { sortOption }) {
      state.sortOption = sortOption
    }
  },
  getters: {
    files (state) {
      return state.bookmarks.map((bookmark) => new File(bookmark))
    },
    selectedIndex (state, getters) {
      return getters.files.findIndex((file) => {
        return getters.isSelectedBookmark({ filepath: file.path })
      })
    },
    isSelectedBookmark (state) {
      return ({ filepath }) => {
        return state.selectedBookmark === filepath
      }
    }
  }
}
