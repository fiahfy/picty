export default {
  namespaced: true,
  state: {
    darkTheme: false,
    imageStretched: false,
    fullScreen: false
  },
  mutations: {
    setDarkTheme (state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setImageStretched (state, { imageStretched }) {
      state.imageStretched = imageStretched
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    }
  }
}
