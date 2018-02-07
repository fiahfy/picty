<template>
  <div class="file-list">
    <mdc-table
      tabindex="0"
      @keydown="keydown"
    >
      <mdc-table-header>
        <mdc-table-row>
          <mdc-table-header-column
            class="name"
            :sticky="true"
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
            :sticky="true"
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
            :sticky="true"
            @click="e => click(e, 'date_modified')"
          >
            <span>Date Modified</span>
            <mdc-icon
              :icon="icon"
              v-if="sortOption.key === 'date_modified'"
            />
          </mdc-table-header-column>
        </mdc-table-row>
      </mdc-table-header>
      <mdc-virtual-table-body
        :items="files"
        :estimatedHeight="41"
      >
        <file-list-item
          slot-scope="{ item, index }"
          :key="item.name"
          :file="item"
          :selected="selected(index)"
          @click="selectFile({ filepath: item.path })"
          @dblclick="action({ filepath: item.path })"
          @contextmenu="e => contextmenu(e, item)"
        />
      </mdc-virtual-table-body>
    </mdc-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import FileListItem from '../components/FileListItem'
import MdcIcon from '../components/MdcIcon'
import MdcTable from '../components/MdcTable'
import MdcTableBody from '../components/MdcTableBody'
import MdcTableHeader from '../components/MdcTableHeader'
import MdcTableHeaderColumn from '../components/MdcTableHeaderColumn'
import MdcTableRow from '../components/MdcTableRow'
import MdcVirtualTableBody from '../components/MdcVirtualTableBody'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    FileListItem,
    MdcIcon,
    MdcTable,
    MdcTableBody,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow,
    MdcVirtualTableBody
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
    icon () {
      return this.sortOption.order === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    ...mapState({
      directory: state => state.explorer.directory,
      files: state => state.explorer.files,
      selectedFile: state => state.explorer.selectedFile
    }),
    ...mapGetters({
      selectedIndex: 'explorer/selectedIndex',
      scrollTop: 'explorer/scrollTop',
      sortOption: 'explorer/sortOption'
    })
  },
  methods: {
    selected (index) {
      return index === this.selectedIndex
    },
    keydown (e) {
      if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
        return
      }
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.showSelectedFile()
          break
        case 38:
          e.preventDefault()
          this.selectPreviousFile()
          break
        case 40:
          e.preventDefault()
          this.selectNextFile()
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
      ContextMenu.show(e, [{
        label: 'View',
        click: () => {
          this.showFile({ filepath: file.path })
        },
        accelerator: 'Enter'
      }])
    },
    ...mapActions({
      changeSortKey: 'explorer/changeSortKey',
      selectFile: 'explorer/selectFile',
      selectPreviousFile: 'explorer/selectPreviousFile',
      selectNextFile: 'explorer/selectNextFile',
      scroll: 'explorer/scroll',
      action: 'explorer/action',
      showSelectedFile: 'viewer/showSelectedFile',
      showFile: 'viewer/showFile'
    })
  },
  watch: {
    directory () {
      this.$nextTick(() => {
        this.$el.scrollTop = this.scrollTop
      })
    },
    selectedFile () {
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
.file-list {
  height: 100%;
  overflow-y: scroll;
}
.mdc-table {
  outline: none;
  table-layout: fixed;
}
.mdc-table-row {
  cursor: pointer;
  height: 41px;
}
.mdc-table-header-column {
  line-height: 20px;
  vertical-align: bottom;
  white-space: nowrap;
  &.date-modified {
    width: 128px;
  }
  &.size {
    width: 64px;
  }
}
.mdc-icon {
  padding: 0;
  vertical-align: bottom;
}
</style>
