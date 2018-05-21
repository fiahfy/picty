import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import bookmark from './bookmark'
import settings from './settings'
import app from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    directory: remote.app.getPath('home')
  },
  modules: {
    bookmark,
    settings,
    app
  },
  mutations: {
    setDirectory (state, { directory }) {
      state.directory = directory
    }
  },
  plugins: [
    createPersistedState({
      paths: [
        'directory',
        'bookmark',
        'settings'
      ]
    })
  ]
})
