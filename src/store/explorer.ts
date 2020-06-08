import { remote } from 'electron'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

type ListStyle = 'list' | 'thumbnail'

@Module({
  name: 'explorer',
  stateFactory: true,
  namespaced: true,
})
export default class ExplorerModule extends VuexModule {
  location = remote.app.getPath('home')
  listStyle: ListStyle = 'list'

  @Mutation
  setLocation({ location }: { location: string }) {
    this.location = location
  }

  @Mutation
  setListStyle({ listStyle }: { listStyle: ListStyle }) {
    this.listStyle = listStyle
  }
}
