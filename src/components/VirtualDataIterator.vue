<template>
  <v-layout class="virtual-data-iterator" column>
    <v-container fluid pa-0 overflow-hidden fill-height>
      <v-data-iterator
        ref="iterator"
        v-bind="$attrs"
        class="fill-height flex-grow-1"
        :items="state.renderItems"
        disable-pagination
        row
        wrap
        tabindex="-1"
      >
        <template v-slot:header="props">
          <div class="header">
            <slot v-bind="props" name="header" />
          </div>
        </template>
        <template v-slot:default="props">
          <v-row class="ma-0">
            <v-col
              :style="{ height: `${state.padding.top}px` }"
              class="pa-0"
              xs="12"
              style="min-width: 100%;"
            />
            <template v-for="item in props.items">
              <slot v-bind="{ item }" name="item" />
            </template>
            <v-col
              :style="{ height: `${state.padding.bottom}px` }"
              class="pa-0"
              xs="12"
              style="min-width: 100%;"
            />
          </v-row>
        </template>
        <template v-slot:loading>
          <v-progress-linear indeterminate height="2" />
          <div class="ma-3 body-2 grey--text text-center">Loading items...</div>
        </template>
        <template v-slot:no-data>
          <div class="ma-3 body-2 grey--text text-center">
            No data available
          </div>
        </template>
      </v-data-iterator>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  onMounted,
  onUnmounted,
  watch,
  SetupContext,
} from '@vue/composition-api'
import * as viewport from '~/utils/viewport'

type Props = {
  items: any[]
  estimatedHeight: number
  threshold: number | string
  sizes: number | number[]
}

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    estimatedHeight: {
      type: Number,
      default: 48,
    },
    threshold: {
      type: [Number, String],
      default: 0,
    },
    sizes: {
      type: [Number, Array],
      default: 6,
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive<{
      padding: { top: number; bottom: number }
      renderItems: any[]
      observer?: ResizeObserver
    }>({
      padding: {
        top: 0,
        bottom: 0,
      },
      renderItems: [],
      observer: undefined,
    })

    const calculatedSizes = computed(() => {
      return Array.isArray(props.sizes)
        ? props.sizes
        : Array(5).fill(props.sizes)
    })

    const iterator = ref<Vue | null>(null)
    const container = ref<HTMLDivElement | null>(null)

    const getOffsetHeight = () => {
      return container.value?.offsetHeight ?? 0
    }
    const getScrollTop = () => {
      return container.value?.scrollTop ?? 0
    }
    const setScrollTop = (value: number) => {
      context.root.$nextTick(() => {
        container.value && (container.value.scrollTop = value)
      })
    }
    const adjustItems = () => {
      if (!container.value) {
        return
      }

      const size = 12 / calculatedSizes.value[viewport.getSizeIndex()]

      const { scrollTop, offsetHeight } = container.value
      const index = Math.floor(scrollTop / props.estimatedHeight)
      const offset = Math.ceil(offsetHeight / props.estimatedHeight)

      const last = Math.ceil(props.items.length / size)
      const start = Math.max(0, index - Number(props.threshold))
      const end = Math.min(last, index + offset + Number(props.threshold))

      state.padding = {
        top: start * props.estimatedHeight,
        bottom: (last - end) * props.estimatedHeight,
      }
      state.renderItems = props.items.slice(start * size, end * size)

      setScrollTop(scrollTop)
    }
    const handleResize = () => {
      adjustItems()
    }
    const handleScroll = (e: Event) => {
      adjustItems()
      context.emit('scroll', e)
    }

    onMounted(() => {
      container.value = (iterator.value?.$el as HTMLDivElement) ?? null
      if (container.value) {
        container.value.classList.add('scrollbar')
        container.value.addEventListener('scroll', handleScroll)
        state.observer = new ResizeObserver(handleResize)
        state.observer.observe(container.value)
        adjustItems()
      }
    })

    onUnmounted(() => {
      if (container.value) {
        container.value.removeEventListener('scroll', handleScroll)
      }
      state.observer && state.observer.disconnect()
    })

    watch(
      () => props.items,
      () => {
        adjustItems()
      }
    )

    return {
      state,
      iterator,
      getOffsetHeight,
      getScrollTop,
      setScrollTop,
    }
  },
})
</script>

<style lang="scss" scoped>
.virtual-data-iterator {
  .v-data-iterator {
    overflow-y: scroll;
    position: relative;
    ::v-deep .header {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
}
</style>
