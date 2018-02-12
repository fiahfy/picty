import fs from 'fs'
import { remote, shell } from 'electron'
import File from '../utils/file'

const sortOrderDefaults = {
  name: 'asc',
  size: 'asc',
  date_modified: 'desc'
}

let watcher = null

export default {
  namespaced: true,
  state: {
    error: null,
    files: [],
    selectedFile: null,
    histories: [],
    historyIndex: -1,
    directory: remote.app.getPath('home'),
    directoryInput: '',
    query: '',
    sortOptions: {}
  },
  actions: {
    initDirectory ({ dispatch, state }) {
      const dirpath = state.directory
      dispatch('changeDirectory', { dirpath, force: true })
    },
    changeParentDirectory ({ dispatch, state }) {
      const dirpath = (new File(state.directory)).parent.path
      dispatch('changeDirectory', { dirpath })
    },
    changeHomeDirectory ({ dispatch, state }) {
      const dirpath = remote.app.getPath('home')
      dispatch('changeDirectory', { dirpath })
    },
    changeSelectedDirectory ({ dispatch, state }) {
      if (state.selectedFile && state.selectedFile.isDirectory()) {
        const dirpath = state.selectedFile.path
        dispatch('changeDirectory', { dirpath })
      }
    },
    changeDirectory ({ commit, dispatch, state }, { dirpath, force = false }) {
      if (dirpath === state.directory && !force) {
        return
      }
      const historyIndex = state.historyIndex + 1
      const histories = [...state.histories.slice(0, historyIndex), {
        directory: dirpath,
        scrollTop: 0
      }]
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
    restoreDirectory ({ commit, dispatch, state }, { historyIndex }) {
      const history = state.histories[historyIndex]
      commit('setHistoryIndex', { historyIndex })

      commit('setDirectory', { directory: history.directory })
      commit('setDirectoryInput', { directoryInput: history.directory })
      commit('setSelectedFile', { selectedFile: null })
      commit('setQuery', { query: '' })

      dispatch('loadDirectory')
    },
    loadDirectory ({ commit, dispatch, state }) {
      try {
        if (watcher) {
          watcher.close()
        }
        watcher = fs.watch(state.directory, () => {
          dispatch('loadDirectory')
        })
        const files = File.listFiles(state.directory).filter((file) => file.isDirectory() || file.isImage())
        if (!files.length) {
          throw new Error('No Images')
        }
        commit('setError', { error: null })
        commit('setFiles', { files })
      } catch (e) {
        const error = e.message === 'No Images' ? e : new Error('Invalid Directory')
        commit('setError', { error })
        commit('setFiles', { files: [] })
      }
      dispatch('sortFiles')
      dispatch('focus', { selector: '.explorer-list table' }, { root: true })
    },
    openDirectory ({ dispatch, state }) {
      const result = shell.openItem(state.directory)
      if (!result) {
        dispatch('showMessage', { message: `Invalid directory "${state.directory}"` }, { root: true })
      }
    },
    selectFile ({ commit }, { filepath }) {
      const file = new File(filepath)
      commit('setSelectedFile', { selectedFile: file })
    },
    selectPreviousFile ({ commit, getters, state }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const selectedFile = getters.filteredFiles[index]
      commit('setSelectedFile', { selectedFile })
    },
    selectNextFile ({ commit, getters, state }) {
      const index = getters.selectedIndex + 1
      if (index > getters.filteredFiles.length - 1) {
        return
      }
      const selectedFile = getters.filteredFiles[index]
      commit('setSelectedFile', { selectedFile })
    },
    search ({ commit }, { query }) {
      commit('setQuery', { query })
    },
    setScrollTop ({ commit, state }, { scrollTop }) {
      const history = {
        ...state.histories[state.historyIndex],
        scrollTop
      }
      commit('setHistory', { history, index: state.historyIndex })
    },
    changeSortKey ({ commit, dispatch, getters, state }, { sortKey }) {
      let sortOrder = sortOrderDefaults[sortKey]
      if (getters.sortOption.key === sortKey) {
        sortOrder = getters.sortOption.order === 'asc' ? 'desc' : 'asc'
      }
      const sortOption = { key: sortKey, order: sortOrder }
      commit('setSortOption', { sortOption, key: state.directory })
      dispatch('sortFiles')
    },
    sortFiles ({ commit, getters, state }) {
      const files = state.files.concat().sort((a, b) => {
        let result = 0
        switch (getters.sortOption.key) {
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
        if (result === 0) {
          if (a.name > b.name) {
            result = 1
          } else if (a.name < b.name) {
            result = -1
          }
        }
        return getters.sortOption.order === 'asc' ? result : -1 * result
      })
      commit('setFiles', { files })
    },
    action ({ commit, dispatch, state }, { filepath }) {
      const file = new File(filepath)
      if (file.isDirectory()) {
        dispatch('changeDirectory', { dirpath: file.path })
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
        const filepathes = File.listFiles(file.parent.path).map(file => file.path)
        dispatch('viewer/show', { filepathes, currentFilepath: filepath }, { root: true })
      }
    }
  },
  mutations: {
    setError (state, { error }) {
      state.error = error
    },
    setFiles (state, { files }) {
      state.files = files
    },
    setSelectedFile (state, { selectedFile }) {
      state.selectedFile = selectedFile
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
    setDirectory (state, { directory }) {
      state.directory = directory
    },
    setDirectoryInput (state, { directoryInput }) {
      state.directoryInput = directoryInput
    },
    setQuery (state, { query }) {
      state.query = query
    },
    setSortOption (state, { sortOption, key }) {
      state.sortOptions = {
        ...state.sortOptions,
        [key]: sortOption
      }
    }
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
    sortOption (state) {
      return state.sortOptions[state.directory] || {
        key: 'name',
        order: 'asc'
      }
    },
    filteredFiles (state) {
      return state.files.concat().filter((file) => {
        return file.name.toLowerCase().indexOf(state.query.toLowerCase()) > -1
      })
    },
    selectedFilepath (state) {
      return state.selectedFile ? state.selectedFile.path : null
    },
    selectedIndex (state, getters) {
      return getters.filteredFiles.findIndex((file) => {
        return getters.isSelectedFile({ filepath: file.path })
      })
    },
    isSelectedFile (state, getters) {
      return ({ filepath }) => {
        return getters.selectedFilepath === filepath
      }
    }
  }
}
