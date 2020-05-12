<template>
  <v-system-bar
    v-if="titleBar"
    class="title-bar user-select-none"
    :app="app"
    :absolute="!app"
    height="22"
    @dblclick="onDoubleClick"
  >
    <v-spacer />
    <span class="caption text-truncate">Picty</span>
    <v-spacer />
  </v-system-bar>
</template>

<script>
import { remote } from 'electron'
import { layoutStore } from '~/store'

export default {
  props: {
    app: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    titleBar() {
      return layoutStore.titleBar
    },
  },
  methods: {
    // @see https://github.com/electron/electron/issues/16385
    onDoubleClick() {
      const doubleClickAction = remote.systemPreferences.getUserDefault(
        'AppleActionOnDoubleClick',
        'string'
      )
      const win = remote.getCurrentWindow()
      if (doubleClickAction === 'Minimize') {
        win.minimize()
      } else if (doubleClickAction === 'Maximize') {
        if (win.isMaximized()) {
          win.unmaximize()
        } else {
          win.maximize()
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title-bar {
  padding: 0 72px;
  -webkit-app-region: drag;
}
</style>
