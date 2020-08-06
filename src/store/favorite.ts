import path from 'path'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'favorite',
  stateFactory: true,
  namespaced: true,
})
export default class BookmarkModule extends VuexModule {
  favorites: { [filePath: string]: { createdAt: number } } = {}

  get isFavorite() {
    return (filePath: string): boolean => !!this.favorites[filePath]
  }

  get favoritesAll(): { path: string; name: string }[] {
    return Object.keys(this.favorites)
      .map((filePath: string) => {
        return {
          path: filePath,
          name: path.basename(filePath),
        }
      })
      .sort((a, b) => {
        return a.name < b.name ? -1 : 1
      })
  }

  @Action
  toggle({ filePath }: { filePath: string }): void {
    if (this.isFavorite(filePath)) {
      this.delete({ filePath })
    } else {
      this.add({ filePath })
    }
  }

  @Mutation
  add({ filePath }: { filePath: string }): void {
    this.favorites = {
      ...this.favorites,
      [filePath]: {
        createdAt: Date.now(),
      },
    }
  }

  @Mutation
  delete({ filePath }: { filePath: string }): void {
    const bookmarks = { ...this.favorites }
    delete bookmarks[filePath]
    this.favorites = bookmarks
  }
}
