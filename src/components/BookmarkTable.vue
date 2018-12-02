<template>
  <virtual-data-table
    ref="table"
    class="bookmark-table"
    :headers="headers"
    :items="bookmarks"
    item-key="path"
    no-data-text="No data available."
    hide-actions
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
    @contextmenu.native.stop="onContextMenu"
  >
    <bookmark-table-header-row
      slot="headers"
      slot-scope="props"
      :headers="props.headers"
    />
    <bookmark-table-row
      slot="items"
      :key="props.item.path"
      slot-scope="props"
      :bookmark="props.item"
    />
    <v-progress-linear slot="progress" indeterminate />
  </virtual-data-table>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import BookmarkTableHeaderRow from './BookmarkTableHeaderRow'
import BookmarkTableRow from './BookmarkTableRow'
import VirtualDataTable from './VirtualDataTable'
import * as ContextMenu from '~/utils/context-menu'

export default {
  components: {
    BookmarkTableHeaderRow,
    BookmarkTableRow,
    VirtualDataTable
  },
  data() {
    return {
      headerHeight: 58,
      rowHeight: 48,
      headers: [
        {
          text: 'Path',
          value: 'path'
        },
        {
          text: 'Date Added',
          value: 'added_at',
          width: 150
        }
      ]
    }
  },
  computed: {
    ...mapState('local/bookmark', ['scrollTop', 'selectedBookmarkPath']),
    ...mapGetters('local/bookmark', ['bookmarks', 'selectedBookmarkIndex'])
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
        case 8:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.removeBookmark()
          }
          break
        case 13:
          this.openBookmark({ filepath: this.selectedBookmarkPath })
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstBookmark()
          } else {
            this.selectPreviousBookmark()
          }
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastBookmark()
          } else {
            this.selectNextBookmark()
          }
          break
        case 78:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.showDialog()
          }
          break
      }
    },
    onContextMenu(e) {
      this.unselectBookmark()
      const templates = [
        {
          label: 'New Bookmark',
          click: () => this.showDialog(),
          accelerator: 'CmdOrCtrl+N'
        }
      ]
      ContextMenu.show(e, templates)
    },
    ...mapMutations('local/bookmark', ['setScrollTop']),
    ...mapActions('local/bookmark', [
      'removeBookmark',
      'unselectBookmark',
      'selectFirstBookmark',
      'selectLastBookmark',
      'selectPreviousBookmark',
      'selectNextBookmark',
      'openBookmark',
      'showDialog'
    ])
  }
}
</script>

<style scoped lang="scss">
.bookmark-table {
  outline: none;
  /deep/ .v-datatable {
    min-width: 512px;
  }
}
</style>
