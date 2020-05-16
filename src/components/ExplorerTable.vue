<template>
  <virtual-data-table
    ref="table"
    class="explorer-table"
    :headers="headers"
    :items="filteredFiles"
    item-key="path"
    :loading="loading"
    :no-data-text="noDataText"
    hide-default-header
    hide-default-footer
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <template v-slot:header="props">
      <explorer-table-header :headers="props.props.headers" />
    </template>
    <template v-slot:item="props">
      <explorer-table-row :key="props.item.path" :file="props.item" />
    </template>
    <v-progress-linear slot="progress" indeterminate />
  </virtual-data-table>
</template>

<script>
import ExplorerTableHeader from './ExplorerTableHeader'
import ExplorerTableRow from './ExplorerTableRow'
import VirtualDataTable from './VirtualDataTable'
import { layoutExplorerStore } from '~/store'

export default {
  components: {
    ExplorerTableHeader,
    ExplorerTableRow,
    VirtualDataTable,
  },
  data() {
    return {
      headerHeight: 58,
      rowHeight: 48,
      headers: [
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
      ],
    }
  },
  computed: {
    loading() {
      return layoutExplorerStore.loading
    },
    noDataText() {
      if (layoutExplorerStore.loading) {
        return 'Loading...'
      }
      return layoutExplorerStore.query
        ? 'No matching records found.'
        : 'No data available.'
    },
    filteredFiles() {
      return layoutExplorerStore.filteredFiles
    },
    selectedFileIndex() {
      return layoutExplorerStore.selectedFileIndex
    },
  },
  watch: {
    loading() {
      this.restore()
    },
    selectedFileIndex(value) {
      this.$nextTick(() => {
        const index = value
        if (index === -1) {
          return
        }
        const el = {
          offsetTop: this.rowHeight * index,
          offsetHeight: this.rowHeight,
        }
        const table = {
          scrollTop: this.$refs.table.getScrollTop(),
          offsetHeight: this.$refs.table.getOffsetHeight() - this.headerHeight,
        }
        if (table.scrollTop > el.offsetTop) {
          this.$refs.table.setScrollTop(el.offsetTop)
        } else if (
          table.scrollTop <
          el.offsetTop + el.offsetHeight - table.offsetHeight
        ) {
          this.$refs.table.setScrollTop(
            el.offsetTop + el.offsetHeight - table.offsetHeight
          )
        }
      })
    },
  },
  mounted() {
    this.restore()
  },
  methods: {
    restore() {
      const scrollTop = layoutExplorerStore.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll(e) {
      const scrollTop = e.target.scrollTop
      layoutExplorerStore.setScrollTop({ scrollTop })
    },
    onKeyDown(e) {
      switch (e.keyCode) {
        case 13:
          layoutExplorerStore.viewFile({
            filepath: layoutExplorerStore.selectedFilepath,
          })
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutExplorerStore.selectFirstFile()
          } else {
            layoutExplorerStore.selectPreviousFile()
          }
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutExplorerStore.selectLastFile()
          } else {
            layoutExplorerStore.selectNextFile()
          }
          break
      }
    },
  },
}
</script>

<style scoped lang="scss">
.explorer-table {
  outline: none;
  ::v-deep .v-datatable {
    min-width: 768px;
  }
}
</style>
