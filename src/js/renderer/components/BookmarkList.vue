<template>
  <div />
  <!-- <div
    :class="classes"
    class="bookmark-list"
    tabindex="0"
    @keydown="keydown"
  >
    <mdc-table>
      <mdc-table-header>
        <mdc-table-row>
          <mdc-table-header-column
            class="name"
            @click="e => click(e, 'name')"
          >
            <span>Name</span>
            <mdc-icon
              v-if="sortOption.key === 'name'"
              :icon="icon"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="size"
            @click="e => click(e, 'size')"
          >
            <span>Size</span>
            <mdc-icon
              v-if="sortOption.key === 'size'"
              :icon="icon"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="date-modified"
            @click="e => click(e, 'date_modified')"
          >
            <span>Date Modified</span>
            <mdc-icon
              v-if="sortOption.key === 'date_modified'"
              :icon="icon"
            />
          </mdc-table-header-column>
        </mdc-table-row>
        <mdc-table-row class="shadow">
          <mdc-table-header-column colspan="3" />
        </mdc-table-row>
      </mdc-table-header>
      <mdc-virtual-table-body
        :items="files"
        :estimated-height="41"
      >
        <bookmark-list-item
          slot-scope="{ item, index }"
          :key="item.name"
          :file="item"
          :selected="isSelected({ filepath: item.path })"
          @click.native="select({ filepath: item.path })"
          @dblclick.native="action({ filepath: item.path })"
          @contextmenu.native="e => contextmenu(e, item)"
        />
      </mdc-virtual-table-body>
    </mdc-table>
  </div> -->
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import * as ContextMenu from '../utils/context-menu'

export default {
  data () {
    return {
      scrolling: false
    }
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
      isSelected: 'bookmark/isSelected'
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
  methods: {
    scroll () {
      const scrollTop = this.$el.scrollTop
      this.scrolling = scrollTop > 0
      this.setScrollTop({ scrollTop })
    },
    keydown (e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.showViewer({ filepath: this.selectedBookmark })
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
            this.toggleBookmark({ filepath: this.selectedBookmark })
          }
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
      this.select({ filepath: file.path })
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
      select: 'bookmark/select',
      selectFirst: 'bookmark/selectFirst',
      selectLast: 'bookmark/selectLast',
      selectPrevious: 'bookmark/selectPrevious',
      selectNext: 'bookmark/selectNext',
      changeSortKey: 'bookmark/changeSortKey',
      action: 'bookmark/action',
      showViewer: 'bookmark/showViewer'
    })
  }
}
</script>

<style scoped lang="scss">
// .bookmark-list {
//   height: 100%;
//   outline: none;
//   overflow-y: scroll;
//   .mdc-table {
//     border-spacing: 0;
//     table-layout: fixed;
//     width: 100%;
//     .mdc-table-header {
//       .mdc-table-row {
//         cursor: pointer;
//         height: 40px;
//         .mdc-table-header-column {
//           border: 0;
//           color: var(--mdc-theme-text-secondary-on-background);
//           font-size: smaller;
//           font-weight: normal;
//           line-height: 20px;
//           padding: 8px;
//           position: sticky;
//           top: 0;
//           vertical-align: bottom;
//           white-space: nowrap;
//           z-index: 1;
//           &.size {
//             width: 64px;
//           }
//           &.date-modified {
//             width: 128px;
//           }
//           .mdc-icon {
//             padding: 0;
//             vertical-align: bottom;
//           }
//         }
//         &.shadow {
//           height: 1px;
//           .mdc-table-header-column {
//             padding: 0;
//             position: sticky;
//             top: 40px;
//             z-index: 0;
//             &:after {
//               bottom: 0;
//               content:'';
//               left: 0;
//               position: absolute;
//               width: 100%;
//             }
//           }
//         }
//       }
//     }
//   }
//   &.scrolling .mdc-table-row.shadow .mdc-table-header-column:after {
//     box-shadow: 0 0 3px 1px var(--shadow);
//   }
// }
</style>
