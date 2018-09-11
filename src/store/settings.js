import path from 'path'

export const defaultExtensions = [
  'BMP', 'GIF', 'ICO', 'JPEG', 'JPG', 'PNG', 'SVG', 'TIF', 'TIFF', 'WEBP'
]

export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false,
    recursive: false,
    imageStretched: false,
    children: false,
    extensions: [...defaultExtensions]
  },
  getters: {
    isFileAvailable (state) {
      return ({ filepath }) => {
        if (!filepath) {
          return false
        }
        const ext = path.extname(filepath).toUpperCase()
        if (!ext) {
          return false
        }
        return state.extensions.includes(ext.slice(1))
      }
    }
  },
  mutations: {
    setDarkTheme (state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setFullScreen (state, { fullScreen }) {
      state.fullScreen = fullScreen
    },
    setRecursive (state, { recursive }) {
      state.recursive = recursive
    },
    setImageStretched (state, { imageStretched }) {
      state.imageStretched = imageStretched
    },
    setChildren (state, { children }) {
      state.children = children
    },
    setExtensions (state, { extensions }) {
      state.extensions = extensions
    }
  }
}
