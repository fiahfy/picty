import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'bookmark',
  stateFactory: true,
  namespaced: true,
})
export default class BookmarkModule extends VuexModule {
  bookmarks: { [filePath: string]: { createdAt: number } } = {}

  get isBookmarked() {
    return ({ filePath }: { filePath: string }) => !!this.bookmarks[filePath]
  }

  @Action
  toggleBookmarked({ filePath }: { filePath: string }) {
    if (this.isBookmarked({ filePath })) {
      this.removeBookmark({ filePath })
    } else {
      this.addBookmark({ filePath })
    }
  }

  @Mutation
  addBookmark({ filePath }: { filePath: string }) {
    this.bookmarks = {
      ...this.bookmarks,
      [filePath]: {
        createdAt: Date.now(),
      },
    }
  }

  @Mutation
  removeBookmark({ filePath }: { filePath: string }) {
    const bookmarks = { ...this.bookmarks }
    delete bookmarks[filePath]
    this.bookmarks = bookmarks
  }
}
