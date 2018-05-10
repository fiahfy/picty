<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="files"
    :pagination.sync="pagination"
    v-model="selected"
    class="explorer-table"
    item-key="path"
    hide-actions
    must-sort
    sticky-headers
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <tr>
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="['column sortable', header.descending ? (pagination.descending ? 'asc' : 'desc') : (pagination.descending ? 'desc' : 'asc'), header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header)"
        >
          <v-icon small>{{ header.descending ? 'arrow_downward' : 'arrow_upward' }}</v-icon>
          {{ header.text }}
        </th>
      </tr>
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <tr
        :key="props.item.path"
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
  </virtual-data-table>
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
import VirtualDataTable from './VirtualDataTable'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    VirtualDataTable
  },
  data () {
    return {
      scrolling: false,
      pagination: {
        sortBy: 'size',
        rowsPerPage: -1
      },
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
          value: 'mtime',
          descending: true
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
    this.$el.querySelector('.table__overflow').addEventListener('scroll', this.scroll)
    this.$nextTick(() => {
      this.$el.scrollTop = this.scrollTop
    })
  },
  beforeDestroy () {
    this.$el.querySelector('.table__overflow').removeEventListener('scroll', this.scroll)
  },
  methods: {
    changeSort (header) {
      if (this.pagination.sortBy === header.value) {
        this.pagination = {
          ...this.pagination,
          descending: !this.pagination.descending
        }
      } else {
        this.pagination = {
          ...this.pagination,
          sortBy: header.value,
          descending: header.descending
        }
      }
    },
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
      console.log(props)
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
// .explorer-table {
//   height: 100%;
//   overflow: hidden;
// }
// .explorer-table>div {
//   height: 100%;
// }
// .explorer-table /deep/ .datatable {
//   background: transparent;
// }
// .explorer-table /deep/ .datatable>thead>tr,
// .explorer-table /deep/ .datatable>tbody>tr {
//   border-bottom: none;
// }
// .explorer-table /deep/ .datatable>thead>tr>th {
//   background: inherit;
//   outline: none;
//   position: sticky;
//   top: 0;
// }
// .explorer-table /deep/ .datatable>tbody>tr>td {
//   cursor: pointer;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
// .explorer-table {
//   flex: 1;
// }
</style>
