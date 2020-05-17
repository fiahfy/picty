import { remote } from 'electron'
import { Module, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'explorer',
  stateFactory: true,
  namespaced: true,
})
export default class ExplorerModule extends VuexModule {
  dirpath = remote.app.getPath('home')

  // get isBookmarked() {
  //   return ({ filepath }: { filepath: string }) => !!this.bookmarks[filepath]
  // }

  // @Action
  // toggleBookmarked({ filepath }: { filepath: string }) {
  //   if (this.isBookmarked({ filepath })) {
  //     this.removeBookmark({ filepath })
  //   } else {
  //     this.addBookmark({ filepath })
  //   }
  // }

  // @Mutation
  // addBookmark({ filepath }: { filepath: string }) {
  //   this.bookmarks = {
  //     ...this.bookmarks,
  //     [filepath]: {
  //       createdAt: Date.now(),
  //     },
  //   }
  // }

  // @Mutation
  // removeBookmark({ filepath }: { filepath: string }) {
  //   const bookmarks = { ...this.bookmarks }
  //   delete bookmarks[filepath]
  //   this.bookmarks = bookmarks
  // }
}
