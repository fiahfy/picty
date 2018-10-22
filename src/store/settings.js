import path from 'path'

export const defaultExtensions = [
  'BMP',
  'GIF',
  'ICO',
  'JPEG',
  'JPG',
  'PNG',
  'SVG',
  'TIF',
  'TIFF',
  'WEBP'
]

export const previewWidths = {
  none: 0,
  narrow: 128,
  medium: 192,
  wide: 256
}
export const thumbnailHeights = {
  short: 128,
  medium: 192,
  tall: 256
}

export const thumbnailStyles = ['cover', 'contain']

export default {
  namespaced: true,
  state: {
    darkTheme: false,
    fullScreen: false,
    recursive: false,
    imageStretched: false,
    previewWidth: 'medium',
    thumbnailStyle: 'cover',
    thumbnailHeight: 'medium',
    extensions: [...defaultExtensions]
  },
  getters: {
    previewWidthValue(state) {
      return previewWidths[state.previewWidth]
    },
    thumbnailHeightValue(state) {
      return thumbnailHeights[state.thumbnailHeight]
    },
    isFileAvailable(state) {
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
    setDarkTheme(state, { darkTheme }) {
      state.darkTheme = darkTheme
    },
    setFullScreen(state, { fullScreen }) {
      state.fullScreen = fullScreen
    },
    setRecursive(state, { recursive }) {
      state.recursive = recursive
    },
    setImageStretched(state, { imageStretched }) {
      state.imageStretched = imageStretched
    },
    setPreviewWidth(state, { previewWidth }) {
      state.previewWidth = previewWidth
    },
    setThumbnailStyle(state, { thumbnailStyle }) {
      state.thumbnailStyle = thumbnailStyle
    },
    setThumbnailHeight(state, { thumbnailHeight }) {
      state.thumbnailHeight = thumbnailHeight
    },
    setExtensions(state, { extensions }) {
      state.extensions = extensions
    }
  }
}
