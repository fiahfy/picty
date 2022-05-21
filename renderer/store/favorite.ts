import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppState, AppThunk } from 'store'

type State = {
  [path: string]: boolean
}

const initialState: State = {}

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    add(state, action: PayloadAction<string>) {
      return {
        ...state,
        [action.payload]: true,
      }
    },
    remove(state, action: PayloadAction<string>) {
      const newState = { ...state }
      delete newState[action.payload]
      return newState
    },
  },
})

export const { add, remove } = favoriteSlice.actions

export default favoriteSlice.reducer

export const selectFavorite = (state: AppState, path: string) =>
  state.favorite[path] ?? false

export const selectFavorites = (state: AppState) =>
  Object.keys(state.favorite).reduce(
    (carry, path) => [...carry, path],
    [] as string[]
  )

export const toggle =
  (path: string): AppThunk =>
  async (dispatch, getState) => {
    const favorite = selectFavorite(getState(), path)
    const action = favorite ? remove(path) : add(path)
    dispatch(action)
  }

// export const useFavorite = () => {
//   const state = useAppSelector((state) => state.favorite)
//   const dispatch = useAppDispatch()

//   const list = useMemo(
//     () =>
//       Object.keys(state).reduce(
//         (carry, path) => [...carry, path],
//         [] as string[]
//       ),
//     [state]
//   )

//   const isFavorited = useCallback(
//     (path: string) => state[path] ?? false,
//     [state]
//   )

//   const add = useCallback(
//     (path: string) => dispatch(actions.add(path)),
//     [dispatch]
//   )
//   const remove = useCallback(
//     (path: string) => dispatch(actions.remove(path)),
//     [dispatch]
//   )
//   const toggle = useCallback(
//     (path: string) => (isFavorited(path) ? remove(path) : add(path)),
//     [add, isFavorited, remove]
//   )

//   return { add, isFavorited, list, remove, state, toggle }
// }
