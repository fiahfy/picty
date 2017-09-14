import path from 'path'
import { listFiles, isImage } from '../utils/file'

export default {
  state: {
    error: false,
    isViewing: false,
    images: [],
    currentImage: ''
  },
  actions: {
    async showViewer ({ commit }, file) {
      try {
        const dir = path.dirname(file)
        let files = await listFiles(dir)
        files = files.filter((file) => isImage(file.path))
        commit('preparedViewer', { files, file, error: false })
      } catch (e) {
        commit('preparedViewer', { files: [], file: '', error: true })
      }
    }
  },
  mutations: {
    preparedViewer (state, { files, file, error }) {
      state.images = files
      state.currentImage = file
      state.isViewing = true
      state.error = error
    },
    viewPreviousImage (state) {
      let index = state.images.findIndex((file) => {
        return file.path === state.currentImage
      }) - 1
      if (index < 0) {
        index = state.images.length - 1
      }
      state.currentImage = state.images[index].path
    },
    viewNextImage (state) {
      let index = state.images.findIndex((file) => {
        return file.path === state.currentImage
      }) + 1
      if (index > state.images.length - 1) {
        index = 0
      }
      state.currentImage = state.images[index].path
    },
    closeViewer (state) {
      state.isViewing = false
    }
  }
}
