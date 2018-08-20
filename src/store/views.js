export default {
  namespaced: true,
  state: {
    views: {}
  },
  getters: {
    getViews (state) {
      return ({ filepath }) => state.views[filepath] || 0
    }
  },
  actions: {
    incrementViews ({ commit, getters, state }, { filepath }) {
      const views = {
        ...state.views,
        [filepath]: getters.getViews({ filepath }) + 1
      }
      commit('setViews', { views })
    }
  },
  mutations: {
    setViews (state, { views }) {
      state.views = views
    }
  }
}
