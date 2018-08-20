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
  actions: {
    setRating ({ commit, state }, { filepath, rating }) {
      if (rating) {
        const ratings = {
          ...state.ratings,
          [filepath]: rating
        }
        commit('setRatings', { ratings })
      } else {
        const ratings = Object.keys(state.ratings)
          .filter((key) => key !== filepath)
          .reduce((carry, key) => {
            carry[key] = state.ratings[key]
            return carry
          }, {})
        commit('setRatings', { ratings })
      }
    }
  },
  mutations: {
    setRatings (state, { ratings }) {
      state.ratings = ratings
    }
  }
}
