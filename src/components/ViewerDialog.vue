<template>
  <v-dialog
    v-model="state.active"
    class="viewer-dialog"
    content-class="viewer-dialog-content"
    transition="no-transition"
    fullscreen
    hide-overlay
    @keydown="handleKeyDown"
  >
    <v-card :class="classes" dark flat tile>
      <v-layout column fill-height>
        <title-bar :app="false" />
        <v-content class="fill-height px-0">
          <v-container fill-height fluid pa-0>
            <v-layout column>
              <v-container fluid pa-0 overflow-hidden fill-height>
                <viewer-content class="fill-height" />
              </v-container>
            </v-layout>
          </v-container>
          <v-layout class="top-overlay pb-5">
            <viewer-top-toolbar
              ref="topToolbar"
              @click-close="handleClickClose"
            />
          </v-layout>
          <v-layout class="bottom-overlay pt-5">
            <viewer-bottom-toolbar ref="bottomToolbar" />
          </v-layout>
          <v-progress-linear :active="state.loading" :indeterminate="true" />
        </v-content>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  watch,
  ref,
  onMounted,
  SetupContext,
  onUnmounted,
} from '@vue/composition-api'
import TitleBar from '~/components/TitleBar.vue'
import ViewerBottomToolbar from '~/components/ViewerBottomToolbar.vue'
import ViewerContent from '~/components/ViewerContent.vue'
import ViewerTopToolbar from '~/components/ViewerTopToolbar.vue'

export default defineComponent({
  components: {
    TitleBar,
    ViewerContent,
    ViewerBottomToolbar,
    ViewerTopToolbar,
  },
  setup(_props: {}, context: SetupContext) {
    const state = reactive<{
      active: boolean
      loading: boolean
      toolbar?: boolean
      timer?: number
    }>({
      active: false,
      loading: false,
      toolbar: undefined,
      timer: undefined,
    })

    const classes = computed(() => {
      return {
        'toolbar-hidden': state.toolbar === false,
        'toolbar-fade-in': state.toolbar === true,
        'toolbar-fade-out': state.toolbar === false,
      }
    })

    const topToolbar = ref<InstanceType<typeof ViewerTopToolbar>>(null)
    const bottomToolbar = ref<InstanceType<typeof ViewerBottomToolbar>>(null)

    const showViewer = () => {
      state.active = true
    }
    const hideViewer = () => {
      state.active = false
    }
    const clearTimer = () => {
      window.clearTimeout(state.timer)
    }
    const setTimer = () => {
      state.timer = window.setTimeout(() => {
        state.toolbar = false
        bottomToolbar.value && bottomToolbar.value.hideMenu()
      }, 2000)
    }
    const resetTimer = () => {
      clearTimer()
      if (topToolbar.value?.isHover() || bottomToolbar.value?.isHover()) {
        return
      }
      setTimer()
    }
    const showToolbar = () => {
      if (state.toolbar === false) {
        state.toolbar = true
      }
      resetTimer()
    }

    watch(
      () => state.active,
      (active) => {
        if (active) {
          showToolbar()
          document.body.addEventListener('mousemove', handleMouseMove)
          context.root.$nextTick(() => {
            const content = document.querySelector('.viewer-dialog-content')
            if (content?.parentElement instanceof HTMLElement) {
              content.parentElement.focus()
            }
          })
        } else {
          state.toolbar = undefined
          clearTimer()
          document.body.removeEventListener('mousemove', handleMouseMove)
        }
      }
    )

    onMounted(() => {
      context.root.$eventBus.$on('showViewer', showViewer)
      context.root.$eventBus.$on('hideViewer', hideViewer)
    })

    onUnmounted(() => {
      context.root.$eventBus.$off('showViewer', showViewer)
      context.root.$eventBus.$off('hideViewer', hideViewer)
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 27:
          hideViewer()
          break
        // case 37:
        //   layoutViewerStore.movePreviousFile()
        //   break
        // case 38:
        //   layoutViewerStore.movePreviousFile()
        //   break
        // case 39:
        //   layoutViewerStore.moveNextFile()
        //   break
        // case 40:
        //   layoutViewerStore.moveNextFile()
        //   break
      }
    }
    const handleMouseMove = () => {
      showToolbar()
    }
    const handleClickClose = () => {
      hideViewer()
    }

    return {
      state,
      classes,
      topToolbar,
      bottomToolbar,
      handleKeyDown,
      handleMouseMove,
      handleClickClose,
    }
  },
})
</script>

<style scoped lang="scss">
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.v-card {
  height: 100% !important;
  &.toolbar-hidden {
    .viewer-content {
      cursor: none;
    }
  }
  &.toolbar-fade-in {
    .top-overlay,
    .bottom-overlay {
      animation: fade-in 0.3s forwards;
    }
  }
  &.toolbar-fade-out {
    .top-overlay,
    .bottom-overlay {
      animation: fade-out 0.3s forwards;
    }
  }
  .top-overlay {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  .bottom-overlay {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
  }
  .v-progress-linear {
    left: 0;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
