export default {
  namespaced: true,
  state: {
    fullScreen: false
  },
  mutations: {
    setFullScreen (state, fullScreen) {
      state.fullScreen = fullScreen
    }
  }
}
