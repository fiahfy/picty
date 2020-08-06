import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

type ListStyle = 'list' | 'thumbnail'

@Module({
  name: 'explorer',
  stateFactory: true,
  namespaced: true,
})
export default class ExplorerModule extends VuexModule {
  location = ''
  listStyle: ListStyle = 'list'

  @Mutation
  setLocation({ location }: { location: string }): void {
    this.location = location
  }

  @Mutation
  setListStyle({ listStyle }: { listStyle: ListStyle }): void {
    this.listStyle = listStyle
  }
}
