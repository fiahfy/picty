<template>
  <virtual-data-table
    ref="table"
    class="bookmark-table"
    :headers="headers"
    :items="bookmarks"
    item-key="path"
    no-data-text="No data available."
    hide-default-header
    hide-default-footer
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
    @contextmenu.native.stop="onContextMenu"
  >
    <template v-slot:header="props">
      <bookmark-table-header-row :headers="props.props.headers" />
    </template>
    <template v-slot:item="props">
      <bookmark-table-row :key="props.item.path" :bookmark="props.item" />
    </template>
    <v-progress-linear slot="progress" indeterminate />
  </virtual-data-table>
</template>

<script>
import BookmarkTableHeaderRow from './BookmarkTableHeaderRow'
import BookmarkTableRow from './BookmarkTableRow'
import VirtualDataTable from './VirtualDataTable'
import { layoutBookmarkStore } from '~/store'

export default {
  components: {
    BookmarkTableHeaderRow,
    BookmarkTableRow,
    VirtualDataTable,
  },
  data() {
    return {
      headerHeight: 58,
      rowHeight: 48,
      headers: [
        {
          text: 'Path',
          value: 'path',
        },
        {
          text: 'Date Added',
          value: 'added_at',
          width: 150,
        },
      ],
    }
  },
  computed: {
    scrollTop() {
      return layoutBookmarkStore.scrollTop
    },
    selectedBookmarkPath() {
      return layoutBookmarkStore.selectedBookmarkPath
    },
    bookmarks() {
      return layoutBookmarkStore.bookmarks
    },
    selectedBookmarkIndex() {
      return layoutBookmarkStore.selectedBookmarkIndex
    },
  },
  watch: {
    loading() {
      this.restore()
    },
    selectedBookmarkIndex(value) {
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
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll(e) {
      const scrollTop = e.target.scrollTop
      layoutBookmarkStore.setScrollTop({ scrollTop })
    },
    onKeyDown(e) {
      switch (e.keyCode) {
        case 8:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutBookmarkStore.removeBookmark()
          }
          break
        case 13:
          layoutBookmarkStore.openBookmark({
            filepath: this.selectedBookmarkPath,
          })
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutBookmarkStore.selectFirstBookmark()
          } else {
            layoutBookmarkStore.selectPreviousBookmark()
          }
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutBookmarkStore.selectLastBookmark()
          } else {
            layoutBookmarkStore.selectNextBookmark()
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutBookmarkStore.showDialog()
          }
          break
      }
    },
    onContextMenu() {
      layoutBookmarkStore.unselectBookmark()
      const template = [
        {
          label: 'New Bookmark',
          click: () => layoutBookmarkStore.showDialog(),
          accelerator: 'CmdOrCtrl+N',
        },
      ]
      this.$contextMenu.open(template)
    },
  },
}
</script>

<style scoped lang="scss">
.bookmark-table {
  outline: none;
  ::v-deep .v-datatable {
    min-width: 512px;
  }
}
</style>
