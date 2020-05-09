import path from 'path'
import settings from '~/consts/settings'

export const state = () => ({
  darkTheme: false,
  fullScreen: false,
  recursive: false,
  imageStretched: false,
  queryHistorySize: 1000,
  previewWidth: 'medium',
  thumbnailStyle: 'cover',
  thumbnailHeight: 'medium',
  extensions: [...settings.DEFAULT_EXTENSIONS],
})

export const getters = {
  previewWidthValue(state) {
    return settings.PREVIEW_WIDTHS[state.previewWidth]
  },
  thumbnailHeightValue(state) {
    return settings.THUMBNAIL_HEIGHTS[state.thumbnailHeight]
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
  },
}

export const mutations = {
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
  setQueryHistorySize(state, { queryHistorySize }) {
    state.queryHistorySize = queryHistorySize
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
  },
}
