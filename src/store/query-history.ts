import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

const historySize = 1000

@Module({
  name: 'query-history',
  stateFactory: true,
  namespaced: true,
})
export default class QueryHistoryModule extends VuexModule {
  histories: string[] = []

  @Mutation
  add({ history }: { history: string }) {
    const exists = this.histories.includes(history)
    if (!history || exists) {
      return
    }
    this.histories = [...this.histories, history].slice(-1 * historySize)
  }

  @Mutation
  delete({ history }: { history: string }) {
    this.histories = this.histories.filter((item) => item !== history)
  }
}
