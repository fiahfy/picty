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
            @click="changeSortKey({ key: 'name' })"
          >
            <span>Name</span>
            <mdc-icon
              :icon="sortIcon"
              v-if="sortKey === 'name'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="size"
            :sticky="true"
            @click="changeSortKey({ key: 'size' })"
          >
            <span>Size</span>
            <mdc-icon
              :icon="sortIcon"
              v-if="sortKey === 'size'"
            />
          </mdc-table-header-column>
          <mdc-table-header-column
            class="date-modified"
            :sticky="true"
            @click="changeSortKey({ key: 'date_modified' })"
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
          @click="selectFile({ file: item })"
          @dblclick="doubleClick(item)"
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
    this.restoreScroll()
  },
  beforeDestroy () {
    this.$el.removeEventListener('scroll', this.scroll)
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
    restoreScroll () {
      this.$nextTick(() => {
        this.$el.scrollTop = this.scrollTop
      })
    },
    ...mapActions('explorer', [
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
      this.restoreScroll()
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
