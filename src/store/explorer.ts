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
  setLocation(location: string) {
    this.location = location
  }

  @Mutation
  setListStyle(listStyle: ListStyle) {
    this.listStyle = listStyle
  }
}
