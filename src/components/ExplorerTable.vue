<template>
  <virtual-data-table
    ref="table"
    class="explorer-table"
    :headers="headers"
    :items="items"
    :loading="loading"
    item-key="path"
    hide-default-header
    hide-default-footer
    disable-sort
    threshold="1"
    tabindex="0"
  >
    <template v-slot:header="props">
      <explorer-table-header
        :headers="props.props.headers"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @click="handleClickHeader"
      />
    </template>
    <template v-slot:item="props">
      <explorer-table-row
        :key="props.item.path"
        :item="props.item"
        :class="{ 'v-data-table__selected': isSelected(props.item) }"
        @click.native="() => handleClickRow(props.item)"
        @dblclick.native="() => handleDoubleClickRow(props.item)"
        @contextmenu.native.stop="() => handleContextMenuRow(props.item)"
        @change:rating="(rating) => handleChangeRating(props.item, rating)"
      />
    </template>
  </virtual-data-table>
</template>

<script lang="ts">
import { defineComponent, SetupContext, ref } from '@vue/composition-api'
import ExplorerTableHeader from '~/components/ExplorerTableHeader.vue'
import ExplorerTableRow from '~/components/ExplorerTableRow.vue'
import VirtualDataTable from '~/components/VirtualDataTable.vue'
import { Item } from '~/models'

type Header = {
  text: string
  value: keyof Item
  width?: number
}

const headers: Header[] = [
  {
    text: 'Name',
    value: 'name',
  },
  {
    text: 'Rating',
    value: 'rating',
    width: 238,
  },
  {
    text: 'Last Modified',
    value: 'lastModified',
    width: 150,
  },
]

type Props = {
  items: Item[]
  selected?: Item
  loading: boolean
  sortBy?: string
  sortDesc: boolean
}

export default defineComponent({
  components: {
    ExplorerTableHeader,
    ExplorerTableRow,
    VirtualDataTable,
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
    const isSelected = (item: Item) => {
      return item.path === props.selected?.path
    }

    const table = ref<InstanceType<typeof VirtualDataTable>>()

    const setScrollTop = (scrollTop: number) => {
      table.value && table.value.setScrollTop(scrollTop)
    }
    const scrollInView = () => {
      context.root.$nextTick(() => {
        const el = table.value?.$el.querySelector(
          '.explorer-table-row.v-data-table__selected'
        ) as HTMLElement | null
        const container = table.value
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
      ;(table.value?.$el as HTMLElement).focus()
    }

    const handleClickHeader = (header: File) => {
      context.emit('click:header', header)
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
      headers,
      isSelected,
      table,
      setScrollTop,
      scrollInView,
      focus,
      handleClickHeader,
      handleClickRow,
      handleDoubleClickRow,
      handleContextMenuRow,
      handleChangeRating,
    }
  },
})
</script>
