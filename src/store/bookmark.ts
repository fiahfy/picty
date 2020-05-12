import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'bookmark',
  stateFactory: true,
  namespaced: true,
})
export default class BookmarkModule extends VuexModule {
  bookmarks: { [filepath: string]: { createdAt: number } } = {}

  get isBookmarked() {
    return ({ filepath }: { filepath: string }) => !!this.bookmarks[filepath]
  }

  @Mutation
  toggleBookmarked({ filepath }: { filepath: string }) {
    if (this.isBookmarked({ filepath })) {
      this.removeBookmark({ filepath })
    } else {
      this.addBookmark({ filepath })
    }
  }

  @Mutation
  addBookmark({ filepath }: { filepath: string }) {
    this.bookmarks = {
      ...this.bookmarks,
      [filepath]: {
        createdAt: Date.now(),
      },
    }
  }

  @Mutation
  removeBookmark({ filepath }: { filepath: string }) {
    const bookmarks = { ...this.bookmarks }
    delete bookmarks[filepath]
    this.bookmarks = bookmarks
  }
}
