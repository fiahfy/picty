<template>
  <v-dialog
    ref="dialog"
    v-model="state.active"
    :transition="false"
    class="presentation-dialog"
    content-class="presentation-dialog-content"
    fullscreen
    hide-overlay
    eager
  >
    <v-card :class="classes" dark flat tile>
      <v-layout column fill-height>
        <title-bar :app="false" />
        <v-content class="fill-height px-0">
          <v-container fill-height fluid pa-0>
            <v-layout column>
              <v-container fluid pa-0 overflow-hidden fill-height>
                <presentation-content
                  class="fill-height"
                  :loading="state.loading"
                  :scale="state.scale"
                  :file="state.current"
                  @change-zoom="handleChangeZoom"
                />
              </v-container>
            </v-layout>
          </v-container>
          <v-layout class="top-overlay pb-5">
            <presentation-top-toolbar
              ref="topToolbar"
              :file="state.current"
              @click-close="handleClickClose"
            />
          </v-layout>
          <v-layout class="bottom-overlay pt-5">
            <presentation-bottom-toolbar
              ref="bottomToolbar"
              :page="page"
              :max-page="maxPage"
              :scale="state.scale"
              :full-screen="state.fullScreen"
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
import { promisify } from '@fiahfy/worker-promisify'
import TitleBar from '~/components/TitleBar.vue'
import PresentationBottomToolbar from '~/components/PresentationBottomToolbar.vue'
import PresentationContent from '~/components/PresentationContent.vue'
import PresentationTopToolbar from '~/components/PresentationTopToolbar.vue'
import { File } from '~/models'
import { settingsStore } from '~/store'

const Worker = require('~/workers/fetch-files.worker')

const worker = promisify(new Worker())

const scales = [
  0.25,
  0.33,
  0.5,
  0.67,
  0.75,
  0.8,
  0.9,
  1,
  1.1,
  1.25,
  1.5,
  1.75,
  2,
  2.5,
  3,
  4,
  5,
]

export default defineComponent({
  components: {
    TitleBar,
    PresentationContent,
    PresentationBottomToolbar,
    PresentationTopToolbar,
  },
  setup(_props: {}, context: SetupContext) {
    const state = reactive<{
      active: boolean
      loading: boolean
      error?: Error
      files: File[]
      current?: File
      target?: File
      toolbar?: boolean
      timer?: number
      scale: number
      originalScale: number
      fullScreen: boolean
    }>({
      active: false,
      loading: false,
      error: undefined,
      files: [],
      current: undefined,
      target: undefined,
      toolbar: undefined,
      timer: undefined,
      scale: 1,
      originalScale: 1,
      fullScreen: false,
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
        state.files.findIndex((file) => file.path === state.current?.path) + 1
    )
    const maxPage = computed(() => state.files.length)

    const dialog = ref<Vue>(null)
    const topToolbar = ref<InstanceType<typeof PresentationTopToolbar>>(null)
    const bottomToolbar = ref<InstanceType<typeof PresentationBottomToolbar>>(
      null
    )

    const showPresentation = async (file: File) => {
      state.active = true
      state.target = file
      if (settingsStore.fullScreen) {
        dialog.value && (await dialog.value?.$el.requestFullscreen())
      }
      load()
    }
    const hidePresentation = async () => {
      document.fullscreenElement && (await document.exitFullscreen())
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
      if (state.loading || !state.target) {
        return
      }
      state.loading = true
      state.files = []
      state.current = undefined
      state.error = undefined
      try {
        let files = []
        if (state.target.directory) {
          const { data }: { data: File[] } = await worker.postMessage({
            dirPath: state.target.path,
            recursive: settingsStore.recursive,
          })
          files = data
        } else {
          const { data }: { data: File[] } = await worker.postMessage({
            dirPath: state.target.parent,
          })
          files = data
          state.current = state.target
        }
        state.files = files.filter((file) =>
          settingsStore.isFileAvailable(file.path)
        )
        if (!state.current) {
          state.current = state.files[0]
        }
      } catch (e) {
        state.error = e
      }
      state.loading = false
    }
    const movePrevious = () => {
      let newPage = page.value - 1
      if (newPage < 1) {
        newPage = maxPage.value
      }
      state.current = state.files[newPage - 1]
    }
    const movekNext = () => {
      let newPage = page.value + 1
      if (newPage > maxPage.value) {
        newPage = 1
      }
      state.current = state.files[newPage - 1]
    }

    const handleFullScreenChange = () => {
      state.fullScreen = !!document.fullscreenElement
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          return hidePresentation()
        case 'ArrowLeft':
        case 'ArrowUp':
          return movePrevious()
        case 'ArrowRight':
        case 'ArrowDown':
          return movekNext()
      }
    }
    const handleMouseMove = () => {
      showToolbar()
    }
    const handleClickClose = () => {
      hidePresentation()
    }
    const handleClickPrevious = () => {
      movePrevious()
    }
    const handleClickNext = () => {
      movekNext()
    }
    const handleClickZoomIn = () => {
      state.scale = scales.find((scale) => scale > state.scale) ?? state.scale
    }
    const handleClickZoomOut = () => {
      state.scale =
        scales
          .concat()
          .reverse()
          .find((scale) => scale < state.scale) ?? state.scale
    }
    const handleClickZoomReset = () => {
      state.scale = state.originalScale
    }
    const handleClickToggleFullScreen = async () => {
      if (state.fullScreen) {
        await document.exitFullscreen()
      } else {
        dialog.value && (await dialog.value?.$el.requestFullscreen())
      }
    }
    const handleChangePage = (page: number) => {
      if (page < 1 || page > maxPage.value) {
        return
      }
      state.current = state.files[page - 1]
    }
    const handleChangeZoom = (scale: number) => {
      state.scale = scale
      state.originalScale = scale
    }

    watch(
      () => state.active,
      (active) => {
        if (active) {
          showToolbar()
          document.body.addEventListener('mousemove', handleMouseMove)
          context.root.$nextTick(() => {
            const content = document.querySelector(
              '.presentation-dialog-content'
            )
            if (content?.parentElement instanceof HTMLElement) {
              content.parentElement.focus()
            }
          })
        } else {
          state.toolbar = undefined
          clearTimer()
          document.body.removeEventListener('mousemove', handleMouseMove)
          context.root.$eventBus.$emit('focus-explorer')
        }
      }
    )

    onMounted(() => {
      document.body.addEventListener('keydown', handleKeyDown)
      document.body.addEventListener('fullscreenchange', handleFullScreenChange)
      context.root.$eventBus.$on('show-presentation', showPresentation)
      context.root.$eventBus.$on('hide-resentation', hidePresentation)
    })

    onUnmounted(() => {
      document.body.removeEventListener('keydown', handleKeyDown)
      document.body.removeEventListener(
        'fullscreenchange',
        handleFullScreenChange
      )
      context.root.$eventBus.$off('show-presentation', showPresentation)
      context.root.$eventBus.$off('hide-presentation', hidePresentation)
    })

    return {
      state,
      classes,
      page,
      maxPage,
      dialog,
      topToolbar,
      bottomToolbar,
      handleClickClose,
      handleClickPrevious,
      handleClickNext,
      handleClickZoomIn,
      handleClickZoomOut,
      handleClickZoomReset,
      handleClickToggleFullScreen,
      handleChangePage,
      handleChangeZoom,
    }
  },
})
</script>

<style lang="scss" scoped>
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
    .presentation-content {
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
