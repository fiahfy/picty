<template>
  <div class="file-list">
    <div class="error" v-if="error">
      <span>{{ error.message }}</span>
    </div>
    <mdc-table v-else>
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
  </div>
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
      'error',
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
    ...mapMutations('explorer', [
      'selectFile'
    ]),
    ...mapActions('explorer', [
      'changeDirectory',
      'changeSort'
    ]),
    ...mapActions('viewer', [
      'showViewer'
    ])
  },
  watch: {
    files () {
      this.$el.scrollTop = 0
    }
  }
}
</script>

<style scoped lang="scss">
.file-list {
  height: 100%;
  overflow-y: auto;
}
.error {
  display: table;
  height: 100%;
  vertical-align: middle;
  width: 100%;
  span {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
}
.mdc-table {
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
