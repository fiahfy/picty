import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'rating',
  stateFactory: true,
  namespaced: true,
})
export default class RatingModule extends VuexModule {
  ratings: { [filePath: string]: number } = {}

  get getRating() {
    return (filePath: string): number => this.ratings[filePath] || 0
  }

  @Mutation
  setRating({ rating, filePath }: { rating: number; filePath: string }): void {
    if (rating) {
      this.ratings = {
        ...this.ratings,
        [filePath]: rating,
      }
    } else {
      const ratings = { ...this.ratings }
      delete ratings[filePath]
      this.ratings = ratings
    }
  }
}
