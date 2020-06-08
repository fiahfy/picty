import { Plugin } from '@nuxt/types'
import { open } from '@fiahfy/electron-context-menu'

const contextMenu = { open }

declare module 'vue/types/vue' {
  interface Vue {
    $contextMenu: typeof contextMenu
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $contextMenu: typeof contextMenu
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $contextMenu: typeof contextMenu
  }
}

const contextMenuPlugin: Plugin = (_ctx, inject) => {
  inject('contextMenu', contextMenu)
}

export default contextMenuPlugin
