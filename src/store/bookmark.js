export const state = () => ({
  bookmarks: {},
})

export const getters = {
  isBookmarked(state) {
    return ({ filepath }) => !!state.bookmarks[filepath]
  },
}

export const actions = {
  toggleBookmarked({ commit, getters }, { filepath }) {
    if (getters.isBookmarked({ filepath })) {
      commit('removeBookmark', { filepath })
    } else {
      commit('addBookmark', { filepath })
    }
  },
}

export const mutations = {
  addBookmark(state, { filepath }) {
    state.bookmarks = {
      ...state.bookmarks,
      [filepath]: {
        added_at: new Date(),
      },
    }
  },
  removeBookmark(state, { filepath }) {
    state.bookmarks = Object.keys(state.bookmarks)
      .filter((key) => key !== filepath)
      .reduce((carry, key) => {
        carry[key] = state.bookmarks[key]
        return carry
      }, {})
  },
}
