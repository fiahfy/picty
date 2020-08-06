import { Store } from 'vuex'
import { initializeStores } from '~/utils/store-accessor'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializer = (store: Store<any>): void => initializeStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'
