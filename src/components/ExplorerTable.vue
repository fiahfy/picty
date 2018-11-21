<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="filteredFiles"
    :loading="loading"
    :no-data-text="noDataText"
    class="explorer-table"
    item-key="path"
    hide-actions
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <explorer-table-header-row
      slot="headers"
      slot-scope="props"
      :headers="props.headers"
    />
    <explorer-table-row
      slot="items"
      :key="props.item.path"
      slot-scope="props"
      :file="props.item"
    />
    <v-progress-linear slot="progress" indeterminate />
  </virtual-data-table>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ExplorerTableHeaderRow from './ExplorerTableHeaderRow'
import ExplorerTableRow from './ExplorerTableRow'
import VirtualDataTable from './VirtualDataTable'

export default {
  components: {
    ExplorerTableHeaderRow,
    ExplorerTableRow,
    VirtualDataTable
  },
  data() {
    return {
      headerHeight: 58,
      rowHeight: 48,
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Views',
          value: 'views',
          width: 96
        },
        {
          text: 'Rating',
          value: 'rating',
          width: 238
        },
        {
          text: 'Date Modified',
          value: 'modified_at',
          width: 150
        }
      ]
    }
  },
  computed: {
    noDataText() {
      if (this.loading) {
        return 'Loading...'
      }
      return this.query ? 'No matching records found' : 'No data available'
    },
    ...mapState('local/explorer', [
      'directory',
      'query',
      'loading',
      'selectedFilepath'
    ]),
    ...mapGetters('local/explorer', [
      'filteredFiles',
      'scrollTop',
      'selectedFileIndex'
    ])
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
          offsetHeight: this.rowHeight
        }
        const table = {
          scrollTop: this.$refs.table.getScrollTop(),
          offsetHeight: this.$refs.table.getOffsetHeight() - this.headerHeight
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
    }
  },
  mounted() {
    this.restore()
  },
  methods: {
    restore() {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll(e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown(e) {
      switch (e.keyCode) {
        case 13:
          this.viewFile({ filepath: this.selectedFilepath })
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstFile()
          } else {
            this.selectPreviousFile()
          }
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastFile()
          } else {
            this.selectNextFile()
          }
          break
      }
    },
    ...mapActions('local/explorer', [
      'selectFirstFile',
      'selectLastFile',
      'selectPreviousFile',
      'selectNextFile',
      'setScrollTop',
      'viewFile'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-table {
  outline: none;
  /deep/ .v-datatable {
    min-width: 768px;
  }
}
</style>
