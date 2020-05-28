import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import bookmark from '~/store/bookmark'
import explorer from '~/store/explorer'
import history from '~/store/history'
import queryHistory from '~/store/query-history'
import rating from '~/store/rating'
import settings from '~/store/settings'
import view from '~/store/view'

/* eslint-disable import/no-mutable-exports */
let bookmarkStore: bookmark
let explorerStore: explorer
let historyStore: history
let queryHistoryStore: queryHistory
let ratingStore: rating
let settingsStore: settings
let viewStore: view
/* eslint-enable import/no-mutable-exports */

function initializeStores(store: Store<any>): void {
  bookmarkStore = getModule(bookmark, store)
  explorerStore = getModule(explorer, store)
  historyStore = getModule(history, store)
  queryHistoryStore = getModule(queryHistory, store)
  ratingStore = getModule(rating, store)
  settingsStore = getModule(settings, store)
  viewStore = getModule(view, store)
}

export {
  initializeStores,
  bookmarkStore,
  explorerStore,
  historyStore,
  queryHistoryStore,
  ratingStore,
  settingsStore,
  viewStore,
}
