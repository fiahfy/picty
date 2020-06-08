import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import explorer from '~/store/explorer'
import favorite from '~/store/favorite'
import history from '~/store/history'
import queryHistory from '~/store/query-history'
import rating from '~/store/rating'
import settings from '~/store/settings'

/* eslint-disable import/no-mutable-exports */
let explorerStore: explorer
let favoriteStore: favorite
let historyStore: history
let queryHistoryStore: queryHistory
let ratingStore: rating
let settingsStore: settings
/* eslint-enable import/no-mutable-exports */

function initializeStores(store: Store<any>): void {
  explorerStore = getModule(explorer, store)
  favoriteStore = getModule(favorite, store)
  historyStore = getModule(history, store)
  queryHistoryStore = getModule(queryHistory, store)
  ratingStore = getModule(rating, store)
  settingsStore = getModule(settings, store)
}

export {
  initializeStores,
  explorerStore,
  favoriteStore,
  historyStore,
  queryHistoryStore,
  ratingStore,
  settingsStore,
}
