import { remote } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { listFiles } from '../utils/file';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    path: remote.app.getPath('home'),
    files: [],
  },
  actions: {
    async changePath({ commit }, path) {
      commit('setPath', { path });
      const files = await listFiles(path);
      commit('setFiles', { files });
    },
  },
  mutations: {
    setFiles(state, { files }) {
      Vue.set(state, 'files', files);
    },
    setPath(state, { path }) {
      Vue.set(state, 'path', path);
    },
  },
  plugins: [
    createPersistedState({
      paths: ['path'],
    }),
  ],
});
