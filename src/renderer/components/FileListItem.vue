<template>
  <mdc-table-row class="file-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="name">
      <mdc-icon :icon="icon" :class="icon" />
      {{ file.name }}
    </mdc-table-column>
    <mdc-table-column class="size">
      <template v-if="!directory">{{ this.file.size | readableSize }}</template>
    </mdc-table-column>
    <mdc-table-column class="date-modified">
      {{ file.mtime | moment('YYYY-MM-DD HH:mm') }}
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import MdcIcon from '../components/MdcIcon'
import MdcTableColumn from '../components/MdcTableColumn'
import MdcTableRow from '../components/MdcTableRow'

export default {
  props: {
    file: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MdcIcon,
    MdcTableColumn,
    MdcTableRow
  },
  computed: {
    directory () {
      return this.file.isDirectory()
    },
    icon () {
      return this.directory ? 'folder' : 'photo'
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.mdc-table-column {
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
  .mdc-icon {
    padding: 0;
    vertical-align: bottom;
    &.folder {
      color: $material-color-blue-200;
    }
    &.photo {
      color: $material-color-green-200;
    }
  }
}
</style>
