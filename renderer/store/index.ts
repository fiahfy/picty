import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import explorerReducer, { useExplorer } from './explorer'
import favoriteReducer, { useFavorite } from './favorite'
import historyReducer, { useHistory } from './history'
import ratingReducer, { useRating } from './rating'
import settingsReducer, { useSettings } from './settings'
import sortingReducer, { useSorting } from './sorting'

const reducers = combineReducers({
  explorer: explorerReducer,
  favorite: favoriteReducer,
  history: historyReducer,
  rating: ratingReducer,
  settings: settingsReducer,
  sorting: sortingReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['favorite', 'history', 'rating', 'settings', 'sorting'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    // @see https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
}

const store = makeStore()

type AppState = ReturnType<typeof store.getState>

type AppDispatch = typeof store.dispatch

export default store

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useStore = () => {
  return {
    explorer: useExplorer(),
    favorite: useFavorite(),
    history: useHistory(),
    rating: useRating(),
    settings: useSettings(),
    sorting: useSorting(),
  }
}
