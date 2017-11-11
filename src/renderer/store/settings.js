export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false,
    improveRenderingPerformance: false
  },
  mutations: {
    setDarkTheme (state, { flag }) {
      state.darkTheme = flag
    },
    setFullScreen (state, { flag }) {
      state.fullScreen = flag
    },
    setImproveRenderingPerformance (state, { flag }) {
      state.improveRenderingPerformance = flag
    }
  }
}
