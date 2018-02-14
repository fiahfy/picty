<template>
  <div class="bookmark-list" :class="classes">
    <mdc-table
      tabindex="0"
      @keydown="keydown"
    >
      <mdc-table-header>
        <mdc-table-row>
          <mdc-table-header-column
            class="name"
            @click="e => click(e, 'name')"
          >
            <span>Name</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'name'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="size"
            @click="e => click(e, 'size')"
          >
            <span>Size</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'size'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="date-modified"
            @click="e => click(e, 'date_modified')"
          >
            <span>Date Modified</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'date_modified'"
            />
          </mdc-table-header-column>
        </mdc-table-row>
        <mdc-table-row class="shadow">
          <mdc-table-header-column colspan="3" />
        </mdc-table-row>
      </mdc-table-header>
      <mdc-virtual-table-body
        :items="files"
        :estimatedHeight="41"
      >
        <bookmark-list-item
          slot-scope="{ item, index }"
          :key="item.name"
          :file="item"
          :selected="isSelectedBookmark({ filepath: item.path })"
          @click="selectBookmark({ filepath: item.path })"
          @dblclick="action({ filepath: item.path })"
          @contextmenu="e => contextmenu(e, item)"
        />
      </mdc-virtual-table-body>
    </mdc-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import BookmarkListItem from './BookmarkListItem'
import MdcIcon from './MdcIcon'
import MdcTable from './MdcTable'
import MdcTableHeader from './MdcTableHeader'
import MdcTableHeaderColumn from './MdcTableHeaderColumn'
import MdcTableRow from './MdcTableRow'
import MdcVirtualTableBody from './MdcVirtualTableBody'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    BookmarkListItem,
    MdcIcon,
    MdcTable,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow,
    MdcVirtualTableBody
  },
  data () {
    return {
      scrolling: false
    }
  },
  mounted () {
    this.$el.addEventListener('scroll', this.scroll)
    this.$nextTick(() => {
      this.$el.scrollTop = this.scrollTop
    })
  },
  beforeDestroy () {
    this.$el.removeEventListener('scroll', this.scroll)
  },
  computed: {
    classes () {
      return {
        scrolling: this.scrolling
      }
    },
    icon () {
      return this.sortOption.order === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    ...mapState({
      selectedBookmark: state => state.bookmark.selectedBookmark,
      scrollTop: state => state.bookmark.scrollTop,
      sortOption: state => state.bookmark.sortOption
    }),
    ...mapGetters({
      files: 'bookmark/filteredFiles',
      selectedIndex: 'bookmark/selectedIndex',
      isSelectedBookmark: 'bookmark/isSelectedBookmark'
    })
  },
  methods: {
    scroll () {
      const scrollTop = this.$el.scrollTop
      this.scrolling = scrollTop > 0
      this.setScrollTop({ scrollTop })
    },
    keydown (e) {
      if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
        switch (e.keyCode) {
          case 68:
            e.preventDefault()
            this.toggleBookmark({ filepath: this.selectedBookmark })
            break
        }
        return
      }
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.showViewer({ filepath: this.selectedBookmark })
          break
        case 38:
          e.preventDefault()
          this.selectPreviousBookmark()
          break
        case 40:
          e.preventDefault()
          this.selectNextBookmark()
          break
      }
    },
    click (e, sortKey) {
      this.changeSortKey({ sortKey })
      this.$nextTick(() => {
        this.$el.scrollTop = 0
      })
    },
    contextmenu (e, file) {
      this.selectBookmark({ filepath: file.path })
      ContextMenu.show(e, [
        {
          label: 'Bookmark',
          click: () => {
            this.toggleBookmark({ filepath: file.path })
          },
          accelerator: 'CmdOrCtrl+D'
        },
        {
          label: 'View',
          click: () => {
            this.showViewer({ filepath: file.path })
          },
          accelerator: 'Enter'
        }
      ])
    },
    ...mapMutations({
      setScrollTop: 'bookmark/setScrollTop'
    }),
    ...mapActions({
      toggleBookmark: 'bookmark/toggleBookmark',
      selectBookmark: 'bookmark/selectBookmark',
      selectPreviousBookmark: 'bookmark/selectPreviousBookmark',
      selectNextBookmark: 'bookmark/selectNextBookmark',
      changeSortKey: 'bookmark/changeSortKey',
      action: 'bookmark/action',
      showViewer: 'bookmark/showViewer'
    })
  },
  watch: {
    directory () {
      this.$nextTick(() => {
        this.$el.scrollTop = this.scrollTop
      })
    },
    selectedBookmark () {
      this.$nextTick(() => {
        const index = this.selectedIndex
        if (index === -1) {
          return
        }
        const rowHeight = 41
        const offsetHeight = 41
        const el = {
          offsetTop: rowHeight * index + offsetHeight,
          offsetHeight: rowHeight
        }
        if (el.offsetTop - el.offsetHeight < this.$el.scrollTop) {
          this.$el.scrollTop = el.offsetTop - el.offsetHeight
        } else if (el.offsetTop + el.offsetHeight > this.$el.scrollTop + this.$el.offsetHeight) {
          this.$el.scrollTop = el.offsetTop + el.offsetHeight - this.$el.offsetHeight
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

.bookmark-list {
  height: 100%;
  overflow-y: scroll;
  .mdc-table {
    outline: none;
    table-layout: fixed;
    .mdc-table-header {
      .mdc-table-row {
        height: 40px;
        .mdc-table-header-column {
          border: 0;
          line-height: 20px;
          position: sticky;
          top: 0;
          vertical-align: bottom;
          white-space: nowrap;
          z-index: 1;
          &.date-modified {
            width: 128px;
          }
          &.size {
            width: 64px;
          }
          .mdc-icon {
            padding: 0;
            vertical-align: bottom;
          }
        }
        &.shadow {
          height: 1px;
          .mdc-table-header-column {
            padding: 0;
            position: sticky;
            top: 40px;
            z-index: 0;
            &:after {
              border-bottom: {
                color: $material-color-grey-300;
                style: solid;
                width: 1px;
              }
              bottom: 0;
              content:'';
              left: 0;
              position: absolute;
              width: 100%;
            }
          }
        }
      }
    }
    .mdc-table-row {
      cursor: pointer;
      height: 41px;
    }
  }
  &.scrolling .mdc-table-row.shadow .mdc-table-header-column:after {
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  }
}
.mdc-theme--dark .bookmark-list {
   .mdc-table .mdc-table-row.shadow .mdc-table-header-column:after {
    border-bottom-color: $material-color-grey-600;
  }
  &.scrolling .mdc-table .mdc-table-row.shadow .mdc-table-header-column:after {
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.9);
  }
}
</style>
