<template>
  <div class="file-list">
    <mdc-table
      tabindex="0"
      @keydown.native="keydown"
    >
      <mdc-table-header>
        <mdc-table-row>
          <mdc-table-header-column
            class="mdc-theme--background name"
            @click.native="changeSortKey({ key: 'name' })"
          >
            <span>Name</span>
            <mdc-icon
              :icon="sortIcon"
              v-if="sortKey === 'name'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="mdc-theme--background size"
            @click.native="changeSortKey({ key: 'size' })"
          >
            <span>Size</span>
            <mdc-icon
              :icon="sortIcon"
              v-if="sortKey === 'size'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="mdc-theme--background date-modified"
            @click.native="changeSortKey({ key: 'date_modified' })"
          >
            <span>Date Modified</span>
            <mdc-icon
              :icon="sortIcon"
              v-if="sortKey === 'date_modified'"
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
          @click.native="selectFile({ file: item })"
          @dblclick.native="doubleClick(item)"
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
  },
  computed: {
    sortIcon () {
      return this.sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    ...mapState('explorer', [
      'directory',
      'files'
    ]),
    ...mapGetters('explorer', [
      'selectedIndex',
      'scrollTop',
      'sortKey',
      'sortOrder'
    ])
  },
  methods: {
    selected (index) {
      return index === this.selectedIndex
    },
    doubleClick (file) {
      this.action({ filepath: file.path })
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
        case 37:
          e.preventDefault()
          this.changeParentDirectory()
          break
        case 38:
          e.preventDefault()
          this.selectPreviousFile()
          break
        case 39:
          e.preventDefault()
          this.changeSelectedDirectory()
          break
        case 40:
          e.preventDefault()
          this.selectNextFile()
          break
      }
    },
    fixScroll () {
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
    },
    ...mapActions('explorer', [
      'changeParentDirectory',
      'changeSelectedDirectory',
      'changeSortKey',
      'selectFile',
      'selectPreviousFile',
      'selectNextFile',
      'scroll',
      'action'
    ]),
    ...mapActions('viewer', [
      'showSelectedFile'
    ])
  },
  watch: {
    directory () {
      this.$nextTick(() => {
        this.$el.scrollTop = this.scrollTop
      })
    },
    files () {
      this.fixScroll()
    },
    selectedIndex () {
      this.fixScroll()
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
  font-size: smaller;
  line-height: 20px;
  position: sticky;
  top: 0;
  vertical-align: bottom;
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
