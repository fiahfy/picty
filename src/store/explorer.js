import fs from 'fs'
import { remote, shell } from 'electron'
import { Selector } from '~/store'
import * as File from '~/utils/file'

const reversed = {
  name: false,
  size: false,
  mtime: true
}

let watcher = null

export default {
  namespaced: true,
  state: {
    files: [],
    directoryInput: '',
    query: '',
    queryInput: '',
    filepath: '',
    histories: [],
    historyIndex: -1,
    orders: {}
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
    scrollTop (state) {
      return state.histories[state.historyIndex].scrollTop
    },
    order (state, getters, rootState) {
      return state.orders[rootState.directory] || {
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
      return getters.filteredFiles.findIndex((file) => getters.isSelectedFile({ filepath: file.path }))
    },
    isSelectedFile (state) {
      return ({ filepath }) => state.filepath === filepath
    },
    isStarredFile (state, getters, rootState, rootGetters) {
      return ({ filepath }) => rootGetters['bookmark/isBookmarked']({ filepath })
    }
  },
  actions: {
    initialize ({ dispatch, rootState }) {
      const dirpath = rootState.directory
      dispatch('changeDirectory', { dirpath, force: true })
    },
    upDirectory ({ dispatch, rootState }) {
      const dirpath = File.get(rootState.directory).dirname
      dispatch('changeDirectory', { dirpath })
    },
    changeHomeDirectory ({ dispatch }) {
      const dirpath = remote.app.getPath('home')
      dispatch('changeDirectory', { dirpath })
    },
    changeSelectedDirectory ({ dispatch, state }) {
      if (state.filepath && File.get(state.filepath).directory) {
        const dirpath = state.filepath
        dispatch('changeDirectory', { dirpath })
      }
    },
    changeDirectory ({ commit, dispatch, state, rootState }, { dirpath, force = false }) {
      if (dirpath === rootState.directory && !force) {
        return
      }
      const historyIndex = state.historyIndex + 1
      const histories = [...state.histories.slice(0, historyIndex), {
        directory: dirpath,
        scrollTop: 0
      }]
      commit('setFilepath', { filepath: '' })
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
      const history = state.histories[historyIndex]
      commit('setHistoryIndex', { historyIndex })

      commit('setDirectory', { directory: history.directory }, { root: true })
      commit('setDirectoryInput', { directoryInput: history.directory })
      commit('setQuery', { query: '' })

      dispatch('loadFiles')
    },
    openDirectory ({ dispatch, rootState }) {
      const result = shell.openItem(rootState.directory)
      if (!result) {
        dispatch('showMessage', { message: `Invalid directory` }, { root: true })
      }
    },
    loadFiles ({ commit, dispatch, rootGetters, rootState }) {
      try {
        if (watcher) {
          watcher.close()
        }
        watcher = fs.watch(rootState.directory, () => {
          dispatch('loadFiles')
        })
        const files = File.listFiles(rootState.directory)
          .filter((file) => file.directory || rootGetters['settings/isAllowedFile']({ filepath: file.path }))
        commit('setFiles', { files })
      } catch (e) {
        commit('setFiles', { files: [] })
      }
      dispatch('sortFiles')
      dispatch('focus', { selector: Selector.explorerTable }, { root: true })
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
      commit('setFilepath', { filepath })
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
    selectNextFile ({ dispatch, getters, state }) {
      dispatch('selectFileIndex', { index: getters.selectedFileIndex + 1 })
    },
    search ({ commit, state }, { query }) {
      commit('setQueryInput', { queryInput: query })
      commit('setQuery', { query })
    },
    setScrollTop ({ commit, state }, { scrollTop }) {
      const history = {
        ...state.histories[state.historyIndex],
        scrollTop
      }
      commit('setHistory', { history, index: state.historyIndex })
    },
    changeOrderBy ({ commit, dispatch, getters, rootState }, { orderBy }) {
      const descending = getters.order.by === orderBy ? !getters.order.descending : false
      const order = { by: orderBy, descending }
      commit('setOrder', { order, directory: rootState.directory })
      dispatch('sortFiles')
    },
    action ({ commit, dispatch, state }, { filepath }) {
      const file = File.get(filepath)
      if (file.directory) {
        dispatch('changeDirectory', { dirpath: file.path })
      } else {
        dispatch('showViewer', { filepath: file.path })
      }
    },
    showViewer ({ dispatch }, { filepath }) {
      const file = File.get(filepath)
      if (file.directory) {
        const filepathes = File.listFiles(filepath, { recursive: true }).map(file => file.path)
        dispatch('showViewer', { filepathes }, { root: true })
      } else {
        const filepathes = File.listFiles(file.dirname).map(file => file.path)
        dispatch('showViewer', { filepathes, filepath }, { root: true })
      }
    },
    toggleStarred ({ dispatch }, { filepath }) {
      dispatch('bookmark/toggle', { filepath }, { root: true })
    }
  },
  mutations: {
    setFiles (state, { files }) {
      state.files = files
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
    setFilepath (state, { filepath }) {
      state.filepath = filepath
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
    }
  }
}
