import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import store from 'store'

type Props = { children: ReactNode }

export const StoreProvider = (props: Props) => {
  const { children } = props

  const persistor = persistStore(store)

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  )
}
