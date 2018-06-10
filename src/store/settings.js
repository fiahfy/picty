import path from 'path'

export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false,
    imageStretched: false,
    allowedExtensions: [
      '.jpeg',
      '.jpg',
      '.png',
      '.gif',
      '.webp',
      '.tif',
      '.bmp',
      '.jxr',
      '.psd'
    ]
  },
  getters: {
    isAllowedFile (state) {
      return ({ filepath }) => state.allowedExtensions.includes(path.extname(filepath).toLowerCase())
    }
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
