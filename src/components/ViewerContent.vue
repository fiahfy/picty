<template>
  <v-container :class="classes" class="viewer-content" fluid pa-0>
    <v-layout fill-height>
      <v-flex v-if="message">
        <v-layout fill-height align-center justify-center>
          <v-flex text-center body-1>{{ message }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        v-else
        ref="wrapper"
        class="wrapper"
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
      </v-flex>
    </v-layout>
  </v-container>
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
} from '@vue/composition-api'
import { Item } from '~/models'
import { settingsStore } from '~/store'

type Props = {
  loading: boolean
  scale: number
  item: Item
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
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive<{
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
      error: false,
      dragging: false,
      alignCenter: true,
      verticalAlignMiddle: true,
      originalSize: {
        width: 0,
        height: 0,
      },
      scrollPosition: {
        x: 0,
        y: 0,
      },
    })

    const classes = computed(() => ({
      dragging: state.dragging,
    }))
    const imageClasses = computed(() => ({
      'horizontal-center': state.alignCenter,
      'vertical-center': state.verticalAlignMiddle,
      // scaling: props.scale !== 1,
      // scaling: layoutViewerStore.scaling,
      stretched: settingsStore.imageStretched,
    }))
    const imageStyles = computed(() => {
      return {
        width: state.originalSize.width * props.scale + 'px',
        height: state.originalSize.height * props.scale + 'px',
      }
    })
    const message = computed(() => {
      if (props.loading) {
        return 'Loading...'
      }
      // if (!layoutViewerStore.files.length) {
      //   return 'No images'
      // }
      if (state.error) {
        return 'Invalid image'
      }
      // return layoutViewerStore.error ? layoutViewerStore.error.message : ''
      return ''
    })
    const src = computed(() => (props.item ? fileUrl(props.item.path) : ''))

    const wrapper = ref<HTMLDivElement>(null)

    watch(
      () => props.item,
      () => {
        state.error = false
      }
    )
    watch(
      () => props.scale,
      (newValue, oldValue) => {
        if (message.value) {
          return
        }
        context.root.$nextTick(() => {
          if (!wrapper.value) {
            return
          }

          let offsetX = 0
          if (
            newValue > oldValue &&
            context.root.$el.clientWidth > state.originalSize.width * oldValue
          ) {
            offsetX =
              (context.root.$el.clientWidth -
                state.originalSize.width * oldValue) /
              2
          }
          let offsetY = 0
          if (
            newValue > oldValue &&
            context.root.$el.clientHeight > state.originalSize.height * oldValue
          ) {
            offsetY =
              (context.root.$el.clientHeight -
                state.originalSize.height * oldValue) /
              2
          }

          wrapper.value.scrollLeft +=
            ((newValue - oldValue) * state.originalSize.width) / 2 - offsetX
          wrapper.value.scrollTop +=
            ((newValue - oldValue) * state.originalSize.height) / 2 - offsetY

          state.alignCenter =
            context.root.$el.clientWidth >= state.originalSize.width * newValue
          state.verticalAlignMiddle =
            context.root.$el.clientHeight >=
            state.originalSize.height * newValue
        })
      }
    )

    const handleMouseDown = () => {
      state.dragging = true
    }
    const handleMouseUp = () => {
      state.dragging = false
      state.scrollPosition = undefined
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (message.value || !wrapper.value) {
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
      context.emit('change-zoom', scale)
    }
    const handleError = () => {
      state.error = true
    }

    return {
      state,
      classes,
      imageClasses,
      imageStyles,
      message,
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
.viewer-content {
  cursor: -webkit-grab;
  &.dragging {
    cursor: -webkit-grabbing;
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
      // &:not(.scaling) {
      // max-height: 100%;
      // max-width: 100%;
      &.stretched {
        height: 100%;
        object-fit: contain;
        width: 100%;
      }
      // }
    }
  }
}
</style>
