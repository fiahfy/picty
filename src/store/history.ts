import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

const historySize = 1000

@Module({
  name: 'history',
  stateFactory: true,
  namespaced: true,
})
export default class HistoryModule extends VuexModule {
  histories: string[] = []
  index = -1

  get canBack(): boolean {
    return this.index > 0
  }

  get canForward(): boolean {
    return this.index < this.histories.length - 1
  }

  get backHistories(): string[] {
    return this.histories.slice(0, this.index).reverse()
  }

  get forwardHistories(): string[] {
    return this.histories.slice(this.index + 1, this.histories.length)
  }

  @Action
  push({ history }: { history: string }): void {
    const index = this.index + 1
    const histories = [...this.histories.slice(0, index), history].slice(
      -1 * historySize
    )
    this.setIndex({ index })
    this.setHistories({ histories })
  }

  @Action
  go({ offset }: { offset: number }): string | undefined {
    const index = this.index + offset
    if (index < 0 || index > this.histories.length - 1) {
      return
    }
    this.setIndex({ index })
    return this.histories[this.index]
  }

  @Action
  back(): string | undefined {
    return this.go({ offset: -1 })
  }

  @Action
  forward(): string | undefined {
    return this.go({ offset: 1 })
  }

  @Mutation
  setHistories({ histories }: { histories: string[] }): void {
    this.histories = histories
  }

  @Mutation
  setIndex({ index }: { index: number }): void {
    this.index = index
  }
}
