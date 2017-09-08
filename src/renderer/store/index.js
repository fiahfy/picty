import Vue from 'vue';
import Vuex from 'vuex';
import { listFiles } from '../utils/file';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    files: [],
  },
  actions: {
    async readDir({ commit }, dir) {
      const files = await listFiles(dir);
      commit('setFiles', { files });
    },
  },
  mutations: {
    setFiles(state, { files }) {
      Vue.set(state, 'files', files);
    },
  },
});
