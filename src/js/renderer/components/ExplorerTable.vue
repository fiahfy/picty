<template>
  <virtual-data-table
    ref="table"
    :headers="headers"
    :items="files"
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
          <v-icon small>arrow_upward</v-icon>
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
        :active="isSelected({ filepath: props.item.path })"
        @click="select({ filepath: props.item.path })"
        @dblclick="action({ filepath: props.item.path })"
        @contextmenu="(e) => onContextMenu(e, props.item)"
      >
        <td>
          <v-btn
            flat
            icon
            class="my-0"
          >
            <v-icon>star_outline</v-icon>
          </v-btn>
          <v-icon
            :color="getColor(props.item)"
            class="pa-1"
          >{{ getIcon(props.item) }}</v-icon>
          <span>{{ props.item.name }}</span>
        </td>
        <td class="text-xs-right">{{ getSize(props.item) | readableSize }}</td>
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
    ...mapState({
      directory: state => state.directory,
      selectedFilepath: state => state.explorer.selectedFilepath
    }),
    ...mapGetters({
      files: 'explorer/filteredFiles',
      scrollTop: 'explorer/scrollTop',
      sortOption: 'explorer/sortOption',
      selectedIndex: 'explorer/selectedIndex',
      isSelected: 'explorer/isSelected'
    })
  },
  watch: {
    directory () {
      this.restore()
    },
    selectedFilepath (value) {
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
    this.restore()
  },
  methods: {
    getHeaderClass (header) {
      return [
        'column sortable',
        this.sortOption.descending ? 'desc' : 'asc',
        header.value === this.sortOption.key ? 'active' : ''
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
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    changeSort (header) {
      this.changeSortKey({ sortKey: header.value })
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(0)
      })
    },
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
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
.explorer-table {
  outline: none;
  & /deep/ .datatable {
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
}
</style>
