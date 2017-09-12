import path from 'path';
import { remote } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { listFiles } from '../utils/file';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    directory: remote.app.getPath('home'),
    file: {
      items: [],
      error: false,
    },
    viewing: null,
  },
  actions: {
    async loadFiles({ commit }, dir) {
      try {
        const items = await listFiles(dir);
        commit('setFile', { file: { items, error: false } });
      } catch (e) {
        commit('setFile', { file: { items: [], error: true } });
      }
    },
    async changeDirectory({ commit, dispatch }, dir) {
      commit('setDirectory', { dir });
      dispatch('loadFiles', dir);
    },
    async changeChildDirectory({ dispatch, state }, dirname) {
      const child = path.join(state.directory, dirname);
      await dispatch('changeDirectory', child);
    },
    async changeParentDirectory({ dispatch, state }) {
      const parent = path.dirname(state.directory);
      await dispatch('changeDirectory', parent);
    },
    async refreshDirectory({ dispatch, state }) {
      await dispatch('loadFiles', state.directory);
    },
  },
  mutations: {
    setDirectory(state, { dir }) {
      Vue.set(state, 'directory', dir);
    },
    setFile(state, { file }) {
      Vue.set(state, 'file', file);
    },
  },
  plugins: [
    createPersistedState({
      paths: ['directory'],
    }),
  ],
});
