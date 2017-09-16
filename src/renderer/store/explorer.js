import path from 'path'
import { remote } from 'electron'
import { listFiles } from '../utils/file'

const orderDefaults = {
  name: 'asc',
  date_modified: 'desc'
}

export default {
  namespaced: true,
  state: {
    error: null,
    directory: remote.app.getPath('home'),
    files: [],
    selectedFile: {},
    sortKey: 'name',
    sortOrder: 'asc'
  },
  actions: {
    async loadFiles ({ commit }, dir) {
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
      commit('setDirectory', dir)
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
    async refreshDirectory ({ dispatch, state }) {
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
    }
  },
  mutations: {
    setError (state, error) {
      state.error = error
    },
    setDirectory (state, dir) {
      state.directory = dir
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
