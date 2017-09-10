import Vue from 'vue';
import Vuex from 'vuex';
import { listFiles } from '../utils/file';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    path: '',
    files: [],
  },
  actions: {
    async changePath({ commit }, path) {
      commit('setPath', { path });
      const files = await listFiles(path);
      commit('setFiles', { files });
    },
    async readDir({ commit }, dir) {
      const files = await listFiles(dir);
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
});
