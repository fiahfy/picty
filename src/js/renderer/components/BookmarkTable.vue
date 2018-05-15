<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="items"
    :no-data-text="noDataText"
    class="bookmark-table"
    item-key="path"
    hide-actions
    must-sort
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <bookmark-table-header-row :headers="props.headers" />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <bookmark-table-row
        :key="props.item.path"
        :item="props.item"
      />
    </template>
  </virtual-data-table>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import BookmarkTableHeaderRow from './BookmarkTableHeaderRow'
import BookmarkTableRow from './BookmarkTableRow'
import VirtualDataTable from './VirtualDataTable'

export default {
  components: {
    BookmarkTableHeaderRow,
    BookmarkTableRow,
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
      return this.query ? 'No matching records found' : 'No data available'
    },
    ...mapState({
      query: state => state.bookmark.query,
      filepath: state => state.bookmark.filepath,
      scrollTop: state => state.bookmark.scrollTop
    }),
    ...mapGetters({
      items: 'bookmark/filteredItems',
      selectedIndex: 'bookmark/selectedIndex'
    })
  },
  watch: {
    filepath () {
      this.$nextTick(() => {
        const index = this.selectedIndex
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
    this.loadItems()
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
          this.showViewer({ filepath: this.filepath })
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirst()
          } else {
            this.selectPrevious()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLast()
          } else {
            this.selectNext()
          }
          break
        case 68:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            e.preventDefault()
            this.toggleBookmark({ filepath: this.filepath })
          }
          break
      }
    },
    ...mapMutations({
      setScrollTop: 'bookmark/setScrollTop'
    }),
    ...mapActions({
      loadItems: 'bookmark/loadItems',
      selectFirst: 'bookmark/selectFirst',
      selectLast: 'bookmark/selectLast',
      selectPrevious: 'bookmark/selectPrevious',
      selectNext: 'bookmark/selectNext',
      showViewer: 'bookmark/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.bookmark-table {
  outline: none;
  & /deep/ .datatable {
    table-layout: fixed;
  }
}
</style>
