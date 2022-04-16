import { useCallback, useMemo } from 'react'
import { useStore as useExplorerStore } from 'store/explorer'
import { useStore as useFavoriteStore } from 'store/favorite'
import { useStore as useHistoryStore } from 'store/history'
import { useStore as useRatingStore } from 'store/rating'
import { useStore as useSettingsStore } from 'store/settings'
import { useStore as useSortingStore } from 'store/sorting'

export const useStore = () => {
  const explorerStore = useExplorerStore()
  const favoriteStore = useFavoriteStore()
  const historyStore = useHistoryStore()
  const ratingStore = useRatingStore()
  const settingsStore = useSettingsStore()
  const sortingStore = useSortingStore()

  const state = useMemo(
    () => ({
      // explorer: explorerStore.state,
      favorite: favoriteStore.state,
      history: historyStore.state,
      rating: ratingStore.state,
      settings: settingsStore.state,
      sorting: sortingStore.state,
    }),
    [
      // explorerStore.state,
      favoriteStore.state,
      historyStore.state,
      ratingStore.state,
      settingsStore.state,
      sortingStore.state,
    ]
  )

  const setState = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => {
      // @see https://github.com/facebook/react/issues/16265#issuecomment-1048648676
      // explorerStore.setState.call(null, state.explorer)
      favoriteStore.setState.call(null, state.favorite)
      historyStore.setState.call(null, state.history)
      ratingStore.setState.call(null, state.rating)
      settingsStore.setState.call(null, state.settings)
      sortingStore.setState.call(null, state.sorting)
    },
    [
      // explorerStore.setState,
      favoriteStore.setState,
      historyStore.setState,
      ratingStore.setState,
      settingsStore.setState,
      sortingStore.setState,
    ]
  )

  const store = {
    explorer: explorerStore,
    favorite: favoriteStore,
    history: historyStore,
    rating: ratingStore,
    settings: settingsStore,
    sorting: sortingStore,
    setState,
    state,
  }

  return store
}
