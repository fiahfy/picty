import path from 'path'
import { remote } from 'electron'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'
import viewer from './viewer'
import { listFiles } from '../utils/file'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: false,
    directory: remote.app.getPath('home'),
    files: [],
    selectedFile: {}
  },
  actions: {
    async loadFiles ({ commit }, dir) {
      try {
        const files = await listFiles(dir)
        commit('loadedFiles', { files, error: false })
      } catch (e) {
        commit('loadedFiles', { files: [], error: true })
      }
    },
    async changeDirectory ({ commit, dispatch }, dir) {
      commit('changedDirectory', { dir })
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
    }
  },
  mutations: {
    changedDirectory (state, { dir }) {
      state.directory = dir
    },
    loadedFiles (state, { files, error }) {
      state.files = files
      state.error = error
    },
    selectFile (state, { file }) {
      state.selectedFile = file
    },
    changeRoute (state, { name }) {
      router.push({ name })
    }
  },
  modules: {
    viewer
  },
  plugins: [
    createPersistedState({
      paths: ['directory']
    })
  ]
})
