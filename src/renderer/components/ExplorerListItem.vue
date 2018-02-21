<template>
  <mdc-table-row
    class="explorer-list-item"
    :selected="selected"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <mdc-table-column class="name">
      <div>
        <mdc-icon
          :icon="icon"
          :class="icon"
        />
        <span class="filename">{{ file.name }}</span>
      </div>
    </mdc-table-column>
    <mdc-table-column class="size">
      <template v-if="size !== null">{{ size | readableSize }}</template>
    </mdc-table-column>
    <mdc-table-column class="date-modified">
      {{ file.mtime | moment('YYYY-MM-DD HH:mm') }}
    </mdc-table-column>
  </mdc-table-row>
</template>

<script>
import MdcIcon from './MdcIcon'
import MdcTableColumn from './MdcTableColumn'
import MdcTableRow from './MdcTableRow'

export default {
  components: {
    MdcIcon,
    MdcTableColumn,
    MdcTableRow
  },
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
  computed: {
    icon () {
      return this.file.directory ? 'folder' : 'photo'
    },
    size () {
      return this.file.directory ? null : this.file.size
    }
  }
}
</script>

<style scoped lang="scss">
.explorer-list-item {
  cursor: pointer;
  height: 41px;
  .mdc-table-column {
    line-height: 20px;
    padding: 8px;
    vertical-align: bottom;
    white-space: nowrap;
    &.name {
      div {
        display: flex;
        .filename {
          flex: 1;
          margin: 0 0 0 4px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
        }
        &>* {
          align-self: flex-end;
        }
      }
    }
    &.size {
      text-align: right;
    }
    .mdc-icon {
      padding: 0;
      vertical-align: bottom;
      &.folder {
        color: var(--icon-folder);
      }
      &.photo {
        color: var(--icon-photo);
      }
    }
  }
  &:hover .mdc-table-column {
    background-color: var(--hover);
  }
  &.selected .mdc-table-column {
    background-color: var(--selected);
  }
}
.explorer-list:focus .explorer-list-item.selected .mdc-table-column {
  background-color: var(--focus);
}
</style>
