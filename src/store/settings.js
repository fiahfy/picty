export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false,
    imageStretched: false
  },
  mutations: {
    setDarkTheme (state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    },
    setImageStretched (state, { imageStretched }) {
      state.imageStretched = imageStretched
    }
  }
}
