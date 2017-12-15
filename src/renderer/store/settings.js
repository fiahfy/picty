export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false
  },
  mutations: {
    setDarkTheme (state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    }
  }
}
