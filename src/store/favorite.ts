import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'favorite',
  stateFactory: true,
  namespaced: true,
})
export default class BookmarkModule extends VuexModule {
  favorites: { [filePath: string]: { createdAt: number } } = {}

  get isFavorite() {
    return (filePath: string) => !!this.favorites[filePath]
  }

  get favoritesAll() {
    return Object.keys(this.favorites).map((filePath: string) => {
      return {
        path: filePath,
      }
    })
  }

  @Action
  toggleFavorite(filePath: string) {
    if (this.isFavorite(filePath)) {
      this.dislike(filePath)
    } else {
      this.like(filePath)
    }
  }

  @Mutation
  like(filePath: string) {
    this.favorites = {
      ...this.favorites,
      [filePath]: {
        createdAt: Date.now(),
      },
    }
  }

  @Mutation
  dislike(filePath: string) {
    const bookmarks = { ...this.favorites }
    delete bookmarks[filePath]
    this.favorites = bookmarks
  }
}
