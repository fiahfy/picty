import File from '../utils/file'

const sortOrderDefaults = {
  name: 'asc',
  size: 'asc',
  date_modified: 'desc'
}

export default {
  namespaced: true,
  state: {
    files: [],
    bookmarks: [],
    query: '',
    selectedBookmark: null,
    scrollTop: 0,
    sortOption: {
      key: 'name',
      order: 'asc'
    }
  },
  actions: {
    bookmark ({ commit, dispatch, getters, state }, { filepath }) {
      if (!filepath || getters.isBookmarked({ filepath })) {
        return
      }
      const bookmarks = [
        ...state.bookmarks,
        filepath
      ]
      commit('setBookmarks', { bookmarks })
      dispatch('load')
    },
    deleteBookmark ({ commit, dispatch, state }, { filepath }) {
      const bookmarks = state.bookmarks.filter((bookmark) => {
        return bookmark !== filepath
      })
      commit('setBookmarks', { bookmarks })
      dispatch('load')
    },
    toggleBookmark ({ dispatch, getters }, { filepath }) {
      if (getters.isBookmarked({ filepath })) {
        dispatch('deleteBookmark', { filepath })
      } else {
        dispatch('bookmark', { filepath })
      }
    },
    load ({ commit, dispatch, state }) {
      const files = state.bookmarks.map((bookmark) => (new File(bookmark).toObject()))
      commit('setFiles', { files })
      dispatch('sort')
      dispatch('focusBookmarkList', null, { root: true })
    },
    select ({ commit }, { filepath }) {
      commit('setSelectedBookmark', { selectedBookmark: filepath })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      if (index < 0 || index > getters.filteredFiles.length - 1) {
        return
      }
      const filepath = getters.filteredFiles[index].path
      dispatch('select', { filepath })
    },
    selectFirst ({ dispatch }) {
      dispatch('selectIndex', { index: 0 })
    },
    selectLast ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.filteredFiles.length - 1 })
    },
    selectPrevious ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex - 1 })
    },
    selectNext ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex + 1 })
    },
    search ({ commit }, { query }) {
      commit('setQuery', { query })
    },
    changeSortKey ({ commit, dispatch, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (state.sortOption.key === sortKey) {
        sortOrder = state.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption })
      dispatch('sort')
    },
    sort ({ commit, getters, state }) {
      const files = state.files.sort((a, b) => {
        let result = 0
        switch (state.sortOption.key) {
          case 'date_modified':
            if (a.mtime > b.mtime) {
              result = 1
            } else if (a.mtime < b.mtime) {
              result = -1
            }
            break
          case 'size':
            const size = (file) => file.directory ? -1 : file.size
            if (size(a) > size(b)) {
              result = 1
            } else if (size(a) < size(b)) {
              result = -1
            }
            break
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        return state.sortOption.order === 'asc' ? result : -1 * result
      })
      commit('setFiles', { files })
    },
    action ({ commit, dispatch, state }, { filepath }) {
      const file = new File(filepath)
      if (!file.exists()) {
        return
      }
      if (file.isDirectory()) {
        dispatch('explorer/changeDirectory', { dirpath: file.path }, { root: true })
        dispatch('changeRoute', { name: 'explorer' }, { root: true })
      } else {
        dispatch('showViewer', { filepath: file.path })
      }
    },
    showViewer ({ dispatch }, { filepath }) {
      const file = new File(filepath)
      if (file.isDirectory()) {
        const filepathes = File.listFiles(filepath, { recursive: true }).map(file => file.path)
        dispatch('viewer/show', { filepathes }, { root: true })
      } else {
        dispatch('viewer/show', { filepathes: [filepath] }, { root: true })
      }
    }
  },
  mutations: {
    setFiles (state, { files }) {
      state.files = files
    },
    setBookmarks (state, { bookmarks }) {
      state.bookmarks = bookmarks
    },
    setQuery (state, { query }) {
      state.query = query
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
    filteredFiles (state) {
      return state.files.concat().filter((file) => {
        return file.name.toLowerCase().indexOf(state.query.toLowerCase()) > -1
      })
    },
    selectedIndex (state, getters) {
      return getters.filteredFiles.findIndex((file) => {
        return getters.isSelected({ filepath: file.path })
      })
    },
    isSelected (state) {
      return ({ filepath }) => {
        return state.selectedBookmark === filepath
      }
    },
    isBookmarked (state) {
      return ({ filepath }) => {
        return state.bookmarks.indexOf(filepath) > -1
      }
    }
  }
}
