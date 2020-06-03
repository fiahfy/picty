import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'view',
  stateFactory: true,
  namespaced: true,
})
export default class ViewModule extends VuexModule {
  views: { [filePath: string]: number } = {}

  get getViews() {
    return ({ filePath }: { filePath: string }) => this.views[filePath] || 0
  }

  @Mutation
  incrementViews({ filePath }: { filePath: string }) {
    const view = this.views[filePath] || 0
    this.views = {
      ...this.views,
      [filePath]: view + 1,
    }
  }
}
