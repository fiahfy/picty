import { Selector } from '~/store'
import * as File from '~/utils/file'
import * as Worker from '~/utils/worker'
import FileWorker from '~/workers/file.worker.js'

const reversed = {
  name: false,
  dirname: false,
  size: false,
  mtime: true
}

export default {
  namespaced: true,
  state: {
    loading: false,
    files: [],
    selectedFilepath: '',
    query: '',
    queryInput: '',
    scrollTop: 0,
    order: {
      by: 'name',
      descending: false
    }
  },
  getters: {
    filteredFiles (state) {
      return state.files.concat().filter((file) => {
        return !state.query || file.name.toLowerCase().indexOf(state.query.toLowerCase()) > -1
      })
    },
    selectedFileIndex (state, getters) {
      return getters.filteredFiles.findIndex((file) => getters.isSelectedFile({ filepath: file.path }))
    },
    isSelectedFile (state) {
      return ({ filepath }) => state.selectedFilepath === filepath
    },
    isStarredFile (state, getters, rootState, rootGetters) {
      return ({ filepath }) => rootGetters['bookmark/isBookmarked']({ filepath })
    }
  },
  actions: {
    initialize ({ dispatch }) {
      dispatch('loadFiles')
    },
    async loadFiles ({ commit, dispatch, rootState, state }) {
      if (state.loading) {
        return
      }
      commit('setLoading', { loading: true })
      const files = await Worker.post(FileWorker, { id: 'getFiles', data: [rootState.bookmark.bookmarks] })
      commit('setFiles', { files })
      dispatch('sortFiles')
      dispatch('focusTable')
      commit('setLoading', { loading: false })
    },
    sortFiles ({ commit, getters, state }) {
      const { by, descending } = state.order
      const files = state.files.sort((a, b) => {
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
      commit('setFiles', { files })
    },
    selectFile ({ commit }, { filepath }) {
      commit('setSelectedFilepath', { selectedFilepath: filepath })
    },
    selectFileIndex ({ dispatch, getters }, { index }) {
      const file = getters.filteredFiles[index]
      if (file) {
        dispatch('selectFile', { filepath: file.path })
      }
    },
    selectFirstFile ({ dispatch }) {
      dispatch('selectFileIndex', { index: 0 })
    },
    selectLastFile ({ dispatch, getters }) {
      dispatch('selectFileIndex', { index: getters.filteredFiles.length - 1 })
    },
    selectPreviousFile ({ dispatch, getters }) {
      dispatch('selectFileIndex', { index: getters.selectedFileIndex - 1 })
    },
    selectNextFile ({ dispatch, getters }) {
      dispatch('selectFileIndex', { index: getters.selectedFileIndex + 1 })
    },
    searchFiles ({ commit, state }, { query }) {
      commit('setQueryInput', { queryInput: query })
      commit('setQuery', { query })
    },
    openFile ({ commit, dispatch, state }, { filepath }) {
      const file = File.get(filepath)
      if (!file.exists) {
        dispatch('showMessage', { color: 'error', text: 'Not found' }, { root: true })
        return
      }
      if (file.directory) {
        dispatch('openDirectory', { dirpath: file.path }, { root: true })
      } else {
        dispatch('viewFile', { filepath: file.path })
      }
    },
    viewFile ({ dispatch }, { filepath }) {
      const file = File.get(filepath)
      if (!file.exists) {
        dispatch('showMessage', { color: 'error', text: 'Not found' }, { root: true })
        return
      }
      if (file.directory) {
        const filepathes = File.listFiles(filepath, { recursive: true }).map(file => file.path)
        dispatch('showViewer', { filepathes }, { root: true })
      } else {
        dispatch('showViewer', { filepathes: [filepath] }, { root: true })
      }
    },
    changeOrderBy ({ commit, dispatch, state }, { orderBy }) {
      const descending = state.order.by === orderBy ? !state.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order })
      dispatch('sortFiles')
    },
    toggleFileStarred ({ dispatch }, { filepath }) {
      dispatch('bookmark/toggle', { filepath }, { root: true })
    },
    focusTable ({ dispatch }) {
      dispatch('focus', { selector: Selector.starredTable }, { root: true })
    }
  },
  mutations: {
    setLoading (state, { loading }) {
      state.loading = loading
    },
    setFiles (state, { files }) {
      state.files = files
    },
    setSelectedFilepath (state, { selectedFilepath }) {
      state.selectedFilepath = selectedFilepath
    },
    setQuery (state, { query }) {
      state.query = query
    },
    setQueryInput (state, { queryInput }) {
      state.queryInput = queryInput
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setOrder (state, { order }) {
      state.order = order
    }
  }
}
