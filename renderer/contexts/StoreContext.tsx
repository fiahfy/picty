import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import store, { useStore as useOriginalStore } from 'store'

type Props = { children: ReactNode }

export const StoreProvider = (props: Props) => {
  const { children } = props

  const persistor = persistStore(store)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export const useStore = () => useOriginalStore()
