<template>
  <div class="explorer-list">
    <v-data-table
      :headers="headers"
      :items="files"
      v-model="selected"
      item-key="path"
      hide-actions
      must-sort
    >
      <template
        slot-scope="props"
        slot="items"
      >
        <tr
          :active="props.selected"
          @click="selectRow(props)"
          @dblclick="action({ filepath: props.item.path })"
        >
          <td>
            <v-icon
              :color="getColor(props.item)"
              class="pa-1"
            >{{ getIcon(props.item) }}</v-icon>
            <span>{{ props.item.name }}</span>
          </td>
          <td class="text-xs-right">
            <template v-if="getSize(props.item) !== null">{{ getSize(props.item) | readableSize }}</template>
          </td>
          <td class="text-xs-right">{{ props.item.mtime | moment('YYYY-MM-DD HH:mm') }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
  <!-- <div
    :class="classes"
    class="explorer-list"
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
        <explorer-list-item
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
import { mapActions, mapGetters, mapState } from 'vuex'
import ExplorerListItem from './ExplorerListItem'
import MdcIcon from './MdcIcon'
import MdcTable from './MdcTable'
import MdcTableHeader from './MdcTableHeader'
import MdcTableHeaderColumn from './MdcTableHeaderColumn'
import MdcTableRow from './MdcTableRow'
import MdcVirtualTableBody from './MdcVirtualTableBody'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    ExplorerListItem,
    MdcIcon,
    MdcTable,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow,
    MdcVirtualTableBody
  },
  data () {
    return {
      scrolling: false,
      selected: [],
      headers: [
        {
          text: 'Name',
          align: 'center',
          value: 'name'
        },
        {
          text: 'Size',
          align: 'center',
          value: 'size'
        },
        {
          text: 'Date Modified',
          align: 'center',
          value: 'mtime'
        }
      ]
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
      directory: state => state.explorer.directory
    }),
    ...mapGetters({
      files: 'explorer/filteredFiles',
      selectedFilepath: 'explorer/selectedFilepath',
      scrollTop: 'explorer/scrollTop',
      sortOption: 'explorer/sortOption',
      selectedIndex: 'explorer/selectedIndex',
      isSelected: 'explorer/isSelected'
    })
  },
  watch: {
    directory () {
      this.$nextTick(() => {
        this.$el.scrollTop = this.scrollTop
      })
    },
    selectedFilepath () {
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
    getIcon (file) {
      return file.directory ? 'folder' : 'photo'
    },
    getColor (file) {
      return file.directory ? 'blue lighten-3' : 'green lighten-3'
    },
    getSize (file) {
      return file.directory ? null : file.size
    },
    selectRow (props) {
      this.selected = [props.item]
      this.select({ filepath: props.item.path })
    },
    scroll () {
      const scrollTop = this.$el.scrollTop
      this.scrolling = scrollTop > 0
      this.setScrollTop({ scrollTop })
    },
    keydown (e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.showViewer({ filepath: this.selectedFilepath })
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
            this.toggleBookmark({ filepath: this.selectedFilepath })
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
        },
        { type: 'separator' },
        { role: ContextMenu.Role.copy }
      ])
    },
    ...mapActions({
      select: 'explorer/select',
      selectFirst: 'explorer/selectFirst',
      selectLast: 'explorer/selectLast',
      selectPrevious: 'explorer/selectPrevious',
      selectNext: 'explorer/selectNext',
      setScrollTop: 'explorer/setScrollTop',
      changeSortKey: 'explorer/changeSortKey',
      action: 'explorer/action',
      showViewer: 'explorer/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
  // overflow-y: auto;
  // .mdc-table {
  //   border-spacing: 0;
  //   table-layout: fixed;
  //   width: 100%;
  //   .mdc-table-header {
  //     .mdc-table-row {
  //       cursor: pointer;
  //       height: 40px;
  //       .mdc-table-header-column {
  //         border: 0;
  //         color: var(--mdc-theme-text-secondary-on-background);
  //         font-size: smaller;
  //         font-weight: normal;
  //         line-height: 20px;
  //         padding: 8px;
  //         position: sticky;
  //         top: 0;
  //         vertical-align: bottom;
  //         white-space: nowrap;
  //         z-index: 1;
  //         &.size {
  //           width: 64px;
  //         }
  //         &.date-modified {
  //           width: 128px;
  //         }
  //         .mdc-icon {
  //           padding: 0;
  //           vertical-align: bottom;
  //         }
  //       }
  //       &.shadow {
  //         height: 1px;
  //         .mdc-table-header-column {
  //           padding: 0;
  //           position: sticky;
  //           top: 40px;
  //           z-index: 0;
  //           &:after {
  //             bottom: 0;
  //             content:'';
  //             left: 0;
  //             position: absolute;
  //             width: 100%;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // &.scrolling .mdc-table-row.shadow .mdc-table-header-column:after {
  //   box-shadow: 0 0 3px 1px var(--shadow);
  // }
// .explorer-list {
//   height: 100%;
//   overflow: hidden;
// }
// .explorer-list>div {
//   height: 100%;
// }
// .explorer-list /deep/ .table__overflow {
//   height: 100%;
//   overflow-y: auto;
// }
// .explorer-list /deep/ .datatable {
//   background: transparent;
// }
// .explorer-list /deep/ .datatable>thead>tr,
// .explorer-list /deep/ .datatable>tbody>tr {
//   border-bottom: none;
// }
// .explorer-list /deep/ .datatable>thead>tr>th {
//   background: inherit;
//   outline: none;
//   position: sticky;
//   top: 0;
// }
// .explorer-list /deep/ .datatable>tbody>tr>td {
//   cursor: pointer;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
</style>
