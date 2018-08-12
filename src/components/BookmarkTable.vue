<template>
  <virtual-data-table
    ref="table"
    :items="bookmarks"
    class="bookmark-table"
    item-key="path"
    hide-actions
    hide-headers
    sticky-headers
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <bookmark-table-row
      slot="items"
      slot-scope="props"
      :key="props.item.path"
      :bookmark="props.item"
    />
    <v-progress-linear
      slot="progress"
      indeterminate
    />
  </virtual-data-table>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import BookmarkTableRow from './BookmarkTableRow'
import VirtualDataTable from './VirtualDataTable'

export default {
  components: {
    BookmarkTableRow,
    VirtualDataTable
  },
  computed: {
    ...mapState('local/bookmark', [
      'scrollTop',
      'selectedBookmarkPath'
    ]),
    ...mapGetters('local/bookmark', [
      'bookmarks',
      'selectedBookmarkIndex'
    ])
  },
  watch: {
    loading () {
      this.restore()
    },
    selectedBookmarkIndex (value) {
      this.$nextTick(() => {
        const index = value
        if (index === -1) {
          return
        }
        const rowHeight = 48
        const headerHeight = 0
        const el = {
          offsetTop: rowHeight * index,
          offsetHeight: rowHeight
        }
        const table = {
          scrollTop: this.$refs.table.getScrollTop(),
          offsetHeight: this.$refs.table.getOffsetHeight() - headerHeight
        }
        if (table.scrollTop > el.offsetTop) {
          this.$refs.table.setScrollTop(el.offsetTop)
        } else if (table.scrollTop < el.offsetTop + el.offsetHeight - table.offsetHeight) {
          this.$refs.table.setScrollTop(el.offsetTop + el.offsetHeight - table.offsetHeight)
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
      }
    },
    ...mapMutations('local/bookmark', [
      'setScrollTop'
    ]),
    ...mapActions('local/bookmark', [
      'selectFirstBookmark',
      'selectLastBookmark',
      'selectPreviousBookmark',
      'selectNextBookmark',
      'openBookmark'
    ])
  }
}
</script>

<style scoped lang="scss">
.bookmark-table {
  outline: none;
}
</style>
