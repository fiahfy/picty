import fs from 'fs'
import path from 'path'
import { remote, shell } from 'electron'
import { getFile, listFiles } from '../utils/file'

const orderDefaults = {
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
    histories: [],
    historyIndex: -1,
    directory: remote.app.getPath('home'),
    directoryInput: '',
    selectedFile: null,
    scrollTop: 0,
    sortKey: 'name',
    sortOrder: 'asc'
  },
  actions: {
    initDirectory ({ dispatch, state }) {
      const directory = state.directory
      dispatch('changeDirectory', { directory })
    },
    changeParentDirectory ({ dispatch, state }) {
      const directory = path.dirname(state.directory)
      dispatch('changeDirectory', { directory })
    },
    changeSelectedDirectory ({ dispatch, state }) {
      if (state.selectedFile && state.selectedFile.stats.isDirectory()) {
        const directory = state.selectedFile.path
        dispatch('changeDirectory', { directory })
      }
    },
    changeHomeDirectory ({ dispatch }) {
      const directory = remote.app.getPath('home')
      dispatch('changeDirectory', { directory })
    },
    changeDirectory ({ commit, dispatch, state }, { directory }) {
      const historyIndex = state.historyIndex + 1
      const history = state.histories[state.historyIndex]
      let histories = []
      if (history) {
        histories = [...state.histories.slice(0, state.historyIndex), {
          ...history,
          selectedFile: state.selectedFile,
          scrollTop: state.scrollTop,
          sortKey: state.sortKey,
          sortOrder: state.sortOrder
        }]
      }
      histories = [...histories, {
        directory,
        selectedFile: null,
        scrollTop: 0,
        sortKey: 'name',
        sortOrder: 'asc'
      }]
      commit('setHistories', { histories })
      commit('setHistoryIndex', { historyIndex })

      dispatch('restoreDirectory', { historyIndex })
    },
    refreshDirectory ({ dispatch, state }) {
      const historyIndex = state.historyIndex
      dispatch('restoreDirectory', { historyIndex })
    },
    backDirectory ({ dispatch, state }) {
      const historyIndex = state.historyIndex - 1
      dispatch('restoreDirectory', { historyIndex })
    },
    forwardDirectory ({ dispatch, state }) {
      const historyIndex = state.historyIndex + 1
      dispatch('restoreDirectory', { historyIndex })
    },
    restoreDirectory ({ commit, dispatch, state }, { historyIndex }) {
      const history = state.histories[historyIndex]
      commit('setHistoryIndex', { historyIndex })

      commit('setDirectory', { directory: history.directory })
      commit('setDirectoryInput', { directoryInput: history.directory })
      commit('setSelectedFile', { selectedFile: history.selectedFile })
      commit('setScrollTop', { scrollTop: history.scrollTop })
      commit('setSortKey', { sortKey: history.sortKey })
      commit('setSortOrder', { sortOrder: history.sortOrder })
      dispatch('loadDirectory')
    },
    loadDirectory ({ commit, dispatch, state }) {
      try {
        if (watcher) {
          watcher.close()
        }
        watcher = fs.watch(state.directory, () => {
          dispatch('refreshDirectory')
        })
        const files = listFiles(state.directory)
        commit('setError', { error: null })
        commit('setFiles', { files })
      } catch (e) {
        commit('setError', { error: new Error('Invalid Directory') })
        commit('setFiles', { files: [] })
      }
      dispatch('sortFiles')
      dispatch('focus', { selector: '.file-list' }, { root: true })
    },
    openDirectory ({ dispatch, state }) {
      const result = shell.openItem(state.directory)
      if (!result) {
        dispatch('showMessage', { message: `Invalid directory "${state.directory}"` }, { root: true })
      }
    },
    selectFile ({ commit }, { file }) {
      commit('setSelectedFile', { selectedFile: file })
    },
    selectPreviousFile ({ commit, getters, state }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const selectedFile = state.files[index]
      commit('setSelectedFile', { selectedFile })
    },
    selectNextFile ({ commit, getters, state }) {
      const index = getters.selectedIndex + 1
      if (index > state.files.length - 1) {
        return
      }
      const selectedFile = state.files[index]
      commit('setSelectedFile', { selectedFile })
    },
    scroll ({ commit }) {
      const node = document.querySelector('.file-list')
      if (node) {
        commit('setScrollTop', { scrollTop: node.scrollTop })
      }
    },
    changeSortKey ({ commit, dispatch, state }, { key }) {
      let order = orderDefaults[key]
      if (state.sortKey === key) {
        order = state.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      commit('setSortKey', { sortKey: key })
      commit('setSortOrder', { sortOrder: order })
      dispatch('sortFiles')
    },
    action ({ dispatch, state }, { filepath }) {
      const file = getFile(filepath)
      if (file.stats.isDirectory()) {
        dispatch('changeDirectory', { directory: filepath })
      } else {
        dispatch('viewer/show', { filepath }, { root: true })
      }
    },
    sortFiles ({ commit, state }) {
      const files = state.files.concat().sort((a, b) => {
        let result = 0
        switch (state.sortKey) {
          case 'date_modified':
            if (a.stats.mtime > b.stats.mtime) {
              result = 1
            } else if (a.stats.mtime < b.stats.mtime) {
              result = -1
            }
            break
          case 'size':
            const size = (file) => {
              if (file.stats.isDirectory()) {
                return -1
              }
              return file.stats.size
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
        return state.sortOrder === 'asc' ? result : -1 * result
      })
      commit('setFiles', { files })
    }
  },
  mutations: {
    setError (state, { error }) {
      state.error = error
    },
    setFiles (state, { files }) {
      state.files = files
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
    setSelectedFile (state, { selectedFile }) {
      state.selectedFile = selectedFile
    },
    setScrollTop (state, { scrollTop }) {
      state.scrollTop = scrollTop
    },
    setSortKey (state, { sortKey }) {
      state.sortKey = sortKey
    },
    setSortOrder (state, { sortOrder }) {
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
      return !!state.histories[state.historyIndex - 1]
    },
    canForwardDirectory (state) {
      return !!state.histories[state.historyIndex + 1]
    }
  }
}
