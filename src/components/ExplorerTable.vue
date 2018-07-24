<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="filteredFiles"
    :no-data-text="noDataText"
    class="explorer-table"
    item-key="path"
    hide-actions
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <explorer-table-header-row :headers="props.headers" />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <explorer-table-row
        :key="props.item.path"
        :file="props.item"
      />
    </template>
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
  data () {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Size',
          value: 'size',
          width: 64
        },
        {
          text: 'Date Modified',
          value: 'mtime',
          width: 128
        }
      ]
    }
  },
  computed: {
    noDataText () {
      if (this.loading) {
        return 'Loading...'
      }
      return this.query ? 'No matching records found' : 'No data available'
    },
    ...mapState([
      'directory'
    ]),
    ...mapState('local/explorer', [
      'loading',
      'query',
      'selectedFilepath'
    ]),
    ...mapGetters('local/explorer', [
      'filteredFiles',
      'scrollTop',
      'selectedFileIndex'
    ])
  },
  watch: {
    directory () {
      this.restore()
    },
    selectedFileIndex (value) {
      this.$nextTick(() => {
        const index = value
        if (index === -1) {
          return
        }
        const rowHeight = 48
        const headerHeight = 58
        const el = {
          offsetTop: rowHeight * (index + 1),
          offsetHeight: rowHeight
        }
        const table = {
          scrollTop: this.$refs.table.getScrollTop(),
          offsetHeight: this.$refs.table.getOffsetHeight()
        }
        if (el.offsetTop - el.offsetHeight < table.scrollTop) {
          this.$refs.table.setScrollTop(el.offsetTop - el.offsetHeight)
        } else if (el.offsetTop + headerHeight > table.scrollTop + table.offsetHeight) {
          this.$refs.table.setScrollTop(el.offsetTop + headerHeight - table.offsetHeight)
        }
      })
    }
  },
  mounted () {
    this.restore()
  },
  methods: {
    restore () {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown (e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.viewFile({ filepath: this.selectedFilepath })
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstFile()
          } else {
            this.selectPreviousFile()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastFile()
          } else {
            this.selectNextFile()
          }
          break
        case 68:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.toggleFileStarred({ filepath: this.selectedFilepath })
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
      'viewFile',
      'toggleFileStarred'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-table {
  outline: none;
  & /deep/ .v-datatable {
    table-layout: fixed;
  }
}
</style>
