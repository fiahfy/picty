export const state = () => ({
  views: {},
})

export const getters = {
  getViews(state) {
    return ({ filepath }) => state.views[filepath] || 0
  },
}

export const mutations = {
  incrementViews(state, { filepath }) {
    const views = state.views[filepath] || 0
    state.views = {
      ...state.views,
      [filepath]: views + 1,
    }
  },
}
