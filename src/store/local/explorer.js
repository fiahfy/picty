import { remote, shell } from 'electron'
import { Selector } from '~/store'
import * as File from '~/utils/file'
import * as Worker from '~/utils/worker'
import FileWorker from '~/workers/file.worker.js'

const reversed = {
  name: false,
  rating: true,
  views: true,
  modified_at: true
}

const worker = new FileWorker()
const subWorker = new FileWorker()

export default {
  namespaced: true,
  state: {
    directory: remote.app.getPath('home'),
    directoryInput: '',
    query: '',
    queryInput: '',
    display: 'list',
    loading: false,
    files: [],
    selectedFilepath: '',
    histories: [],
    historyIndex: -1,
    orders: {},
    directoryImagePathes: {},
    directoryImageLoading: false
  },
  getters: {
    backDirectories (state) {
      return state.histories.slice(0, state.historyIndex).reverse().map(history => history.directory)
    },
    forwardDirectories (state) {
      return state.histories.slice(state.historyIndex + 1, state.histories.length).map(history => history.directory)
    },
    canBackDirectory (state) {
      return state.historyIndex > 0
    },
    canForwardDirectory (state) {
      return state.historyIndex < state.histories.length - 1
    },
    canViewFile (state) {
      return !!state.selectedFilepath
    },
    directoryBookmarked (state, getters, rootState, rootGetters) {
      return rootGetters['bookmark/isBookmarked']({ filepath: state.directory })
    },
    scrollTop (state) {
      return state.histories[state.historyIndex].scrollTop
    },
    order (state) {
      return state.orders[state.directory] || {
        by: 'name',
        descending: false
      }
    },
    filteredFiles (state) {
      return state.files.concat().filter((file) => {
        return !state.query || file.name.toLowerCase().indexOf(state.query.toLowerCase()) > -1
      })
    },
    selectedFileIndex (state, getters) {
      return getters.filteredFiles.findIndex((file) => getters.isFileSelected({ filepath: file.path }))
    },
    getFile (state) {
      return ({ filepath }) => state.files.find((file) => file.path === filepath)
    },
    isFileSelected (state) {
      return ({ filepath }) => state.selectedFilepath === filepath
    },
    isFileAvailable (state, getters, rootState, rootGetters) {
      return ({ filepath }) => rootGetters['settings/isFileAvailable']({ filepath })
    }
  },
  actions: {
    initialize ({ dispatch, state }) {
      const dirpath = state.directory
      dispatch('changeDirectory', { dirpath, force: true })
    },
    upDirectory ({ dispatch, state }) {
      const dirpath = File.getFile(state.directory).dirname
      dispatch('changeDirectory', { dirpath })
    },
    changeHomeDirectory ({ dispatch }) {
      const dirpath = remote.app.getPath('home')
      dispatch('changeDirectory', { dirpath })
    },
    changeDirectory ({ commit, dispatch, state }, { dirpath, force = false }) {
      if (state.loading) {
        return
      }
      if (dirpath === state.directory && !force) {
        return
      }
      const historyIndex = state.historyIndex + 1
      const histories = [...state.histories.slice(0, historyIndex), {
        directory: dirpath,
        scrollTop: 0
      }]
      commit('setSelectedFilepath', { selectedFilepath: '' })
      commit('setHistories', { histories })
      commit('setHistoryIndex', { historyIndex })

      dispatch('restoreDirectory', { historyIndex })
    },
    backDirectory ({ getters, dispatch, state }, { offset = 0 } = {}) {
      if (!getters.canBackDirectory) {
        return
      }
      const historyIndex = state.historyIndex - 1 - offset
      dispatch('restoreDirectory', { historyIndex })
    },
    forwardDirectory ({ getters, dispatch, state }, { offset = 0 } = {}) {
      if (!getters.canForwardDirectory) {
        return
      }
      const historyIndex = state.historyIndex + 1 + offset
      dispatch('restoreDirectory', { historyIndex })
    },
    reloadDirectory ({ dispatch, state }) {
      dispatch('restoreDirectory', { historyIndex: state.historyIndex })
    },
    restoreDirectory ({ commit, dispatch, state }, { historyIndex }) {
      if (state.loading) {
        return
      }
      const history = state.histories[historyIndex]
      commit('setHistoryIndex', { historyIndex })

      commit('setDirectory', { directory: history.directory })
      commit('setDirectoryInput', { directoryInput: history.directory })
      commit('setQuery', { query: '' })

      dispatch('loadFiles')
    },
    browseDirectory ({ dispatch, state }) {
      const result = shell.openItem(state.directory)
      if (!result) {
        dispatch('showMessage', { color: 'error', text: 'Invalid directory' }, { root: true })
      }
    },
    toggleDirectoryBookmarked ({ dispatch, state }) {
      dispatch('bookmark/toggleBookmarked', { filepath: state.directory }, { root: true })
    },
    async loadFiles ({ commit, dispatch, rootGetters, state }) {
      if (state.loading) {
        return
      }
      commit('setLoading', { loading: true })
      try {
        commit('setFiles', { files: [] })
        let files = await Worker.post(worker, { id: 'listFiles', data: [state.directory] })
        files = files.filter((file) => file.directory || rootGetters['settings/isFileAvailable']({ filepath: file.path }))
          .map((file) => {
            return {
              ...file,
              rating: rootGetters['rating/getRating']({ filepath: file.path }),
              views: rootGetters['views/getViews']({ filepath: file.path })
            }
          })
        commit('setFiles', { files })
      } catch (e) {
        console.error(e)
        commit('setFiles', { files: [] })
      }
      dispatch('sortFiles')
      dispatch('focus')
      commit('setLoading', { loading: false })
    },
    sortFiles ({ commit, getters, state }) {
      const { by, descending } = getters.order
      const files = state.files.concat().sort((a, b) => {
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
    selectLeftFile ({ dispatch, getters }, { offset }) {
      const index = getters.selectedFileIndex - 1
      if (index % offset === offset - 1) {
        return
      }
      dispatch('selectFileIndex', { index })
    },
    selectTopFile ({ dispatch, getters }, { offset }) {
      const index = getters.selectedFileIndex - offset
      if (index < 0) {
        return
      }
      dispatch('selectFileIndex', { index })
    },
    selectRightFile ({ dispatch, getters }, { offset }) {
      const index = getters.selectedFileIndex + 1
      if (index % offset === 0) {
        return
      }
      dispatch('selectFileIndex', { index })
    },
    selectBottomFile ({ dispatch, getters }, { offset }) {
      const index = getters.selectedFileIndex + offset
      if (index > getters.filteredFiles.length - 1) {
        return
      }
      dispatch('selectFileIndex', { index })
    },
    searchFiles ({ commit }, { query }) {
      commit('setQueryInput', { queryInput: query })
      commit('setQuery', { query })
    },
    updateFileRating ({ commit, dispatch, getters, rootGetters }, { filepath, rating }) {
      let file = getters.getFile({ filepath })
      dispatch('rating/setRating', { filepath: file.path, rating }, { root: true })
      file = {
        ...file,
        rating: rootGetters['rating/getRating']({ filepath: file.path })
      }
      commit('setFile', { filepath: file.path, file })
    },
    openFile ({ dispatch, getters }, { filepath }) {
      const file = getters.getFile({ filepath })
      if (file.directory) {
        dispatch('changeDirectory', { dirpath: file.path })
      } else {
        dispatch('viewFile', { filepath: file.path })
      }
    },
    viewFile ({ commit, dispatch, getters, rootGetters }, { filepath }) {
      let file = getters.getFile({ filepath })
      if (file.directory) {
        dispatch('showViewer', { dirpath: file.path }, { root: true })
      } else {
        dispatch('showViewer', { filepath: file.path }, { root: true })
      }
      dispatch('views/incrementViews', { filepath: file.path }, { root: true })
      file = {
        ...file,
        views: rootGetters['views/getViews']({ filepath: file.path })
      }
      commit('setFile', { filepath: file.path, file })
    },
    setScrollTop ({ commit, state }, { scrollTop }) {
      if (state.loading) {
        return
      }
      const history = {
        ...state.histories[state.historyIndex],
        scrollTop
      }
      commit('setHistory', { history, index: state.historyIndex })
    },
    changeOrderBy ({ commit, dispatch, getters, state }, { orderBy }) {
      const descending = getters.order.by === orderBy ? !getters.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order, directory: state.directory })
      dispatch('sortFiles')
    },
    setDisplay ({ commit, dispatch }, { display }) {
      dispatch('setScrollTop', { scrollTop: 0 })
      commit('setDisplay', { display })
      dispatch('focus')
    },
    focus ({ dispatch, state }) {
      const selector = state.display === 'list' ? Selector.explorerTable : Selector.explorerGridList
      dispatch('focus', { selector }, { root: true })
    },
    async requestDirectoryImage ({ commit, dispatch, state }, { filepath }) {
      const directoryImagePath = state.directoryImagePathes[filepath]
      if (directoryImagePath !== undefined) {
        return
      }
      const directoryImagePathes = {
        ...state.directoryImagePathes,
        [filepath]: ''
      }
      commit('setDirectoryImagePathes', { directoryImagePathes })
      if (state.directoryImageLoading) {
        return
      }
      commit('setDirectoryImageLoading', { directoryImageLoading: true })
      await dispatch('loadDirectoryImages')
    },
    async loadDirectoryImages ({ commit, dispatch, rootGetters, state }) {
      const filepathes = Object.keys(state.directoryImagePathes).filter((filepath) => {
        return state.directoryImagePathes[filepath] === ''
      })
      if (!filepathes.length) {
        commit('setDirectoryImageLoading', { directoryImageLoading: false })
        return
      }
      const fileSets = await Worker.post(subWorker, { id: 'listFileSets', data: [filepathes] })
      const directoryImagePathes = Object.keys(fileSets).reduce((carry, filepath) => {
        const file = fileSets[filepath].find((file) => rootGetters['settings/isFileAvailable']({ filepath: file.path }))
        return {
          ...carry,
          [filepath]: file ? file.path : null
        }
      }, state.directoryImagePathes)
      commit('setDirectoryImagePathes', { directoryImagePathes })
      await dispatch('loadDirectoryImages')
    }
  },
  mutations: {
    setDirectory (state, { directory }) {
      state.directory = directory
    },
    setDirectoryInput (state, { directoryInput }) {
      state.directoryInput = directoryInput
    },
    setQuery (state, { query }) {
      state.query = query
    },
    setQueryInput (state, { queryInput }) {
      state.queryInput = queryInput
    },
    setDisplay (state, { display }) {
      state.display = display
    },
    setLoading (state, { loading }) {
      state.loading = loading
    },
    setFiles (state, { files }) {
      state.files = files
    },
    setFile (state, { filepath, file }) {
      state.files = state.files.map((current) => current.path !== filepath ? current : { ...current, ...file })
    },
    setSelectedFilepath (state, { selectedFilepath }) {
      state.selectedFilepath = selectedFilepath
    },
    setHistory (state, { history, index }) {
      state.histories = [
        ...state.histories.slice(0, index),
        history,
        ...state.histories.slice(index + 1, state.histories.length)
      ]
    },
    setHistories (state, { histories }) {
      state.histories = histories
    },
    setHistoryIndex (state, { historyIndex }) {
      state.historyIndex = historyIndex
    },
    setOrder (state, { order, directory }) {
      state.orders = {
        ...state.orders,
        [directory]: order
      }
    },
    setDirectoryImagePathes (state, { directoryImagePathes }) {
      state.directoryImagePathes = directoryImagePathes
    },
    setDirectoryImageLoading (state, { directoryImageLoading }) {
      state.directoryImageLoading = directoryImageLoading
    }
  }
}
