import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'query-history',
  stateFactory: true,
  namespaced: true,
})
export default class QueryHistoryModule extends VuexModule {
  histories: string[] = []

  @Mutation
  addHistory({ history }: { history: string }) {
    this.histories = [...this.histories, history]
  }

  @Mutation
  removeHistory({ history }: { history: string }) {
    this.histories = this.histories.filter((item) => item !== history)
  }
}
