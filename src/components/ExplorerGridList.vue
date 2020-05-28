<template>
  <virtual-data-iterator
    ref="iterator"
    class="explorer-grid-list"
    container-class="grid-list-md"
    :items="items"
    :loading="loading"
    :estimated-height="estimatedHeight"
    :sizes="sizes"
    item-key="path"
    hide-default-header
    hide-default-footer
    sticky-headers
    tabindex="0"
    @scroll="handleScroll"
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
        :class="classes"
        @click.native="() => handleClickRow(props.item)"
        @dblclick.native="() => handleDoubleClickRow(props.item)"
        @contextmenu.native="() => handleContextMenuRow(props.item)"
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
import viewport from '~/utils/viewport'
import { settingsStore } from '~/store'

const sizes = [6, 4, 3, 2, 2]

type Props = {
  items: any[]
  loading: boolean
  selected?: any
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
    loading: {
      type: Boolean,
      default: true,
    },
    selected: {
      type: Object,
      default: undefined,
    },
    sortBy: {
      type: String,
      default: undefined,
    },
    sortDesc: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, context: SetupContext) {
    const classes = computed(() => {
      return viewport.SIZES.map((size, i) => {
        return `col-${size}-${sizes[i]}`
      })
    })
    const estimatedHeight = computed(() => {
      return settingsStore.thumbnailHeightValue + 77
    })

    const handleScroll = () => {}
    const handleChangeSortOption = (option: { by: string; desc: boolean }) => {
      context.emit('change-sort-option', option)
    }
    const handleClickRow = (file: any) => {
      context.emit('click-item', file)
    }
    const handleDoubleClickRow = (file: any) => {
      context.emit('dblclick-item', file)
    }
    const handleContextMenuRow = (file: any) => {
      context.emit('contextmenu-item', file)
    }
    const handleChangeRating = (file: any, rating: number) => {
      context.emit('change-rating', file, rating)
    }
    const isSelected = (file: any) => {
      return file.path === props.selected?.path
    }

    return {
      classes,
      estimatedHeight,
      sizes,
      handleScroll,
      handleChangeSortOption,
      handleClickRow,
      handleDoubleClickRow,
      handleContextMenuRow,
      handleChangeRating,
      isSelected,
    }
  },
})
</script>

<style scoped lang="scss">
.explorer-grid-list ::v-deep .v-data-iterator {
  outline: none;
}
</style>
