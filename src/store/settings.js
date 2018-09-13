import path from 'path'

export const defaultExtensions = [
  'BMP', 'GIF', 'ICO', 'JPEG', 'JPG', 'PNG', 'SVG', 'TIF', 'TIFF', 'WEBP'
]

export const thumbnailStyles = [
  'cover', 'contain'
]

export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false,
    recursive: false,
    imageStretched: false,
    thumbnailStyle: 'cover',
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
    setThumbnailStyle (state, { thumbnailStyle }) {
      state.thumbnailStyle = thumbnailStyle
    },
    setExtensions (state, { extensions }) {
      state.extensions = extensions
    }
  }
}
