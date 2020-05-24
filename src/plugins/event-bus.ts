import { Plugin } from '@nuxt/types'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $eventBus: Vue
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $eventBus: Vue
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $eventBus: Vue
  }
}

const eventBus = new Vue()

const eventBusPlugin: Plugin = (_ctx, inject) => {
  inject('eventBus', eventBus)
}

export default eventBusPlugin
