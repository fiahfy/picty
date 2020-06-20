import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { settingsStore } from '~/store'

@Module({
  name: 'query-history',
  stateFactory: true,
  namespaced: true,
})
export default class QueryHistoryModule extends VuexModule {
  histories: string[] = []

  @Mutation
  addHistory({ history }: { history: string }) {
    const exists = this.histories.includes(history)
    if (!history || exists) {
      return
    }
    this.histories = [...this.histories, history].slice(
      -settingsStore.queryHistorySize
    )
  }

  @Mutation
  removeHistory({ history }: { history: string }) {
    this.histories = this.histories
      .filter((item) => item !== history)
      .slice(-settingsStore.queryHistorySize)
  }

  @Mutation
  clearHistory() {
    this.histories = []
  }
}
