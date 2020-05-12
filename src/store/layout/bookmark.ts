import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { bookmarkStore, layoutStore } from '~/store'

const reversed: { [by: string]: boolean } = {
  path: false,
  createdAt: true,
}

@Module({
  name: 'bookmark',
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

  @Mutation
  addBookmark({ filepath }: { filepath: string }) {
    bookmarkStore.addBookmark({ filepath })
    this.selectBookmark({ filepath })
  }

  @Mutation
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

  @Mutation
  selectBookmark({ filepath }: { filepath: string }) {
    this.setSelectedBookmarkPath({ selectedBookmarkPath: filepath })
  }

  @Mutation
  unselectBookmark() {
    this.setSelectedBookmarkPath({ selectedBookmarkPath: undefined })
  }

  @Mutation
  selectBookmarkIndex({ index }: { index: number }) {
    const bookmark = this.bookmarks[index]
    if (bookmark) {
      this.selectBookmark({ filepath: bookmark.path })
    }
  }

  @Mutation
  selectFirstBookmark() {
    this.selectBookmarkIndex({ index: 0 })
  }

  @Mutation
  selectLastBookmark() {
    this.selectBookmarkIndex({ index: this.bookmarks.length - 1 })
  }

  @Mutation
  selectPreviousBookmark() {
    this.selectBookmarkIndex({
      index: this.selectedBookmarkIndex - 1,
    })
  }

  @Mutation
  selectNextBookmark() {
    this.selectBookmarkIndex({
      index: this.selectedBookmarkIndex + 1,
    })
  }

  @Mutation
  openBookmark({ filepath }: { filepath: string }) {
    layoutStore.openDirectory({ dirpath: filepath })
  }

  @Mutation
  changeOrderBy({ orderBy }: { orderBy: any }) {
    const descending =
      this.order.by === orderBy ? !this.order.descending : false
    const order = { by: orderBy, descending }
    this.setOrder({ order })
  }

  @Mutation
  showDialog() {
    this.setDialog({ dialog: true })
  }

  @Mutation
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
