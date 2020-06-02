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
    sticky-headers
    tabindex="0"
    @scroll="handleScroll"
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
        @contextmenu.native="() => handleContextMenuRow(props.item)"
        @change-rating="(rating) => handleChangeRating(props.item, rating)"
      />
    </template>
  </virtual-data-table>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'
import ExplorerTableHeader from '~/components/ExplorerTableHeader.vue'
import ExplorerTableRow from '~/components/ExplorerTableRow.vue'
import VirtualDataTable from '~/components/VirtualDataTable.vue'

const headers = [
  {
    text: 'Name',
    value: 'name',
  },
  {
    text: 'Views',
    value: 'views',
    width: 96,
  },
  {
    text: 'Rating',
    value: 'rating',
    width: 238,
  },
  {
    text: 'Date Modified',
    value: 'modified_at',
    width: 150,
  },
]

type Props = {
  items: any[]
  loading: boolean
  selected?: any
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
    const handleScroll = () => {}
    const handleClickHeader = (header: any) => {
      context.emit('click-header', header)
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
      headers,
      handleScroll,
      handleClickHeader,
      handleClickRow,
      handleDoubleClickRow,
      handleContextMenuRow,
      handleChangeRating,
      isSelected,
    }
  },
})
</script>

<style lang="scss" scoped>
.explorer-table {
  outline: none;
  ::v-deep .v-datatable {
    min-width: 768px;
  }
}
</style>
