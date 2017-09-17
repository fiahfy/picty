<template>
  <mdc-table
    class="file-list"
    tabindex="-1"
    @keydown.native="keydown"
  >
    <mdc-table-header>
      <mdc-table-row>
        <mdc-table-header-column
          class="name"
          @click.native="changeSort('name')"
        >
          <span>Name</span>
          <mdc-icon
            :icon="sortIcon"
            v-if="sortKey === 'name'"
          />
        </mdc-table-header-column>
        <mdc-table-header-column
          class="date-modified"
          @click.native="changeSort('date_modified')"
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
        :file="file"
        :key="file.name"
        :class="{selected: isSelected(file)}"
        @click.native="selectFile(file)"
        @dblclick.native="doubleClick(file)"
        v-for="file in files"
      />
    </mdc-table-body>
  </mdc-table>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
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
      'files',
      'selectedFile',
      'sortKey',
      'sortOrder'
    ])
  },
  methods: {
    isSelected (file) {
      return file.path === this.selectedFile.path
    },
    doubleClick (file) {
      if (file.stats.isDirectory()) {
        this.changeDirectory(file.path)
      } else {
        this.showViewer(file)
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
    ...mapMutations('explorer', [
      'selectFile',
      'selectPreviousFile',
      'selectNextFile'
    ]),
    ...mapActions('explorer', [
      'changeDirectory',
      'changeSort'
    ]),
    ...mapActions('viewer', [
      'showViewer'
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
    files () {
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
  background-color: white;
  font-size: smaller;
  position: sticky;
  top: 0;
  vertical-align: bottom;
  &.date-modified {
    width: 128px;
  }
  .mdc-icon {
    padding: 0;
    vertical-align: bottom;
  }
}
.mdc-theme--dark {
  .mdc-table-header-column {
    background-color: #303030;
  }
}
</style>
