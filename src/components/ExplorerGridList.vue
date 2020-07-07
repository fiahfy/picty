<template>
  <virtual-data-grid
    ref="iterator"
    class="explorer-grid-list"
    :items="items"
    :loading="loading"
    :estimated-height="estimatedHeight"
    :cols="cols"
    item-key="path"
    hide-default-header
    hide-default-footer
    disable-sort
    threshold="1"
    tabindex="0"
  >
    <template v-slot:header>
      <explorer-grid-list-header
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @change:sort-option="handleChangeSortOption"
      />
    </template>
    <template v-slot:item="props">
      <explorer-grid-list-item
        :key="props.item.path"
        :item="props.item"
        :class="[...classes, isSelected(props.item) && 'selected']"
        @click.native="() => handleClickRow(props.item)"
        @dblclick.native="() => handleDoubleClickRow(props.item)"
        @contextmenu.native.stop="() => handleContextMenuRow(props.item)"
        @change:rating="(rating) => handleChangeRating(props.item, rating)"
      />
    </template>
  </virtual-data-grid>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  computed,
  ref,
} from '@vue/composition-api'
import ExplorerGridListHeader from '~/components/ExplorerGridListHeader.vue'
import ExplorerGridListItem from '~/components/ExplorerGridListItem.vue'
import VirtualDataGrid from '~/components/VirtualDataGrid.vue'
import { Item } from '~/models'
import { settingsStore } from '~/store'

const cols = [6, 4, 3, 2, 2]

type Props = {
  items: Item[]
  selected?: Item
  loading: boolean
  sortBy?: string
  sortDesc: boolean
}

export default defineComponent({
  components: {
    ExplorerGridListHeader,
    ExplorerGridListItem,
    VirtualDataGrid,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    sortBy: {
      type: String,
    },
    sortDesc: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, context: SetupContext) {
    const classes = computed(() => {
      return ['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => {
        if (i === 0) {
          return `col-${cols[i]}`
        }
        return `col-${size}-${cols[i]}`
      })
    })
    const estimatedHeight = computed(() => {
      return settingsStore.thumbnailHeightValue + 77
    })

    const iterator = ref<InstanceType<typeof VirtualDataGrid>>()

    const getColsInRow = () => {
      return iterator.value ? iterator.value.getColsInRow() : 0
    }
    const setScrollTop = (scrollTop: number) => {
      iterator.value && iterator.value.setScrollTop(scrollTop)
    }
    const scrollInView = () => {
      context.root.$nextTick(() => {
        const el = iterator.value?.$el.querySelector(
          '.explorer-grid-list-item.selected'
        ) as HTMLElement | null
        const container = iterator.value
        if (!el || !container) {
          return
        }
        const headerHeight = 48
        if (container.getScrollTop() > el.offsetTop - headerHeight) {
          setScrollTop(el.offsetTop - headerHeight)
        } else if (
          container.getScrollTop() <
          el.offsetTop + el.offsetHeight - container.getOffsetHeight()
        ) {
          setScrollTop(
            el.offsetTop + el.offsetHeight - container.getOffsetHeight()
          )
        }
      })
    }
    const focus = () => {
      ;(iterator.value?.$el as HTMLElement).focus()
    }
    const isRendered = (index: number) => {
      return iterator.value ? iterator.value.isRendered(index) : false
    }

    const isSelected = (item: Item) => {
      return item.path === props.selected?.path
    }

    const handleChangeSortOption = (option: { by: string; desc: boolean }) => {
      context.emit('change:sort-option', option)
    }
    const handleClickRow = (item: Item) => {
      context.emit('click:item', item)
    }
    const handleDoubleClickRow = (item: Item) => {
      context.emit('dblclick:item', item)
    }
    const handleContextMenuRow = (item: Item) => {
      context.emit('contextmenu:item', item)
    }
    const handleChangeRating = (item: Item, rating: number) => {
      context.emit('change:rating', item, rating)
    }

    return {
      cols,
      classes,
      estimatedHeight,
      iterator,
      getColsInRow,
      setScrollTop,
      scrollInView,
      focus,
      isRendered,
      isSelected,
      handleChangeSortOption,
      handleClickRow,
      handleDoubleClickRow,
      handleContextMenuRow,
      handleChangeRating,
    }
  },
})
</script>
