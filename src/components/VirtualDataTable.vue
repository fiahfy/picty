<template>
  <v-data-table
    ref="table"
    v-bind="$attrs"
    class="virtual-data-table"
    :items="state.renderItems"
    disable-pagination
  >
    <template #header="props">
      <slot v-bind="props" name="header" />
    </template>
    <template #item="props">
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
} from '@nuxtjs/composition-api'
import { VDataTable } from 'vuetify/lib'

type Props = {
  items: unknown[]
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
      renderItems: unknown[]
      padding: { top: number; bottom: number }
      observer?: ResizeObserver
    }>({
      renderItems: [],
      padding: {
        top: 0,
        bottom: 0,
      },
      observer: undefined,
    })

    const table = ref<InstanceType<typeof VDataTable>>()
    const container = ref<HTMLDivElement>()

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

      const start = Math.max(0, index - Number(props.threshold))
      const end = Math.min(
        props.items.length,
        index + offset + Number(props.threshold)
      )

      state.padding = {
        top: start * props.estimatedHeight,
        bottom: (props.items.length - end) * props.estimatedHeight,
      }
      state.renderItems = props.items.slice(start, end)
    }
    const handleResize = () => {
      adjustItems()
    }
    const handleScroll = (e: Event) => {
      adjustItems()
      context.emit('scroll', e)
    }

    onMounted(() => {
      container.value =
        table.value?.$el.querySelector('.v-data-table__wrapper') ?? undefined
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
  outline: none;
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
