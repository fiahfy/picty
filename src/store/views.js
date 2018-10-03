export default {
  namespaced: true,
  state: {
    views: {}
  },
  getters: {
    getViews(state) {
      return ({ filepath }) => state.views[filepath] || 0
    }
  },
  mutations: {
    incrementViews(state, { filepath }) {
      const views = state.views[filepath] || 0
      state.views = {
        ...state.views,
        [filepath]: views + 1
      }
    }
  }
}
