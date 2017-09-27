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
    loadDirectory ({ commit, dispatch }, { dir }) {
      commit('setDirectory', { dir })
      commit('setDirectoryInput', { dir })
      try {
        if (watcher) {
          watcher.close()
        }
        watcher = fs.watch(dir, () => {
          dispatch('refreshDirectory')
        })
        const files = listFiles(dir)
        commit('setError', { error: null })
        commit('setFiles', { files })
      } catch (e) {
        commit('setError', { error: new Error('Invalid Directory') })
        commit('setFiles', { files: [] })
      }
      commit('setSelectedFile', { file: null })
      dispatch('sortFiles')
    },
    changeDirectory ({ commit, dispatch, state }, { dir }) {
      const index = state.historyIndex + 1
      const histories = [...state.histories.slice(0, index), dir]
      commit('setHistories', { histories })
      commit('setHistoryIndex', { index })
      dispatch('loadDirectory', { dir })
    },
    changeParentDirectory ({ dispatch, state }) {
      const dir = path.dirname(state.directory)
      dispatch('changeDirectory', { dir })
    },
    changeSelectedDirectory ({ dispatch, state }) {
      if (state.selectedFile && state.selectedFile.stats.isDirectory()) {
        dispatch('changeDirectory', { dir: state.selectedFile.path })
      }
    },
    changeHomeDirectory ({ dispatch }) {
      dispatch('changeDirectory', { dir: remote.app.getPath('home') })
    },
    initDirectory ({ dispatch, state }) {
      dispatch('changeDirectory', { dir: state.directory })
    },
    refreshDirectory ({ dispatch, state }) {
      dispatch('loadDirectory', { dir: state.directory })
    },
    backDirectory ({ commit, dispatch, state }) {
      const index = state.historyIndex - 1
      const dir = state.histories[index]
      commit('setHistoryIndex', { index })
      dispatch('loadDirectory', { dir })
    },
    forwardDirectory ({ commit, dispatch, state }) {
      const index = state.historyIndex + 1
      const dir = state.histories[index]
      commit('setHistoryIndex', { index })
      dispatch('loadDirectory', { dir })
    },
    openDirectory ({ dispatch, state }) {
      const result = shell.openItem(state.directory)
      if (!result) {
        dispatch('showMessage', { message: `Invalid directory "${state.directory}"` }, { root: true })
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
    },
    selectFile ({ commit }, { file }) {
      commit('setSelectedFile', { file })
    },
    selectPreviousFile ({ commit, getters, state }) {
      const index = getters.selectedIndex - 1
      if (index < 0) {
        return
      }
      const file = state.files[index]
      commit('setSelectedFile', { file })
    },
    selectNextFile ({ commit, getters, state }) {
      const index = getters.selectedIndex + 1
      if (index > state.files.length - 1) {
        return
      }
      const file = state.files[index]
      commit('setSelectedFile', { file })
    },
    changeSortKey ({ commit, dispatch, state }, { key }) {
      let order = orderDefaults[key]
      if (state.sortKey === key) {
        order = state.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      commit('setSortKey', { key })
      commit('setSortOrder', { order })
      dispatch('sortFiles')
    },
    action ({ dispatch, state }, { filepath }) {
      const file = getFile(filepath)
      if (file.stats.isDirectory()) {
        dispatch('changeDirectory', { dir: filepath })
      } else {
        dispatch('viewer/show', { filepath }, { root: true })
      }
    }
  },
  mutations: {
    setError (state, { error }) {
      state.error = error
    },
    setDirectory (state, { dir }) {
      state.directory = dir
    },
    setDirectoryInput (state, { dir }) {
      state.directoryInput = dir
    },
    setHistories (state, { histories }) {
      state.histories = histories
    },
    setHistoryIndex (state, { index }) {
      state.historyIndex = index
    },
    setFiles (state, { files }) {
      state.files = files
    },
    setSelectedFile (state, { file }) {
      state.selectedFile = file
    },
    setSortKey (state, { key }) {
      state.sortKey = key
    },
    setSortOrder (state, { order }) {
      state.sortOrder = order
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
