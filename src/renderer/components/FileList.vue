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
        <mdc-table-row
          v-for="file in files"
          :key="file.name"
          :selected="isSelected(file)"
          @click="selectFile(file)"
          @dblclick.native="doubleClick(file)"
        >
          <mdc-table-column class="name">
            <mdc-icon
              :icon="icon(file)"
              :class="icon(file)"
            />
            {{ file.name }}
          </mdc-table-column>
          <mdc-table-column class="date-modified">
            {{ file.stats.mtime | date }}
          </mdc-table-column>
        </mdc-table-row>
      </mdc-table-body>
    </mdc-table>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import MdcIcon from '../components/MdcIcon'
import MdcTable from '../components/MdcTable'
import MdcTableBody from '../components/MdcTableBody'
import MdcTableColumn from '../components/MdcTableColumn'
import MdcTableHeader from '../components/MdcTableHeader'
import MdcTableHeaderColumn from '../components/MdcTableHeaderColumn'
import MdcTableRow from '../components/MdcTableRow'
import { isImage } from '../utils/file'

export default {
  components: {
    MdcIcon,
    MdcTable,
    MdcTableBody,
    MdcTableColumn,
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
    icon (file) {
      if (file.stats.isDirectory()) {
        return 'folder'
      }
      return isImage(file.path) ? 'photo' : 'note'
    },
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
  },
  filters: {
    date (value) {
      const date = new Date(value)
      const Y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const H = String(date.getHours()).padStart(2, '0')
      const i = String(date.getMinutes()).padStart(2, '0')
      return `${Y}-${m}-${d} ${H}:${i}`
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color_palette.scss";

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
}
.mdc-table-column {
  font-size: smaller;
  vertical-align: bottom;
  white-space: nowrap;
  &.name {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
  }
}
.mdc-icon {
  padding: 0;
  vertical-align: bottom;
  &.folder {
    color: $material-color-blue-200;
  }
  &.photo {
    color: $material-color-green-200;
  }
  &.note {
    color: $material-color-grey-300;
  }
}
</style>
