<template>
  <mdc-table-row class="bookmark-list-item" :selected="selected" v-bind="$attrs" v-on="$listeners">
    <mdc-table-column class="name">
      <mdc-icon :icon="icon" :class="icon" />
      {{ file.name }}
    </mdc-table-column>
    <mdc-table-column class="size">
      <template v-if="size !== null">{{ size | readableSize }}</template>
    </mdc-table-column>
    <mdc-table-column class="date-modified">
      <template v-if="mtime !== null">{{ mtime | moment('YYYY-MM-DD HH:mm') }}</template>
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import MdcIcon from './MdcIcon'
import MdcTableColumn from './MdcTableColumn'
import MdcTableRow from './MdcTableRow'

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
    icon () {
      if (!this.file.exists()) {
        return 'broken_image'
      }
      return this.file.isDirectory() ? 'folder' : 'photo'
    },
    size () {
      return this.file.exists() && !this.file.isDirectory() ? this.file.size : null
    },
    mtime () {
      return this.file.exists() ? this.file.mtime : null
    }
  }
}
</script>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

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
    &.broken_image {
      color: $material-color-grey-400;
    }
  }
}
</style>
