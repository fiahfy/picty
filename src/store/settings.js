import path from 'path'

export const defaultExtensions = [
  'BMP', 'GIF', 'ICO', 'JPEG', 'JPG', 'PNG', 'SVG', 'TIF', 'TIFF', 'WEBP'
]

export const previewSizes = {
  none: 0,
  small: 128,
  medium: 256,
  large: 512
}

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
    previewSize: 'medium',
    thumbnailStyle: 'cover',
    extensions: [...defaultExtensions]
  },
  getters: {
    previewSizeValue (state) {
      return previewSizes[state.previewSize]
    },
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
    setPreviewSize (state, { previewSize }) {
      state.previewSize = previewSize
    },
    setThumbnailStyle (state, { thumbnailStyle }) {
      state.thumbnailStyle = thumbnailStyle
    },
    setExtensions (state, { extensions }) {
      state.extensions = extensions
    }
  }
}
