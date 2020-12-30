<template>
  <div class="virtual-data-grid d-flex">
    <v-data-iterator
      ref="iterator"
      v-bind="$attrs"
      class="overflow-y-scroll flex-grow-1 scrollbar"
      :class="state.classes"
      :items="state.renderItems"
      disable-pagination
      row
      wrap
      tabindex="-1"
    >
      <template #header="props">
        <div class="header">
          <slot v-bind="props" name="header" />
        </div>
      </template>
      <template #default="props">
        <v-row class="ma-0">
          <v-col
            :style="{ height: `${state.padding.top}px` }"
            class="pa-0"
            xs="12"
            style="min-width: 100%"
          />
          <template v-for="item in props.items">
            <slot v-bind="{ item }" name="item" />
          </template>
          <v-col
            :style="{ height: `${state.padding.bottom}px` }"
            class="pa-0"
            xs="12"
            style="min-width: 100%"
          />
        </v-row>
      </template>
      <template #loading>
        <v-progress-linear indeterminate height="4" />
        <div class="ma-3 body-2 grey--text text-center">Loading items...</div>
      </template>
      <template #no-data>
        <div class="ma-3 body-2 grey--text text-center">No data available</div>
      </template>
    </v-data-iterator>
  </div>
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
} from '@nuxtjs/composition-api'
import { throttle } from 'throttle-debounce'
import { VDataIterator } from 'vuetify/lib'

const breakpoints = { sm: 600, md: 960, lg: 1264, xl: 1904 }

type Props = {
  items: unknown[]
  estimatedHeight: number
  threshold: number | string
  cols: number | number[]
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
    cols: {
      type: [Number, Array],
      default: 6,
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive<{
      renderItems: unknown[]
      startIndex: number
      endIndex: number
      padding: { top: number; bottom: number }
      classes: string[]
      observer?: ResizeObserver
    }>({
      renderItems: [],
      startIndex: 0,
      endIndex: 0,
      padding: {
        top: 0,
        bottom: 0,
      },
      classes: [],
      observer: undefined,
    })

    const cols = computed(() => {
      return Array.isArray(props.cols)
        ? props.cols
        : (Array(5).fill(props.cols) as number[])
    })

    const iterator = ref<InstanceType<typeof VDataIterator>>()
    const container = ref<HTMLDivElement>()

    const getColsInRow = () => {
      return 12 / cols.value[state.classes.length]
    }
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
    const isRendered = (index: number) => {
      return index >= state.startIndex && index < state.endIndex
    }

    const adjust = () => {
      if (!container.value) {
        return
      }

      const innerWidth = container.value.offsetWidth
      state.classes = Object.keys(breakpoints).reduce((carry, key) => {
        if (innerWidth >= breakpoints[key as keyof typeof breakpoints]) {
          return [...carry, key]
        }
        return carry
      }, [] as string[])

      const colsInRow = getColsInRow()

      const { scrollTop, offsetHeight } = container.value
      const index = Math.floor(scrollTop / props.estimatedHeight)
      const offset = Math.ceil(offsetHeight / props.estimatedHeight)

      const last = Math.ceil(props.items.length / colsInRow)
      const start = Math.max(0, index - Number(props.threshold))
      const end = Math.min(last, index + offset + Number(props.threshold))

      state.padding = {
        top: start * props.estimatedHeight,
        bottom: (last - end) * props.estimatedHeight,
      }
      state.startIndex = start * colsInRow
      state.endIndex = end * colsInRow
      state.renderItems = props.items.slice(state.startIndex, state.endIndex)
    }
    const throttled = throttle(300, adjust)

    const handleResize = () => {
      throttled()
    }
    const handleScroll = (e: Event) => {
      throttled()
      context.emit('scroll', e)
    }

    onMounted(() => {
      container.value = (iterator.value?.$el as HTMLDivElement) ?? null
      if (container.value) {
        container.value.addEventListener('scroll', handleScroll)
        state.observer = new ResizeObserver(handleResize)
        state.observer.observe(container.value)
      }
      adjust()
    })

    onUnmounted(() => {
      container.value &&
        container.value.removeEventListener('scroll', handleScroll)
      state.observer && state.observer.disconnect()
    })

    watch(
      () => props.items,
      () => {
        adjust()
      }
    )

    return {
      state,
      iterator,
      getColsInRow,
      getOffsetHeight,
      getScrollTop,
      setScrollTop,
      isRendered,
    }
  },
})
</script>

<style lang="scss" scoped>
$sizes: sm, md, lg, xl;
$cols: 12, 6, 4, 3, 2, 1;

.virtual-data-grid > .v-data-iterator {
  position: relative;
  ::v-deep .header {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  @each $col in $cols {
    ::v-deep .col-#{$col} {
      flex: 0 0 calc(100% / 12 * #{$col}) !important;
      max-width: calc(100% / 12 * #{$col}) !important;
    }
  }
  @each $size in $sizes {
    @each $col in $cols {
      &.#{$size} ::v-deep .col-#{$size}-#{$col} {
        flex: 0 0 calc(100% / 12 * #{$col}) !important;
        max-width: calc(100% / 12 * #{$col}) !important;
      }
    }
  }
}
</style>
