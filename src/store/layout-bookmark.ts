import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { bookmarkStore, layoutStore } from '~/store'

const reversed: { [by: string]: boolean } = {
  path: false,
  createdAt: true,
}

@Module({
  name: 'layout-bookmark',
  stateFactory: true,
  namespaced: true,
})
export default class BookmarkModule extends VuexModule {
  selectedBookmarkPath: string | undefined = undefined
  scrollTop = 0
  dialog = false
  order = {
    by: 'path',
    descending: false,
  }

  get bookmarks() {
    const { by, descending } = this.order
    return Object.keys(bookmarkStore.bookmarks)
      .map((filepath) => {
        return {
          path: filepath,
          ...bookmarkStore.bookmarks[filepath],
        }
      })
      .sort((a: any, b: any) => {
        let result = 0
        if (a[by] > b[by]) {
          result = 1
        } else if (a[by] < b[by]) {
          result = -1
        }
        if (result === 0) {
          if (a.path > b.path) {
            result = 1
          } else if (a.path < b.path) {
            result = -1
          }
        }
        result = reversed[by] ? -1 * result : result
        return descending ? -1 * result : result
      })
  }

  get canRemoveBookmark() {
    return !!this.selectedBookmarkPath
  }

  get selectedBookmarkIndex() {
    return this.bookmarks.findIndex((bookmark) =>
      this.isBookmarkSelected({ filepath: bookmark.path })
    )
  }

  get isBookmarkSelected() {
    return ({ filepath }: { filepath: string }) =>
      this.selectedBookmarkPath === filepath
  }

  @Action
  addBookmark({ filepath }: { filepath: string }) {
    bookmarkStore.addBookmark({ filepath })
    this.selectBookmark({ filepath })
  }

  @Action
  removeBookmark() {
    if (!this.selectedBookmarkPath) {
      return
    }
    const oldIndex = this.selectedBookmarkIndex
    bookmarkStore.removeBookmark({ filepath: this.selectedBookmarkPath })
    const index =
      oldIndex < this.bookmarks.length ? oldIndex : this.bookmarks.length - 1
    this.selectBookmarkIndex({ index })
  }

  @Action
  selectBookmark({ filepath }: { filepath: string }) {
    this.setSelectedBookmarkPath({ selectedBookmarkPath: filepath })
  }

  @Action
  unselectBookmark() {
    this.setSelectedBookmarkPath({ selectedBookmarkPath: undefined })
  }

  @Action
  selectBookmarkIndex({ index }: { index: number }) {
    const bookmark = this.bookmarks[index]
    if (bookmark) {
      this.selectBookmark({ filepath: bookmark.path })
    }
  }

  @Action
  selectFirstBookmark() {
    this.selectBookmarkIndex({ index: 0 })
  }

  @Action
  selectLastBookmark() {
    this.selectBookmarkIndex({ index: this.bookmarks.length - 1 })
  }

  @Action
  selectPreviousBookmark() {
    this.selectBookmarkIndex({
      index: this.selectedBookmarkIndex - 1,
    })
  }

  @Action
  selectNextBookmark() {
    this.selectBookmarkIndex({
      index: this.selectedBookmarkIndex + 1,
    })
  }

  @Action
  openBookmark({ filepath }: { filepath: string }) {
    layoutStore.openDirectory({ dirpath: filepath })
  }

  @Action
  changeOrderBy({ orderBy }: { orderBy: any }) {
    const descending =
      this.order.by === orderBy ? !this.order.descending : false
    const order = { by: orderBy, descending }
    this.setOrder({ order })
  }

  @Action
  showDialog() {
    this.setDialog({ dialog: true })
  }

  @Action
  dismissDialog() {
    this.setDialog({ dialog: false })
  }

  @Mutation
  setSelectedBookmarkPath({
    selectedBookmarkPath,
  }: {
    selectedBookmarkPath?: string
  }) {
    this.selectedBookmarkPath = selectedBookmarkPath
  }

  @Mutation
  setScrollTop({ scrollTop }: { scrollTop: number }) {
    this.scrollTop = scrollTop
  }

  @Mutation
  setOrder({ order }: { order: any }) {
    this.order = order
  }

  @Mutation
  setDialog({ dialog }: { dialog: boolean }) {
    this.dialog = dialog
  }
}
