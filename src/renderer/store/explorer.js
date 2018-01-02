import fs from 'fs'
import path from 'path'
import { remote, shell } from 'electron'
import { listFiles, isImage } from '../utils/file'

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
    sortOptions: {}
  },
  actions: {
    initDirectory ({ dispatch, state }) {
      const dirpath = state.directory
      dispatch('changeDirectory', { dirpath })
    },
    changeParentDirectory ({ dispatch, state }) {
      const dirpath = path.dirname(state.directory)
      dispatch('changeDirectory', { dirpath })
    },
    changeHomeDirectory ({ dispatch }) {
      const dirpath = remote.app.getPath('home')
      dispatch('changeDirectory', { dirpath })
    },
    changeSelectedDirectory ({ dispatch, state }) {
      if (state.selectedFile && state.selectedFile.stats.isDirectory()) {
        const dirpath = state.selectedFile.path
        dispatch('changeDirectory', { dirpath })
      }
    },
    changeDirectory ({ commit, dispatch, state }, { dirpath }) {
      const historyIndex = state.historyIndex + 1
      const histories = [...state.histories.slice(0, historyIndex), {
        directory: dirpath,
        scrollTop: 0
      }]
      commit('setHistories', { histories })
      commit('setHistoryIndex', { historyIndex })

      dispatch('restoreDirectory', { historyIndex })
    },
    refreshDirectory ({ dispatch, state }) {
      const historyIndex = state.historyIndex
      dispatch('restoreDirectory', { historyIndex })
    },
    backDirectory ({ dispatch, state }, { offset = 0 }) {
      const historyIndex = state.historyIndex - 1 - offset
      dispatch('restoreDirectory', { historyIndex })
    },
    forwardDirectory ({ dispatch, state }, { offset = 0 }) {
      const historyIndex = state.historyIndex + 1 + offset
      dispatch('restoreDirectory', { historyIndex })
    },
    restoreDirectory ({ commit, dispatch, state }, { historyIndex }) {
      const history = state.histories[historyIndex]
      commit('setHistoryIndex', { historyIndex })

      commit('setDirectory', { directory: history.directory })
      commit('setDirectoryInput', { directoryInput: history.directory })
      commit('setSelectedFile', { selectedFile: null })
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
        const files = listFiles(state.directory).filter((file) => file.stats.isDirectory() || isImage(file.path))
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
      dispatch('focus', { selector: '.file-list table' }, { root: true })
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
    scroll ({ commit, state }) {
      const node = document.querySelector('.file-list')
      if (node) {
        const history = {
          ...state.histories[state.historyIndex],
          scrollTop: node.scrollTop
        }
        commit('setHistory', { history, index: state.historyIndex })
      }
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
    action ({ commit, dispatch, state }, { file }) {
      if (file.stats.isDirectory()) {
        dispatch('changeDirectory', { dirpath: file.path })
      } else {
        dispatch('viewer/showDirectory', { dirpath: path.dirname(file.path), currentFile: file }, { root: true })
      }
    },
    sortFiles ({ commit, getters, state }) {
      const files = state.files.concat().sort((a, b) => {
        let result = 0
        switch (getters.sortOption.key) {
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
        return getters.sortOption.order === 'asc' ? result : -1 * result
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
    setSortOption (state, { sortOption, key }) {
      state.sortOptions = {
        ...state.sortOptions,
        [key]: sortOption
      }
    }
  },
  getters: {
    selectedIndex (state) {
      return state.files.findIndex((file) => {
        return state.selectedFile && file.path === state.selectedFile.path
      })
    },
    backDirectories (state) {
      return state.histories.slice(0, state.historyIndex).reverse().map(history => history.directory)
    },
    forwardDirectories (state) {
      return state.histories.slice(state.historyIndex + 1, state.histories.length).map(history => history.directory)
    },
    canBackDirectory (state) {
      return !!state.histories[state.historyIndex - 1]
    },
    canForwardDirectory (state) {
      return !!state.histories[state.historyIndex + 1]
    },
    scrollTop (state) {
      return state.histories[state.historyIndex].scrollTop
    },
    sortOption (state) {
      return state.sortOptions[state.directory] || {
        key: 'name',
        order: 'asc'
      }
    }
  }
}
