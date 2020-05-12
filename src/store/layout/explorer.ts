import { remote, shell } from 'electron'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import {
  settingsStore,
  layoutStore,
  bookmarkStore,
  ratingStore,
  viewStore,
} from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const fileUtil = require('~/utils/file').default
const selector = require('~/consts/selector').default
const Worker = require('~/workers/file.worker.js')

const reversed: any = {
  name: false,
  views: true,
  rating: true,
  modified_at: true,
}

const worker = workerPromisify(new Worker())

@Module({
  name: 'explorer',
  stateFactory: true,
  namespaced: true,
})
export default class ExplorerModule extends VuexModule {
  directory = remote.app.getPath('home')
  directoryInput = ''
  query = ''
  queryInput = ''
  queryHistories: any[] = []
  display = 'list'
  loading = false
  files: any[] = []
  selectedFilepath = ''
  histories: any = []
  historyIndex = -1
  orders: any = {}

  get backDirectories() {
    return this.histories
      .slice(0, this.historyIndex)
      .reverse()
      .map((history: any) => history.directory)
  }

  get forwardDirectories() {
    return this.histories
      .slice(this.historyIndex + 1, this.histories.length)
      .map((history: any) => history.directory)
  }

  get canBackDirectory() {
    return this.historyIndex > 0
  }

  get canForwardDirectory() {
    return this.historyIndex < this.histories.length - 1
  }

  get canViewFile() {
    return !!this.selectedFilepath
  }

  get directoryBookmarked() {
    return bookmarkStore.isBookmarked({ filepath: this.directory })
  }

  get scrollTop() {
    return this.histories[this.historyIndex].scrollTop
  }

  get order() {
    return (
      this.orders[this.directory] || {
        by: 'name',
        descending: false,
      }
    )
  }

  get filteredFiles() {
    return this.files.concat().filter((file) => {
      return (
        !this.query ||
        file.name.toLowerCase().includes(this.query.toLowerCase())
      )
    })
  }

  get selectedFileIndex() {
    return this.filteredFiles.findIndex((file) =>
      this.isFileSelected({ filepath: file.path })
    )
  }

  get getFile() {
    return ({ filepath }: { filepath: string }) =>
      this.files.find((file) => file.path === filepath)
  }

  get isFileSelected() {
    return ({ filepath }: { filepath: string }) =>
      this.selectedFilepath === filepath
  }

  get isFileAvailable() {
    return ({ filepath }: { filepath: string }) =>
      settingsStore.isFileAvailable({ filepath })
  }

  @Mutation
  initialize() {
    const dirpath = this.directory
    this.changeDirectory({ dirpath, force: true })
  }

  @Mutation
  upDirectory() {
    const dirpath = fileUtil.getFile(this.directory).dirpath
    this.changeDirectory({ dirpath })
  }

  @Mutation
  changeHomeDirectory() {
    const dirpath = remote.app.getPath('home')
    this.changeDirectory({ dirpath })
  }

  @Mutation
  changeDirectory({
    dirpath,
    force = false,
  }: {
    dirpath: string
    force?: boolean
  }) {
    if (this.loading) {
      return
    }
    if (dirpath === this.directory && !force) {
      return
    }
    const historyIndex = this.historyIndex + 1
    const histories = [
      ...this.histories.slice(0, historyIndex),
      {
        directory: dirpath,
        scrollTop: 0,
      },
    ]
    this.setSelectedFilepath({ selectedFilepath: '' })
    this.setHistories({ histories })
    this.setHistoryIndex({ historyIndex })

    this.restoreDirectory({ historyIndex })
  }

  @Mutation
  backDirectory({ offset = 0 } = {}) {
    if (!this.canBackDirectory) {
      return
    }
    const historyIndex = this.historyIndex - 1 - offset
    this.restoreDirectory({ historyIndex })
  }

  @Mutation
  forwardDirectory({ offset = 0 } = {}) {
    if (!this.canForwardDirectory) {
      return
    }
    const historyIndex = this.historyIndex + 1 + offset
    this.restoreDirectory({ historyIndex })
  }

  @Mutation
  reloadDirectory() {
    this.setSelectedFilepath({ selectedFilepath: '' })
    this.setScrollTop({ scrollTop: 0 })
    this.restoreDirectory({ historyIndex: this.historyIndex })
  }

  @Mutation
  restoreDirectory({ historyIndex }: { historyIndex: number }) {
    if (this.loading) {
      return
    }
    const history = this.histories[historyIndex]
    this.setHistoryIndex({ historyIndex })

    this.setDirectory({ directory: history.directory })
    this.setDirectoryInput({ directoryInput: history.directory })
    this.setQuery({ query: '' })

    this.loadFiles()
  }

  @Mutation
  browseDirectory() {
    const result = shell.openItem(this.directory)
    if (!result) {
      layoutStore.showMessage({ color: 'error', text: 'Invalid directory' })
    }
  }

  @Mutation
  toggleDirectoryBookmarked() {
    bookmarkStore.toggleBookmarked({ filepath: this.directory })
  }

  @Mutation
  async loadFiles() {
    if (this.loading) {
      return
    }
    this.setLoading({ loading: true })
    try {
      this.setFiles({ files: [] })
      const { data } = await worker.postMessage({
        method: 'listFiles',
        args: [this.directory],
      })
      const files = data
        .filter(
          (file: any) =>
            file.directory ||
            settingsStore.isFileAvailable({ filepath: file.path })
        )
        .map((file: any) => {
          return {
            ...file,
            rating: ratingStore.getRating({ filepath: file.path }),
            views: viewStore.getViews({ filepath: file.path }),
          }
        })
      this.setFiles({ files })
    } catch (e) {
      this.setFiles({ files: [] })
    }
    this.sortFiles()
    this.focus()
    this.setLoading({ loading: false })
  }

  @Mutation
  sortFiles() {
    const { by, descending } = this.order
    const files = this.files.concat().sort((a, b) => {
      let result = 0
      if (a[by] > b[by]) {
        result = 1
      } else if (a[by] < b[by]) {
        result = -1
      }
      if (result === 0) {
        if (a.name > b.name) {
          result = 1
        } else if (a.name < b.name) {
          result = -1
        }
      }
      result = reversed[by] ? -1 * result : result
      return descending ? -1 * result : result
    })
    this.setFiles({ files })
  }

  @Mutation
  searchFiles({ query }: { query: string }) {
    this.setQueryInput({ queryInput: query })
    this.setQuery({ query })
    if (query) {
      this.addQueryHistory({ queryHistory: query })
    }
  }

  @Mutation
  addQueryHistory({ queryHistory }: { queryHistory: any }) {
    const queryHistories = [...this.queryHistories, queryHistory].slice(
      -settingsStore.queryHistorySize
    )
    this.setQueryHistories({ queryHistories })
  }

  @Mutation
  removeQueryHistory({ queryHistory }: { queryHistory: any }) {
    const queryHistories = this.queryHistories
      .filter((history) => history !== queryHistory)
      .slice(-settingsStore.queryHistorySize)
    this.setQueryHistories({ queryHistories })
  }

  @Mutation
  clearQueryHistory() {
    this.setQueryHistories({ queryHistories: [] })
  }

  @Mutation
  selectFile({ filepath }: { filepath: string }) {
    this.setSelectedFilepath({ selectedFilepath: filepath })
  }

  @Mutation
  selectFileIndex({ index }: { index: number }) {
    const file = this.filteredFiles[index]
    if (file) {
      this.selectFile({ filepath: file.path })
    }
  }

  @Mutation
  selectFirstFile() {
    this.selectFileIndex({ index: 0 })
  }

  @Mutation
  selectLastFile() {
    this.selectFileIndex({ index: this.filteredFiles.length - 1 })
  }

  @Mutation
  selectPreviousFile() {
    this.selectFileIndex({ index: this.selectedFileIndex - 1 })
  }

  @Mutation
  selectNextFile() {
    this.selectFileIndex({ index: this.selectedFileIndex + 1 })
  }

  @Mutation
  selectLeftFile({ offset }: { offset: number }) {
    let index
    if (this.selectedFileIndex % offset === 0) {
      index = this.selectedFileIndex + offset - 1
      if (index > this.filteredFiles.length - 1) {
        index = this.filteredFiles.length - 1
      }
    } else {
      index = this.selectedFileIndex - 1
    }
    this.selectFileIndex({ index })
  }

  @Mutation
  selectTopFile({ offset }: { offset: number }) {
    const index = this.selectedFileIndex - offset
    if (index < 0) {
      return
    }
    this.selectFileIndex({ index })
  }

  @Mutation
  selectRightFile({ offset }: { offset: number }) {
    let index
    if (this.selectedFileIndex % offset === offset - 1) {
      index = this.selectedFileIndex - offset + 1
    } else {
      index = this.selectedFileIndex + 1
      if (index > this.filteredFiles.length - 1) {
        index = this.selectedFileIndex - (this.selectedFileIndex % offset)
      }
    }
    this.selectFileIndex({ index })
  }

  @Mutation
  selectBottomFile({ offset }: { offset: number }) {
    const index =
      this.selectedFileIndex > -1 ? this.selectedFileIndex + offset : 0
    if (index > this.filteredFiles.length - 1) {
      return
    }
    this.selectFileIndex({ index })
  }

  @Mutation
  openFile({ filepath }: { filepath: string }) {
    const file = this.getFile({ filepath })
    if (file.directory) {
      this.changeDirectory({ dirpath: file.path })
    } else {
      this.viewFile({ filepath: file.path })
    }
  }

  @Mutation
  viewFile({ filepath }: { filepath: string }) {
    const file = this.getFile({ filepath })
    if (file.directory) {
      layoutStore.showViewer({ dirpath: file.path })
    } else {
      layoutStore.showViewer({ filepath: file.path })
    }
    this.incrementFileViews({ filepath: file.path })
  }

  @Mutation
  updateFileRating({ filepath, rating }: { filepath: string; rating: number }) {
    ratingStore.setRating({ filepath, rating })
    const file = {
      rating: ratingStore.getRating({ filepath }),
    }
    this.updateFile({ filepath, file })
  }

  @Mutation
  incrementFileViews({ filepath }: { filepath: string }) {
    viewStore.incrementViews({ filepath })
    const file = {
      views: viewStore.getViews({ filepath }),
    }
    this.updateFile({ filepath, file })
  }

  @Mutation
  setScrollTop({ scrollTop }: { scrollTop: number }) {
    if (this.loading) {
      return
    }
    const history = {
      ...this.histories[this.historyIndex],
      scrollTop,
    }
    this.setHistory({ history, index: this.historyIndex })
  }

  @Mutation
  changeOrder({ order }: { order: any }) {
    this.setOrder({ order, directory: this.directory })
    this.sortFiles()
  }

  @Mutation
  changeOrderBy({ orderBy }: { orderBy: string }) {
    const descending =
      this.order.by === orderBy ? !this.order.descending : false
    const order = { by: orderBy, descending }
    this.changeOrder({ order })
  }

  @Mutation
  setDisplay({ display }: { display: string }) {
    this.setDisplay_({ display })
    this.setSelectedFilepath({ selectedFilepath: '' })
    this.setScrollTop({ scrollTop: 0 })
    this.focus()
  }

  @Mutation
  focus() {
    const target =
      this.display === 'list'
        ? selector.EXPLORER_TABLE
        : selector.EXPLORER_GRID_LIST
    layoutStore.focus({ selector: target })
  }

  @Mutation
  setDirectory({ directory }: { directory: string }) {
    this.directory = directory
  }

  @Mutation
  setDirectoryInput({ directoryInput }: { directoryInput: string }) {
    this.directoryInput = directoryInput
  }

  @Mutation
  setQuery({ query }: { query: string }) {
    this.query = query
  }

  @Mutation
  setQueryInput({ queryInput }: { queryInput: string }) {
    this.queryInput = queryInput
  }

  @Mutation
  setQueryHistories({ queryHistories }: { queryHistories: any[] }) {
    this.queryHistories = queryHistories
  }

  @Mutation
  setDisplay_({ display }: { display: string }) {
    this.display = display
  }

  @Mutation
  setLoading({ loading }: { loading: boolean }) {
    this.loading = loading
  }

  @Mutation
  setFiles({ files }: { files: any[] }) {
    this.files = files
  }

  @Mutation
  updateFile({ filepath, file }: { filepath: string; file: any }) {
    this.files = this.files.map((current) =>
      current.path !== filepath ? current : { ...current, ...file }
    )
  }

  @Mutation
  setSelectedFilepath({ selectedFilepath }: { selectedFilepath: string }) {
    this.selectedFilepath = selectedFilepath
  }

  @Mutation
  setHistory({ history, index }: { history: any; index: number }) {
    this.histories = [
      ...this.histories.slice(0, index),
      history,
      ...this.histories.slice(index + 1, this.histories.length),
    ]
  }

  @Mutation
  setHistories({ histories }: { histories: any[] }) {
    this.histories = histories
  }

  @Mutation
  setHistoryIndex({ historyIndex }: { historyIndex: number }) {
    this.historyIndex = historyIndex
  }

  @Mutation
  setOrder({ order, directory }: { order: any; directory: string }) {
    this.orders = {
      ...this.orders,
      [directory]: order,
    }
  }
}
