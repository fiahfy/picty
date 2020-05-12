import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { settingsStore, layoutStore } from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const fileUtil = require('~/utils/file').default
const Worker = require('~/workers/file.worker.js')

const scales = [
  0.25,
  0.33,
  0.5,
  0.67,
  0.75,
  0.8,
  0.9,
  1,
  1.1,
  1.25,
  1.5,
  1.75,
  2,
  2.5,
  3,
  4,
  5,
]

const worker = workerPromisify(new Worker())

@Module({
  name: 'viewer',
  stateFactory: true,
  namespaced: true,
})
export default class ViewerModule extends VuexModule {
  loading = false
  error: Error | undefined = undefined
  files: any[] = []
  currentFilepath: string | undefined = undefined
  originalScale = 0
  scale = 0
  scaling = false

  get currentFileIndex() {
    return this.files.findIndex((file) => this.currentFilepath === file.path)
  }

  get currentFile() {
    return this.files.find((file) => this.currentFilepath === file.path)
  }

  @Mutation
  async loadFiles({
    dirpath,
    filepath,
  }: {
    dirpath: string
    filepath: string
  }) {
    this.setLoading({ loading: true })
    this.setError({ error: undefined })
    this.setFiles({ files: [] })
    this.setCurrentFilepath({ currentFilepath: '' })
    try {
      let files = []
      let currentFilepath = ''
      if (dirpath) {
        files = (
          await worker.postMessage({
            method: 'listFiles',
            args: [dirpath, { recursive: settingsStore.recursive }],
          })
        ).data
      } else if (filepath) {
        const file = fileUtil.getFile(filepath)
        files = (
          await worker.postMessage({
            method: 'listFiles',
            args: [file.dirpath],
          })
        ).data
        currentFilepath = filepath
      }
      files = files.filter((file: any) =>
        settingsStore.isFileAvailable({ filepath: file.path })
      )
      if (
        files.length &&
        (!currentFilepath ||
          !files.find((file: any) => file.path === currentFilepath))
      ) {
        currentFilepath = files[0].path
      }
      this.setError({ error: undefined })
      this.setFiles({ files })
      this.setCurrentFilepath({ currentFilepath })
    } catch (e) {
      this.setError({ error: e })
      this.setFiles({ files: [] })
      this.setCurrentFilepath({ currentFilepath: undefined })
    }
    this.setLoading({ loading: false })
  }

  @Mutation
  movePreviousFile() {
    let index = this.currentFileIndex - 1
    if (index < 0) {
      index = this.files.length - 1
    }
    this.moveFile({ index })
  }

  @Mutation
  moveNextFile() {
    let index = this.currentFileIndex + 1
    if (index > this.files.length - 1) {
      index = 0
    }
    this.moveFile({ index })
  }

  @Mutation
  moveFile({ index }: { index: number }) {
    const file = this.files[index]
    if (file) {
      this.setCurrentFilepath({ currentFilepath: file.path })
    }
  }

  @Mutation
  setupZoom({ scale }: { scale: number }) {
    this.setScale({ scale })
    this.setOriginalScale({ originalScale: scale })
    this.setScaling({ scaling: false })
  }

  @Mutation
  zoomIn() {
    const scale =
      scales.find((scale) => {
        return scale > this.scale
      }) || this.scale
    this.setScale({ scale })
    this.setScaling({ scaling: true })
  }

  @Mutation
  zoomOut() {
    const scale =
      scales
        .concat()
        .reverse()
        .find((scale) => {
          return scale < this.scale
        }) || this.scale
    this.setScale({ scale })
    this.setScaling({ scaling: true })
  }

  @Mutation
  resetZoom() {
    this.setScale({ scale: this.originalScale })
    this.setScaling({ scaling: false })
  }

  @Mutation
  toggleFullScreen() {
    if (layoutStore.fullScreen) {
      layoutStore.leaveFullScreen()
    } else {
      layoutStore.enterFullScreen()
    }
  }

  @Mutation
  dismiss() {
    layoutStore.dismissViewer()
  }

  @Mutation
  setLoading({ loading }: { loading: boolean }) {
    this.loading = loading
  }

  @Mutation
  setError({ error }: { error?: Error }) {
    this.error = error
  }

  @Mutation
  setFiles({ files }: { files: any[] }) {
    this.files = files
  }

  @Mutation
  setCurrentFilepath({ currentFilepath }: { currentFilepath?: string }) {
    this.currentFilepath = currentFilepath
  }

  @Mutation
  setOriginalScale({ originalScale }: { originalScale: number }) {
    this.originalScale = originalScale
  }

  @Mutation
  setScale({ scale }: { scale: number }) {
    this.scale = scale
  }

  @Mutation
  setScaling({ scaling }: { scaling: boolean }) {
    this.scaling = scaling
  }
}
