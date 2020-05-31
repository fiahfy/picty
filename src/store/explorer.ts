import { remote } from 'electron'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'explorer',
  stateFactory: true,
  namespaced: true,
})
export default class ExplorerModule extends VuexModule {
  location = remote.app.getPath('home')
  listStyle = 'list'

  @Mutation
  setLocation({ location }: { location: string }) {
    this.location = location
  }

  @Mutation
  setListStyle({ listStyle }: { listStyle: string }) {
    this.listStyle = listStyle
  }
}
