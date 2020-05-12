import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'rating',
  stateFactory: true,
  namespaced: true,
})
export default class RatingModule extends VuexModule {
  ratings: { [filepath: string]: number } = {}

  get getRating() {
    return ({ filepath }: { filepath: string }) => this.ratings[filepath] || 0
  }

  @Mutation
  setRating({ filepath, rating }: { filepath: string; rating: number }) {
    if (rating) {
      this.ratings = {
        ...this.ratings,
        [filepath]: rating,
      }
    } else {
      const ratings = { ...this.ratings }
      delete ratings[filepath]
      this.ratings = ratings
    }
  }
}
