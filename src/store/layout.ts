import { remote } from 'electron'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import pkg from '~~/package.json'
import { settingsStore, layoutExplorerStore, layoutViewerStore } from '~/store'

const fileUtil = require('~/utils/file')

@Module({
  name: 'layout',
  stateFactory: true,
  namespaced: true,
})
export default class LayoutModule extends VuexModule {
  title = pkg.productName
  message: any = undefined
  fullScreen = false
  viewing = false

  get titleBar() {
    return process.platform === 'darwin' && !this.fullScreen
  }

  @Action
  initialize() {
    layoutExplorerStore.initialize()
  }

  @Action
  open({ filepath }: { filepath: string }) {
    const file = fileUtil.getFile(filepath)
    if (file.directory) {
      this.openDirectory({ dirpath: file.path })
    }
  }

  @Action
  openDirectory({ dirpath }: { dirpath: string }) {
    layoutExplorerStore.changeDirectory({ dirpath })
    // @ts-ignore
    this.$router.push('/explorer')
  }

  @Action
  showViewer(payload: any) {
    layoutViewerStore.loadFiles(payload)
    this.setViewing({ viewing: true })
    if (settingsStore.fullScreen) {
      this.enterFullScreen()
    }
  }

  @Action
  dismissViewer() {
    if (layoutViewerStore.loading) {
      return
    }
    if (settingsStore.fullScreen || process.platform !== 'darwin') {
      this.leaveFullScreen()
    }
    this.setViewing({ viewing: false })
    layoutExplorerStore.focus()
  }

  @Action
  enterFullScreen() {
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(true)
    browserWindow.setMenuBarVisibility(false)
  }

  @Action
  leaveFullScreen() {
    const browserWindow = remote.getCurrentWindow()
    browserWindow.setFullScreen(false)
    browserWindow.setMenuBarVisibility(true)
  }

  @Action
  focus({ selector }: { selector: string }) {
    const el = document.querySelector<HTMLInputElement>(selector)
    if (el) {
      el.focus()
    }
  }

  @Action
  select({ selector }: { selector: string }) {
    const el = document.querySelector<HTMLInputElement>(selector)
    if (el) {
      el.select()
    }
  }

  @Action
  showMessage(message: any) {
    this.setMessage({ message })
  }

  @Mutation
  setMessage({ message }: { message: any }) {
    this.message = message
  }

  @Mutation
  setFullScreen({ fullScreen }: { fullScreen: boolean }) {
    this.fullScreen = fullScreen
  }

  @Mutation
  setViewing({ viewing }: { viewing: boolean }) {
    this.viewing = viewing
  }
}
