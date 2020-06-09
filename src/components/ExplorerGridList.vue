<template>
  <virtual-data-iterator
    ref="iterator"
    class="explorer-grid-list"
    :items="items"
    :loading="loading"
    :estimated-height="estimatedHeight"
    :sizes="sizes"
    threshold="100"
    item-key="path"
    hide-default-header
    hide-default-footer
    disable-sort
    tabindex="0"
  >
    <template v-slot:header>
      <explorer-grid-list-header
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @change-sort-option="handleChangeSortOption"
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
        @change-rating="(rating) => handleChangeRating(props.item, rating)"
      />
    </template>
  </virtual-data-iterator>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed } from '@vue/composition-api'
import ExplorerGridListHeader from '~/components/ExplorerGridListHeader.vue'
import ExplorerGridListItem from '~/components/ExplorerGridListItem.vue'
import VirtualDataIterator from '~/components/VirtualDataIterator.vue'
import { Item } from '~/models'
import { settingsStore } from '~/store'
import * as viewport from '~/utils/viewport'

const sizes = [6, 4, 3, 2, 2]

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
    VirtualDataIterator,
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
      return viewport.sizes.map((size, i) => {
        const s = size === 'xs' ? '' : `-${size}`
        return `col${s}-${sizes[i]}`
      })
    })
    const estimatedHeight = computed(() => {
      return settingsStore.thumbnailHeightValue + 77
    })

    const isSelected = (item: Item) => {
      return item.path === props.selected?.path
    }
    const handleChangeSortOption = (option: { by: string; desc: boolean }) => {
      context.emit('change-sort-option', option)
    }
    const handleClickRow = (item: Item) => {
      context.emit('click-item', item)
    }
    const handleDoubleClickRow = (item: Item) => {
      context.emit('dblclick-item', item)
    }
    const handleContextMenuRow = (item: Item) => {
      context.emit('contextmenu-item', item)
    }
    const handleChangeRating = (item: Item, rating: number) => {
      context.emit('change-rating', item, rating)
    }

    return {
      classes,
      estimatedHeight,
      sizes,
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
