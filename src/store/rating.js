export default {
  namespaced: true,
  state: {
    ratings: {}
  },
  getters: {
    getRating (state) {
      return ({ filepath }) => state.ratings[filepath] || 0
    }
  },
  mutations: {
    setRating (state, { rating, filepath }) {
      if (!rating) {
        state.ratings = Object.keys(state.ratings)
          .filter((key) => key !== filepath)
          .reduce((carry, key) => {
            carry[key] = state.ratings[key]
            return carry
          }, {})
        return
      }
      state.ratings = {
        ...state.ratings,
        [filepath]: rating
      }
    }
  }
}
