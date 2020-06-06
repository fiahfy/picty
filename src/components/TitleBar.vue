<template>
  <v-system-bar
    v-if="titleBar"
    class="title-bar user-select-none"
    :app="app"
    :absolute="!app"
    height="22"
    @dblclick="handleDoubleClick"
  >
    <v-spacer />
    <span class="caption text-truncate">Picty</span>
    <v-spacer />
  </v-system-bar>
</template>

<script lang="ts">
import { remote } from 'electron'
import { defineComponent } from '@vue/composition-api'

type Props = {
  app: boolean
}

export default defineComponent({
  props: {
    app: {
      type: Boolean,
      default: true,
    },
  },
  setup(_props: Props) {
    // @see https://github.com/electron/electron/issues/16385
    const handleDoubleClick = () => {
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
    }

    return {
      titleBar: true,
      handleDoubleClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.title-bar {
  padding: 0 72px;
  -webkit-app-region: drag;
}
</style>
