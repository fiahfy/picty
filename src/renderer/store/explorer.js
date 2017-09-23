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
    async loadFiles ({ commit, dispatch }, dir) {
      if (watcher) {
        watcher.close()
      }
      watcher = fs.watch(dir, () => {
        dispatch('refreshDirectory')
      })
      commit('setDirectory', dir)
      commit('setDirectoryInput', dir)
      try {
        const files = await listFiles(dir)
        commit('setError', null)
        commit('setFiles', files)
      } catch (e) {
        commit('setError', new Error('Invalid Directory'))
        commit('setFiles', [])
      }
      commit('orderFile')
    },
    async changeDirectory ({ commit, dispatch }, dir) {
      await dispatch('loadFiles', dir)
    },
    async changeChildDirectory ({ dispatch, state }, dirname) {
      const child = path.join(state.directory, dirname)
      await dispatch('changeDirectory', child)
    },
    async changeParentDirectory ({ dispatch, state }) {
      const parent = path.dirname(state.directory)
      await dispatch('changeDirectory', parent)
    },
    async refreshDirectory ({ commit, dispatch, state }) {
      await dispatch('loadFiles', state.directory)
    },
    changeSort ({ commit, state }, sortKey) {
      let sortOrder = orderDefaults[sortKey]
      if (state.sortKey === sortKey) {
        sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      commit('setSortKey', sortKey)
      commit('setSortOrder', sortOrder)
      commit('orderFile')
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
    setSortKey (state, sortKey) {
      state.sortKey = sortKey
    },
    setSortOrder (state, sortOrder) {
      state.sortOrder = sortOrder
    },
    selectFile (state, file) {
      state.selectedFile = file
    },
    selectPreviousFile (state) {
      let index = state.files.findIndex((file) => {
        return file.path === state.selectedFile.path
      }) - 1
      if (index < 0) {
        return
      }
      state.selectedFile = state.files[index]
    },
    selectNextFile (state) {
      let index = state.files.findIndex((file) => {
        return file.path === state.selectedFile.path
      }) + 1
      if (index > state.files.length - 1) {
        return
      }
      state.selectedFile = state.files[index]
    },
    orderFile (state) {
      state.files = state.files.concat().sort((a, b) => {
        let result = true
        if (state.sortKey === 'date_modified') {
          result = a.stats.mtime > b.stats.mtime
        } else {
          result = a.name > b.name
        }
        result = state.sortOrder === 'asc' ? result : !result
        return result ? 1 : -1
      })
    }
  }
}
