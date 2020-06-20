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

  get backHistories() {
    return this.histories.slice(0, this.index).reverse()
  }

  get forwardHistories() {
    return this.histories.slice(this.index + 1, this.histories.length)
  }

  @Action
  push({ history }: { history: string }) {
    const index = this.index + 1
    const histories = [...this.histories.slice(0, index), history]
    this.setIndex({ index })
    this.setHistories({ histories })
  }

  @Action
  go({ offset }: { offset: number }) {
    const index = this.index + offset
    if (index < 0 || index > this.histories.length - 1) {
      return
    }
    this.setIndex({ index })
    return this.histories[this.index]
  }

  @Action
  back() {
    return this.go({ offset: -1 })
  }

  @Action
  forward() {
    return this.go({ offset: 1 })
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
