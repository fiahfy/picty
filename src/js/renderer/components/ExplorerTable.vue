<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="files"
    :search="query"
    :pagination.sync="pagination"
    v-model="selected"
    class="explorer-table"
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
      <tr>
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="getHeaderClass(header)"
          :style="getHeaderStyle(header)"
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
        @click="selectIndex(props.index)"
        @dblclick="action({ filepath: props.item.path })"
        @contextmenu="(e) => onContextMenu(e, props.item)"
      >
        <td>
          <v-icon class="pa-1">star_outline</v-icon>
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
      selected: [],
      search: '',
      pagination: {
        sortBy: 'name',
        rowsPerPage: -1
      },
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
          width: 128,
          descending: true
        }
      ]
    }
  },
  computed: {
    query: {
      get () {
        return this.$store.state.explorer.query
      },
      set (value) {
        this.$store.commit('explorer/setQuery', { query: value })
      }
    },
    filteredItems () {
      return this.$refs.table.filteredItems
    },
    selectedIndex () {
      const path = this.selected.length ? this.selected[0].path : null
      return this.filteredItems.findIndex((item) => item.path === path)
    },
    ...mapState({
      files: state => state.explorer.files,
      directory: state => state.explorer.directory,
      selectedFilepath: state => state.explorer.selectedFilepath
    }),
    ...mapGetters({
      currentScrollTop: 'explorer/currentScrollTop',
      currentPagination: 'explorer/currentPagination'
    })
  },
  watch: {
    pagination (value) {
      this.setPagination({ pagination: value })
    },
    directory () {
      this.restore()
    },
    selected (value) {
      if (value.length) {
        this.select({ filepath: value[0].path })
      }
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
        } else if (el.offsetTop + el.offsetHeight > table.scrollTop + table.offsetHeight) {
          this.$refs.table.setScrollTop(el.offsetTop + el.offsetHeight - table.offsetHeight + headerHeight - rowHeight)
        }
      })
    }
  },
  mounted () {
    this.restore()
  },
  methods: {
    getHeaderClass (header) {
      return [
        'column sortable',
        header.descending ? (this.pagination.descending ? 'asc' : 'desc') : (this.pagination.descending ? 'desc' : 'asc'),
        header.value === this.pagination.sortBy ? 'active' : ''
      ]
    },
    getHeaderStyle (header) {
      return {
        'box-sizing': 'content-box',
        width: header.width ? `${header.width}px` : null
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
    restore () {
      if (this.currentPagination) {
        this.pagination = this.currentPagination
      }
      this.selected = []
      const scrollTop = this.currentScrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
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
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(0)
      })
    },
    selectIndex (index) {
      if (index < 0 || index > this.filteredItems.length - 1) {
        return
      }
      this.selected = [this.filteredItems[index]]
    },
    onScroll ({ scrollTop }) {
      this.setScrollTop({ scrollTop })
    },
    onKeyDown (e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.showViewer({ filepath: this.selectedFilepath })
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectIndex(0)
          } else {
            this.selectIndex(this.selectedIndex - 1)
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectIndex(this.filteredItems.length - 1)
          } else {
            this.selectIndex(this.selectedIndex + 1)
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
    onContextMenu (e, file) {
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
      setScrollTop: 'explorer/setScrollTop',
      setPagination: 'explorer/setPagination',
      action: 'explorer/action',
      showViewer: 'explorer/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-table /deep/ .datatable {
  table-layout: fixed;
  tr {
    cursor: pointer;
    &>td {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
