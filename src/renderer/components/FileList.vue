<template>
  <mdc-table
    class="file-list"
    tabindex="-1"
    @keydown.native="keydown"
  >
    <mdc-table-header>
      <mdc-table-row>
        <mdc-table-header-column
          class="name mdc-theme--background"
          @click.native="changeSortKey('name')"
        >
          <span>Name</span>
          <mdc-icon
            :icon="sortIcon"
            v-if="sortKey === 'name'"
          />
        </mdc-table-header-column>
        <mdc-table-header-column
          class="date-modified mdc-theme--background"
          @click.native="changeSortKey('date_modified')"
        >
          <span>Date Modified</span>
          <mdc-icon
            :icon="sortIcon"
            v-if="sortKey === 'date_modified'"
          />
        </mdc-table-header-column>
      </mdc-table-row>
    </mdc-table-header>
    <mdc-table-body>
      <file-list-item
        :key="file.name"
        :file="file"
        :class="{ selected: isSelected(file) }"
        @click.native="selectFile(file)"
        @dblclick.native="doubleClick(file)"
        v-for="file in files"
      />
    </mdc-table-body>
  </mdc-table>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import FileListItem from '../components/FileListItem'
import MdcIcon from '../components/MdcIcon'
import MdcTable from '../components/MdcTable'
import MdcTableBody from '../components/MdcTableBody'
import MdcTableHeader from '../components/MdcTableHeader'
import MdcTableHeaderColumn from '../components/MdcTableHeaderColumn'
import MdcTableRow from '../components/MdcTableRow'

export default {
  components: {
    FileListItem,
    MdcIcon,
    MdcTable,
    MdcTableBody,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow
  },
  computed: {
    sortIcon () {
      return this.sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    ...mapState('explorer', [
      'directory',
      'files',
      'selectedFile',
      'sortKey',
      'sortOrder'
    ])
  },
  methods: {
    isSelected (file) {
      return this.selectedFile && file.path === this.selectedFile.path
    },
    doubleClick (file) {
      if (file.stats.isDirectory()) {
        this.changeDirectory(file.path)
      } else {
        this.showSelectedFile()
      }
    },
    keydown (e) {
      if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
        return
      }
      switch (e.keyCode) {
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
    ...mapActions('explorer', [
      'changeDirectory',
      'changeSortKey',
      'selectFile',
      'selectPreviousFile',
      'selectNextFile'
    ]),
    ...mapActions('viewer', [
      'showSelectedFile'
    ])
  },
  updated () {
    const el = this.$el.querySelector('.selected')
    const parent = this.$el.parentNode
    if (!el || !parent) {
      return
    }
    if (el.offsetTop - el.offsetHeight < parent.scrollTop) {
      parent.scrollTop = el.offsetTop - el.offsetHeight
    } else if (el.offsetTop + el.offsetHeight > parent.scrollTop + parent.offsetHeight) {
      parent.scrollTop = el.offsetTop + el.offsetHeight - parent.offsetHeight
    }
  },
  watch: {
    directory () {
      this.$el.parentNode.scrollTop = 0
    }
  }
}
</script>

<style scoped lang="scss">
.mdc-table {
  outline: none;
  table-layout: fixed;
}
.mdc-table-row {
  cursor: pointer;
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
}
.mdc-icon {
  padding: 0;
  vertical-align: bottom;
}
</style>
