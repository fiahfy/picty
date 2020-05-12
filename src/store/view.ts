import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'view',
  stateFactory: true,
  namespaced: true,
})
export default class ViewModule extends VuexModule {
  views: { [filepath: string]: number } = {}

  get getViews() {
    return ({ filepath }: { filepath: string }) => this.views[filepath] || 0
  }

  @Mutation
  incrementViews({ filepath }: { filepath: string }) {
    const view = this.views[filepath] || 0
    this.views = {
      ...this.views,
      [filepath]: view + 1,
    }
  }
}
