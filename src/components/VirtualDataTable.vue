<template>
  <v-data-table
    ref="table"
    v-bind="$attrs"
    class="virtual-data-table"
    :items="state.renderItems"
    disable-pagination
  >
    <template v-slot:header="props">
      <slot v-bind="props" name="header" />
    </template>
    <template v-slot:item="props">
      <tr
        v-if="props.index === 0"
        :style="{ height: `${state.padding.top}px` }"
      />
      <slot v-bind="props" name="item" />
      <tr
        v-if="props.index === state.renderItems.length - 1"
        :style="{ height: `${state.padding.bottom}px` }"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onUnmounted,
  watch,
  SetupContext,
} from '@vue/composition-api'

type Props = {
  items: any[]
  estimatedHeight: number
  threshold: number | string
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
    stickyHeader: {
      type: Boolean,
      default: false,
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

    const table = ref<Vue>(null)
    const container = ref<HTMLDivElement>(null)

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

      const { scrollTop, offsetHeight } = container.value
      const index = Math.floor(scrollTop / props.estimatedHeight)
      const offset = Math.ceil(offsetHeight / props.estimatedHeight)

      let firstIndex = Math.max(0, index - Number(props.threshold))
      let lastIndex = firstIndex + offset + 2 * Number(props.threshold)
      if (lastIndex > props.items.length) {
        lastIndex = props.items.length
        firstIndex = Math.max(0, lastIndex - offset - Number(props.threshold))
      }

      state.padding = {
        top: firstIndex * props.estimatedHeight,
        bottom: (props.items.length - lastIndex) * props.estimatedHeight,
      }
      state.renderItems = props.items.slice(firstIndex, lastIndex)

      setScrollTop(scrollTop)
    }
    const handleResize = () => {
      adjustItems()
    }
    const handleScroll = (e: Event) => {
      adjustItems()
      context.emit('scroll', e)
    }

    watch(
      () => props.items,
      () => {
        adjustItems()
      }
    )

    onMounted(() => {
      container.value =
        table.value?.$el.querySelector('.v-data-table__wrapper') ?? null
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

    return {
      state,
      table,
      getOffsetHeight,
      getScrollTop,
      setScrollTop,
    }
  },
})
</script>

<style lang="scss" scoped>
.virtual-data-table {
  ::v-deep .v-data-table__wrapper {
    height: 100%;
    overflow-y: scroll;
    background: inherit;
    position: relative;
    table {
      table-layout: fixed;
      background: inherit;
      > thead {
        background: inherit;
        > tr {
          background: inherit;
          > th {
            background: inherit;
            position: sticky;
            top: 0;
            z-index: 1;
          }
        }
      }
    }
  }
}
</style>
