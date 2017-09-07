import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function readDir(dir) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['a', 'b', 'c']);
    }, 3000);
  });
}

export default new Vuex.Store({
  state: {
    files: [],
  },
  actions: {
    readDir({ commit }, dir) {
      return readDir(dir).then((files) => {
        commit('setFiles', { files });
      });
    },
  },
  mutations: {
    setFiles(state, { files }) {
      Vue.set(state, 'files', files);
    },
  },
});
