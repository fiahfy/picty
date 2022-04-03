import { useCallback, useMemo } from 'react'
import { useStore as useHistoryStore } from 'store/history'
import { useStore as useRatingStore } from 'store/rating'
import { useStore as useSettingsStore } from 'store/settings'
import { useStore as useSortingStore } from 'store/sorting'

export const useStore = () => {
  const historyStore = useHistoryStore()
  const ratingStore = useRatingStore()
  const settingsStore = useSettingsStore()
  const sortingStore = useSortingStore()

  const state = useMemo(
    () => ({
      history: historyStore.state,
      rating: ratingStore.state,
      settings: settingsStore.state,
      sorting: sortingStore.state,
    }),
    [
      historyStore.state,
      ratingStore.state,
      settingsStore.state,
      sortingStore.state,
    ]
  )

  const setState = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => {
      historyStore.setState.call(null, state.history)
      ratingStore.setState.call(null, state.rating)
      settingsStore.setState.call(null, state.settings)
      sortingStore.setState.call(null, state.sorting)
    },
    [
      historyStore.setState,
      ratingStore.setState,
      settingsStore.setState,
      sortingStore.setState,
    ]
  )

  const store = {
    history: historyStore,
    rating: ratingStore,
    settings: settingsStore,
    sorting: sortingStore,
    setState,
    state,
  }

  return store
}
