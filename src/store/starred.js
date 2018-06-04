import { Selector } from '~/store'
import File from '~/utils/file'

const reversed = {
  name: false,
  size: false,
  mtime: true
}

export default {
  namespaced: true,
  state: {
    items: [],
    query: '',
    queryInput: '',
    filepath: '',
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    }
  },
  getters: {
    filteredItems (state) {
      return state.items.concat().filter((file) => {
        return !state.query || file.name.toLowerCase().indexOf(state.query.toLowerCase()) > -1
      })
    },
    selectedIndex (state, getters) {
      return getters.filteredItems.findIndex((file) => getters.isSelected({ filepath: file.path }))
    },
    isSelected (state) {
      return ({ filepath }) => state.filepath === filepath
    },
    isStarred (state, getters, rootState, rootGetters) {
      return ({ filepath }) => rootGetters['bookmark/isBookmarked']({ filepath })
    }
  },
  actions: {
    initialize ({ dispatch }) {
      dispatch('load')
    },
    load ({ commit, dispatch, rootState }) {
      const items = rootState.bookmark.bookmarks.map((bookmark) => new File(bookmark).toObject())
      commit('setItems', { items })
      dispatch('sort')
      dispatch('focus', { selector: Selector.starredTable }, { root: true })
    },
    sort ({ commit, getters, state }) {
      const { by, descending } = state.order
      const items = state.items.sort((a, b) => {
        let result = 0
        if (a[by] > b[by]) {
          result = 1
        } else if (a[by] < b[by]) {
          result = -1
        }
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        result = reversed[by] ? -1 * result : result
        return descending ? -1 * result : result
      })
      commit('setItems', { items })
    },
    select ({ commit }, { filepath }) {
      commit('setFilepath', { filepath })
    },
    selectIndex ({ dispatch, getters }, { index }) {
      const item = getters.filteredItems[index]
      if (item) {
        dispatch('select', { filepath: item.filepath })
      }
    },
    selectFirst ({ dispatch }) {
      dispatch('selectIndex', { index: 0 })
    },
    selectLast ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.filteredItems.length - 1 })
    },
    selectPrevious ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex - 1 })
    },
    selectNext ({ dispatch, getters }) {
      dispatch('selectIndex', { index: getters.selectedIndex + 1 })
    },
    search ({ commit, state }, { query }) {
      commit('setQueryInput', { queryInput: query })
      commit('setQuery', { query })
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sort')
    },
    action ({ commit, dispatch, state }, { filepath }) {
      const file = new File(filepath)
      if (!file.exists()) {
        dispatch('showMessage', { message: `Not found` }, { root: true })
        return
      }
      if (file.isDirectory()) {
        dispatch('showDirectory', { dirpath: file.path }, { root: true })
      } else {
        dispatch('showViewer', { filepath: file.path })
      }
    },
    showViewer ({ dispatch }, { filepath }) {
      const file = new File(filepath)
      if (file.isDirectory()) {
        const filepathes = File.listFiles(filepath, { recursive: true }).map(file => file.path)
        dispatch('showViewer', { filepathes }, { root: true })
      } else {
        dispatch('showViewer', { filepathes: [filepath] }, { root: true })
      }
    },
    toggleStarred ({ dispatch }, { filepath }) {
      dispatch('bookmark/toggle', { filepath }, { root: true })
    }
  },
  mutations: {
    setItems (state, { items }) {
      state.items = items
    },
    setQuery (state, { query }) {
      state.query = query
    },
    setQueryInput (state, { queryInput }) {
      state.queryInput = queryInput
    },
    setFilepath (state, { filepath }) {
      state.filepath = filepath
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setOrder (state, { order }) {
      state.order = order
    }
  }
}
