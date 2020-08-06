<template>
  <div :class="classes" class="presentation-content d-flex">
    <v-sheet
      v-if="status !== 'loaded'"
      class="overlay d-flex flex-grow-1 fill-height align-center justify-center"
    >
      <v-progress-circular
        v-if="status === 'loading'"
        indeterminate
        color="primary"
      />
      <v-icon v-else color="grey">mdi-image-broken-variant</v-icon>
    </v-sheet>
    <div
      ref="wrapper"
      class="wrapper flex-grow-1"
      :style="{ visibility: status === 'failed' ? 'hidden' : 'visible' }"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <img
        :src="src"
        :class="imageClasses"
        :style="imageStyles"
        draggable="false"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script lang="ts">
import fileUrl from 'file-url'
import {
  defineComponent,
  computed,
  reactive,
  ref,
  watch,
  SetupContext,
} from 'nuxt-composition-api'
import { File } from '~/models'
import { settingsStore } from '~/store'

type Props = {
  loading: boolean
  scale: number
  file?: File
}

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    scale: {
      type: Number,
      default: 1,
    },
    file: {
      type: Object,
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive<{
      loading: boolean
      error: boolean
      dragging: boolean
      alignCenter: boolean
      verticalAlignMiddle: boolean
      originalSize: {
        width: number
        height: number
      }
      scrollPosition?: {
        x: number
        y: number
      }
    }>({
      loading: true,
      error: false,
      dragging: false,
      alignCenter: true,
      verticalAlignMiddle: true,
      originalSize: {
        width: 0,
        height: 0,
      },
      scrollPosition: undefined,
    })

    const classes = computed(() => ({
      dragging: state.dragging,
    }))
    const imageClasses = computed(() => ({
      'horizontal-center': state.alignCenter,
      'vertical-center': state.verticalAlignMiddle,
      stretched: settingsStore.imageStretched,
    }))
    const imageStyles = computed(() => {
      return {
        width: state.originalSize.width * props.scale + 'px',
        height: state.originalSize.height * props.scale + 'px',
      }
    })
    const status = computed(() => {
      if (props.loading || state.loading) {
        return 'loading'
      }
      if (state.error) {
        return 'failed'
      }
      return 'loaded'
    })
    const src = computed(() => (props.file ? fileUrl(props.file.path) : ''))

    const wrapper = ref<HTMLDivElement>()

    const handleMouseDown = () => {
      state.dragging = true
    }
    const handleMouseUp = () => {
      state.dragging = false
      state.scrollPosition = undefined
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (status.value !== 'loaded' || !wrapper.value) {
        return
      }
      if (state.dragging) {
        const position = { x: e.clientX, y: e.clientY }
        if (state.scrollPosition) {
          wrapper.value.scrollLeft += state.scrollPosition.x - position.x
          wrapper.value.scrollTop += state.scrollPosition.y - position.y
        }
        state.scrollPosition = position
      }
    }
    const handleLoad = (e: Event) => {
      if (!(e.target instanceof HTMLImageElement)) {
        return
      }
      const maxWidth = wrapper.value?.offsetWidth ?? 0
      const maxHeight = wrapper.value?.offsetHeight ?? 0
      const imageWidth = e.target.naturalWidth
      const imageHeight = e.target.naturalHeight
      const scaleX = maxWidth / imageWidth
      const scaleY = maxHeight / imageHeight
      let scale = scaleX < scaleY ? scaleX : scaleY
      if (scale >= 1 && !settingsStore.imageStretched) {
        scale = 1
      }
      state.originalSize = {
        width: imageWidth,
        height: imageHeight,
      }
      context.emit('change:zoom', scale)
      state.loading = false
    }
    const handleError = () => {
      state.error = true
      state.loading = false
    }

    watch(
      () => props.file,
      () => {
        state.loading = true
        state.error = false
      }
    )
    watch(
      () => props.scale,
      (newValue, oldValue) => {
        if (status.value !== 'loaded') {
          return
        }
        context.root.$nextTick(() => {
          if (!wrapper.value) {
            return
          }

          let offsetX = 0
          if (
            newValue > oldValue &&
            wrapper.value.clientWidth > state.originalSize.width * oldValue
          ) {
            offsetX =
              (wrapper.value.clientWidth -
                state.originalSize.width * oldValue) /
              2
          }
          let offsetY = 0
          if (
            newValue > oldValue &&
            wrapper.value.clientHeight > state.originalSize.height * oldValue
          ) {
            offsetY =
              (wrapper.value.clientHeight -
                state.originalSize.height * oldValue) /
              2
          }

          wrapper.value.scrollLeft +=
            ((newValue - oldValue) * state.originalSize.width) / 2 - offsetX
          wrapper.value.scrollTop +=
            ((newValue - oldValue) * state.originalSize.height) / 2 - offsetY

          state.alignCenter =
            wrapper.value.clientWidth >= state.originalSize.width * newValue
          state.verticalAlignMiddle =
            wrapper.value.clientHeight >= state.originalSize.height * newValue
        })
      }
    )

    return {
      state,
      classes,
      imageClasses,
      imageStyles,
      status,
      src,
      wrapper,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
      handleLoad,
      handleError,
    }
  },
})
</script>

<style lang="scss" scoped>
.presentation-content {
  cursor: -webkit-grab;
  &.dragging {
    cursor: -webkit-grabbing;
  }
  .overlay {
    position: absolute;
    width: 100%;
  }
  .wrapper {
    overflow: auto;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
    }
    img {
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      &.horizontal-center {
        margin-left: auto;
        margin-right: auto;
      }
      &.vertical-center {
        margin-top: auto;
        margin-bottom: auto;
      }
      &.stretched {
        height: 100%;
        object-fit: contain;
        width: 100%;
      }
    }
  }
}
</style>
