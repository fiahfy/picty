export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false
  },
  mutations: {
    setDarkTheme (state, { flag }) {
      state.darkTheme = flag
    },
    setFullScreen (state, { flag }) {
      state.fullScreen = flag
    }
  }
}
