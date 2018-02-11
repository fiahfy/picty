<template>
  <div class="explorer-list" :class="classes">
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
        <explorer-list-item
          slot-scope="{ item, index }"
          :key="item.name"
          :file="item"
          :selected="isSelectedFile({ filepath: item.path })"
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
import ExplorerListItem from './ExplorerListItem'
import MdcIcon from './MdcIcon'
import MdcTable from './MdcTable'
import MdcTableBody from './MdcTableBody'
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
    MdcTableBody,
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
      directory: state => state.explorer.directory,
      selectedFile: state => state.explorer.selectedFile
    }),
    ...mapGetters({
      files: 'explorer/filteredFiles',
      scrollTop: 'explorer/scrollTop',
      sortOption: 'explorer/sortOption',
      selectedIndex: 'explorer/selectedIndex',
      isSelectedFile: 'explorer/isSelectedFile'
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
      this.selectFile({ filepath: file.path })
      ContextMenu.show(e, [{
        label: 'View',
        click: () => {
          this.showFile({ filepath: file.path })
        },
        accelerator: 'Enter'
      }])
    },
    ...mapActions({
      selectFile: 'explorer/selectFile',
      selectPreviousFile: 'explorer/selectPreviousFile',
      selectNextFile: 'explorer/selectNextFile',
      setScrollTop: 'explorer/setScrollTop',
      changeSortKey: 'explorer/changeSortKey',
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
@import "~@material/theme/_color-palette";

.explorer-list {
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
.mdc-theme--dark .explorer-list {
   .mdc-table .mdc-table-row.shadow .mdc-table-header-column:after {
    border-bottom-color: $material-color-grey-600;
  }
  &.scrolling .mdc-table .mdc-table-row.shadow .mdc-table-header-column:after {
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.9);
  }
}
</style>
