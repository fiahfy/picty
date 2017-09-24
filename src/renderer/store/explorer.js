import fs from 'fs'
import path from 'path'
import { remote, shell } from 'electron'
import { listFiles } from '../utils/file'

const orderDefaults = {
  name: 'asc',
  date_modified: 'desc'
}

let watcher = null

export default {
  namespaced: true,
  state: {
    error: null,
    directory: remote.app.getPath('home'),
    directoryInput: '',
    histories: [],
    historyIndex: -1,
    files: [],
    selectedFile: null,
    sortKey: 'name',
    sortOrder: 'asc'
  },
  actions: {
    loadDirectory ({ commit, dispatch }, dir) {
      if (watcher) {
        watcher.close()
      }
      watcher = fs.watch(dir, () => {
        dispatch('refreshDirectory')
      })
      commit('setDirectory', dir)
      commit('setDirectoryInput', dir)
      try {
        const files = listFiles(dir)
        commit('setError', null)
        commit('setFiles', files)
      } catch (e) {
        commit('setError', new Error('Invalid Directory'))
        commit('setFiles', [])
      }
      commit('setSelectedFile', null)
      dispatch('sortFiles')
    },
    initDirectory ({ commit, dispatch, state }) {
      commit('setHistories', [state.directory])
      commit('setHistoryIndex', 0)
      dispatch('loadDirectory', state.directory)
    },
    changeDirectory ({ commit, dispatch, state }, dir) {
      const index = state.historyIndex + 1
      const histories = [...state.histories.slice(0, index), dir]
      commit('setHistories', histories)
      commit('setHistoryIndex', index)
      dispatch('loadDirectory', dir)
    },
    changeChildDirectory ({ dispatch, state }, dirname) {
      const child = path.join(state.directory, dirname)
      dispatch('changeDirectory', child)
    },
    changeParentDirectory ({ dispatch, state }) {
      const parent = path.dirname(state.directory)
      dispatch('changeDirectory', parent)
    },
    refreshDirectory ({ dispatch, state }) {
      dispatch('loadDirectory', state.directory)
    },
    backDirectory ({ commit, dispatch, state }) {
      const index = state.historyIndex - 1
      const file = state.histories[index]
      commit('setHistoryIndex', index)
      dispatch('loadDirectory', file)
    },
    forwardDirectory ({ commit, dispatch, state }) {
      const index = state.historyIndex + 1
      const file = state.histories[index]
      commit('setHistoryIndex', index)
      dispatch('loadDirectory', file)
    },
    changeSortKey ({ commit, dispatch, state }, sortKey) {
      let sortOrder = orderDefaults[sortKey]
      if (state.sortKey === sortKey) {
        sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      commit('setSortKey', sortKey)
      commit('setSortOrder', sortOrder)
      dispatch('sortFiles')
    },
    sortFiles ({ commit, state }) {
      const files = state.files.concat().sort((a, b) => {
        let result = true
        if (state.sortKey === 'date_modified') {
          result = a.stats.mtime > b.stats.mtime
        } else {
          result = a.name > b.name
        }
        result = state.sortOrder === 'asc' ? result : !result
        return result ? 1 : -1
      })
      commit('setFiles', files)
    },
    selectFile ({ commit, state }, file) {
      commit('setSelectedFile', file)
    },
    selectPreviousFile ({ commit, getters, state }) {
      let index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      commit('setSelectedFile', state.files[index])
    },
    selectNextFile ({ commit, getters, state }) {
      let index = getters.selectedIndex + 1
      if (index > state.files.length - 1) {
        return
      }
      commit('setSelectedFile', state.files[index])
    },
    openDirectory ({ dispatch, state }) {
      const result = shell.openItem(state.directory)
      if (!result) {
        dispatch('showMessage', `Invalid directory "${state.directory}"`, { root: true })
      }
    }
  },
  mutations: {
    setError (state, error) {
      state.error = error
    },
    setDirectory (state, directory) {
      state.directory = directory
    },
    setDirectoryInput (state, directory) {
      state.directoryInput = directory
    },
    setHistories (state, histories) {
      state.histories = histories
    },
    setHistoryIndex (state, index) {
      state.historyIndex = index
    },
    setFiles (state, files) {
      state.files = files
    },
    setSelectedFile (state, file) {
      state.selectedFile = file
    },
    setSortKey (state, sortKey) {
      state.sortKey = sortKey
    },
    setSortOrder (state, sortOrder) {
      state.sortOrder = sortOrder
    }
  },
  getters: {
    selectedIndex (state) {
      return state.files.findIndex((file) => {
        return state.selectedFile && file.path === state.selectedFile.path
      })
    },
    canBackDirectory (state) {
      return Boolean(state.histories[state.historyIndex - 1])
    },
    canForwardDirectory (state) {
      return Boolean(state.histories[state.historyIndex + 1])
    }
  }
}
