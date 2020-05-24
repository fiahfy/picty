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
              :file="state.currentFile"
              @click-close="handleClickClose"
            />
          </v-layout>
          <v-layout class="bottom-overlay pt-5">
            <viewer-bottom-toolbar
              ref="bottomToolbar"
              :page="page"
              :max-page="maxPage"
              :scale="state.scale"
              @click-previous="handleClickPrevious"
              @click-next="handleClickNext"
              @click-zoom-in="handleClickZoomIn"
              @click-zoom-out="handleClickZoomOut"
              @click-zoom-reset="handleClickZoomReset"
              @click-toggle-full-screen="handleClickToggleFullScreen"
              @change-page="handleChangePage"
            />
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
import { settingsStore } from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/file.worker.js')

const worker = workerPromisify(new Worker())

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
      target?: any
      files: any[]
      currentFile?: any
      error?: Error
      scale: number
    }>({
      active: false,
      loading: false,
      toolbar: undefined,
      timer: undefined,
      target: unescape,
      files: [],
      currentFile: undefined,
      error: undefined,
      scale: 1,
    })

    const classes = computed(() => {
      return {
        'toolbar-hidden': state.toolbar === false,
        'toolbar-fade-in': state.toolbar === true,
        'toolbar-fade-out': state.toolbar === false,
      }
    })
    const page = computed(
      () =>
        state.files.findIndex((file) => file.path === state.currentFile.path) +
        1
    )
    const maxPage = computed(() => state.files.length)

    const topToolbar = ref<InstanceType<typeof ViewerTopToolbar>>(null)
    const bottomToolbar = ref<InstanceType<typeof ViewerBottomToolbar>>(null)

    const showViewer = (file: any) => {
      state.active = true
      state.target = file
      load()
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
    const load = async () => {
      if (state.loading) {
        return
      }
      state.loading = true
      state.files = []
      state.currentFile = undefined
      state.error = undefined
      try {
        let files = []
        if (state.target.directory) {
          const { data } = await worker.postMessage({
            method: 'listFiles',
            args: [state.target.path, { recursive: settingsStore.recursive }],
          })
          files = data
        } else {
          const { data } = await worker.postMessage({
            method: 'listFiles',
            args: [state.target.dirpath],
          })
          files = data
          state.currentFile = state.target
        }
        state.files = files.filter((file: any) =>
          settingsStore.isFileAvailable({ filepath: file.path })
        )
        if (!state.currentFile) {
          state.currentFile = state.files[0]
        }
      } catch (e) {
        state.error = e
      }
      state.loading = false
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
    const handleClickPrevious = () => {
      let newPage = page.value - 1
      if (newPage <= 1) {
        newPage = maxPage.value
      }
      state.currentFile = state.files[newPage - 1]
    }
    const handleClickNext = () => {
      let newPage = page.value + 1
      if (newPage >= maxPage.value) {
        newPage = 1
      }
      state.currentFile = state.files[newPage - 1]
    }
    const handleClickZoomIn = () => {
      state.scale = 1
    }
    const handleClickZoomOut = () => {
      state.scale = 1
    }
    const handleClickZoomReset = () => {
      state.scale = 1
    }
    const handleClickToggleFullScreen = () => {
      //
    }
    const handleChangePage = (page: number) => {
      if (page < 1 || page > maxPage.value) {
        return
      }
      state.currentFile = state.files[page - 1]
    }

    return {
      state,
      classes,
      page,
      maxPage,
      topToolbar,
      bottomToolbar,
      handleKeyDown,
      handleMouseMove,
      handleClickClose,
      handleClickPrevious,
      handleClickNext,
      handleClickZoomIn,
      handleClickZoomOut,
      handleClickZoomReset,
      handleClickToggleFullScreen,
      handleChangePage,
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
