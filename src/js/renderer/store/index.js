import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { remote } from 'electron'
import app from './app'
import settings from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    directory: remote.app.getPath('home'),
    bookmarks: []
  },
  actions: {
    bookmark ({ commit, state }, { filepath }) {
      if (state.bookmarks.includes(filepath)) {
        return
      }
      const bookmarks = [
        ...state.bookmarks,
        filepath
      ]
      commit('setBookmarks', { bookmarks })
    },
    deleteBookmark ({ commit, state }, { filepath }) {
      const bookmarks = state.bookmarks.filter((bookmark) => bookmark !== filepath)
      commit('setBookmarks', { bookmarks })
    },
    toggleBookmark ({ dispatch, state }, { filepath }) {
      if (state.bookmarks.includes(filepath)) {
        dispatch('deleteBookmark', { filepath })
      } else {
        dispatch('bookmark', { filepath })
      }
    }
  },
  mutations: {
    setDirectory (state, { directory }) {
      state.directory = directory
    },
    setBookmarks (state, { bookmarks }) {
      state.bookmarks = bookmarks
    }
  },
  modules: {
    app,
    settings
  },
  plugins: [
    createPersistedState({
      paths: [
        'directory',
        'bookmarks',
        'settings'
      ]
    })
  ]
})
