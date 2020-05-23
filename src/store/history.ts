import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'history',
  stateFactory: true,
  namespaced: true,
})
export default class HistoryModule extends VuexModule {
  histories: string[] = []
  index = -1

  get canBack() {
    return this.index > 0
  }

  get canForward() {
    return this.index < this.histories.length - 1
  }

  @Action
  push(history: string) {
    const index = this.index + 1
    const histories = [...this.histories.slice(0, index), history]
    this.setIndex({ index })
    this.setHistories({ histories })
  }

  @Action
  back() {
    if (this.index <= 0) {
      return
    }
    const index = this.index - 1
    this.setIndex({ index })
    return this.histories[this.index]
  }

  @Action
  forward() {
    if (this.index >= this.histories.length - 1) {
      return
    }
    const index = this.index + 1
    this.setIndex({ index })
    return this.histories[this.index]
  }

  @Mutation
  setHistories({ histories }: { histories: string[] }) {
    this.histories = histories
  }

  @Mutation
  setIndex({ index }: { index: number }) {
    this.index = index
  }
}
