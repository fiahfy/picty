<template>
  <v-system-bar
    v-if="titleBar"
    class="title-bar user-select-none"
    :app="app"
    height="22"
    @dblclick="handleDoubleClick"
  >
    <v-spacer />
    <span class="caption text-truncate">Picty</span>
    <v-spacer />
  </v-system-bar>
</template>

<script lang="ts">
import remote from '@electron/remote'
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  onUnmounted,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    app: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const state = reactive({
      fullScreen: false,
    })

    const titleBar = computed(() => {
      return process.platform === 'darwin' && !state.fullScreen
    })

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
    const handleFullScreenChange = () => {
      state.fullScreen = !!document.fullscreenElement
    }

    onMounted(() => {
      document.body.addEventListener('fullscreenchange', handleFullScreenChange)
    })

    onUnmounted(() => {
      document.body.removeEventListener(
        'fullscreenchange',
        handleFullScreenChange
      )
    })

    return {
      titleBar,
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
