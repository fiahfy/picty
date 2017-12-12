<template>
  <mdc-table-row class="file-list-item">
    <mdc-table-column class="name">
      <mdc-icon :icon="icon" :class="icon"/>
      {{ file.name }}
    </mdc-table-column>
    <mdc-table-column class="size">
      <template v-if="!directory">{{ this.file.stats.size | readableSize }}</template>
    </mdc-table-column>
    <mdc-table-column class="date-modified">
      {{ file.stats.mtime | moment('YYYY-MM-DD HH:mm') }}
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import MdcIcon from '../components/MdcIcon'
import MdcTableColumn from '../components/MdcTableColumn'
import MdcTableRow from '../components/MdcTableRow'
import { isImage } from '../utils/file'

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  components: {
    MdcIcon,
    MdcTableColumn,
    MdcTableRow
  },
  computed: {
    directory () {
      return this.file.stats.isDirectory()
    },
    icon () {
      if (this.directory) {
        return 'folder'
      }
      return isImage(this.file.path) ? 'photo' : 'note'
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.mdc-table-column {
  font-size: smaller;
  line-height: 20px;
  vertical-align: bottom;
  white-space: nowrap;
  &.name {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
  }
  &.size {
    text-align: right;
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
    color: $material-color-grey-400;
  }
}
</style>
