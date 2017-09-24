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
    files: [],
    selectedFile: {},
    sortKey: 'name',
    sortOrder: 'asc'
  },
  actions: {
    changeDirectory ({ commit, dispatch }, dir) {
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
      commit('setSelectedFile', {})
      dispatch('sortFiles')
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
      dispatch('changeDirectory', state.directory)
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
        return file.path === state.selectedFile.path
      })
    }
  }
}
