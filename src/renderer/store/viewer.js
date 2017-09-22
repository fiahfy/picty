import path from 'path'
import { listFiles, isImage } from '../utils/file'

export default {
  namespaced: true,
  state: {
    error: null,
    isViewing: false,
    files: [],
    currentFile: {}
  },
  actions: {
    async showViewer ({ commit, dispatch }, file) {
      try {
        let files
        if (file.stats.isDirectory()) {
          files = await listFiles(file.path)
          files = files.filter((file) => isImage(file.path))
          file = files[0]
          if (!files.length) {
            throw new Error('Image Not Found')
          }
        } else {
          const dir = path.dirname(file.path)
          files = await listFiles(dir)
          files = files.filter((file) => isImage(file.path))
        }
        commit('setError', null)
        commit('setCurrentFile', file)
        commit('setFiles', files)
      } catch (e) {
        let error = e.message === 'Image Not Found' ? e : new Error('Invalid Image')
        commit('setError', error)
        commit('setCurrentFile', {})
        commit('setFiles', [])
      }
      commit('setViewing', true)
      dispatch('focusSelector', '.viewer', { root: true })
    },
    dismissViewer ({ commit, dispatch }) {
      commit('setViewing', false)
      dispatch('focusSelector', '.file-list', { root: true })
    },
    async showViewerWithSelectedFile ({ dispatch, rootState }) {
      await dispatch('showViewer', rootState.explorer.selectedFile)
    }
  },
  mutations: {
    setError (state, error) {
      state.error = error
    },
    setViewing (state, isViewing) {
      state.isViewing = isViewing
    },
    setFiles (state, files) {
      state.files = files
    },
    setCurrentFile (state, file) {
      state.currentFile = file
    },
    viewPreviousImage (state) {
      let index = state.files.findIndex((file) => {
        return file.path === state.currentFile.path
      }) - 1
      if (index < 0) {
        index = state.files.length - 1
      }
      state.currentFile = state.files[index]
    },
    viewNextImage (state) {
      let index = state.files.findIndex((file) => {
        return file.path === state.currentFile.path
      }) + 1
      if (index > state.files.length - 1) {
        index = 0
      }
      state.currentFile = state.files[index]
    }
  }
}
