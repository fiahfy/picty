export default {
  namespaced: true,
  state: {
    darkTheme: false,
    imageExpanded: false,
    fullScreen: false
  },
  mutations: {
    setDarkTheme (state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setImageExpanded (state, { imageExpanded }) {
      state.imageExpanded = imageExpanded
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    }
  }
}
