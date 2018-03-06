<template>
  <mdc-table-row
    :class="classes"
    v-bind="$attrs"
    class="bookmark-list-item"
    v-on="$listeners"
  >
    <mdc-table-column class="name">
      <div>
        <mdc-icon
          :icon="icon"
          :class="icon"
        />
        <span class="filename">{{ file.name }}</span>
        <span class="direpath">{{ file.dirpath }}</span>
      </div>
    </mdc-table-column>
    <mdc-table-column class="size">
      <template v-if="size !== null">{{ size | readableSize }}</template>
    </mdc-table-column>
    <mdc-table-column class="date-modified">
      <template v-if="file.mtime !== null">{{ file.mtime | moment('YYYY-MM-DD HH:mm') }}</template>
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
    classes () {
      return {
        selected: this.selected
      }
    },
    icon () {
      if (!this.file.exists) {
        return 'broken_image'
      }
      return this.file.directory ? 'folder' : 'photo'
    },
    size () {
      return this.file.directory ? null : this.file.size
    }
  }
}
</script>

<style scoped lang="scss">
.bookmark-list-item {
  cursor: pointer;
  height: 41px;
  .mdc-table-column {
    color: var(--mdc-theme-text-primary-on-background);
    line-height: 20px;
    padding: 8px;
    vertical-align: bottom;
    white-space: nowrap;
    &.name {
      div {
        display: flex;
        .mdc-icon {
          user-select: none;
        }
        .filename {
          margin: 0 4px;
        }
        .direpath {
          color: var(--mdc-theme-text-secondary-on-background);
          direction: rtl;
          flex: 1;
          font-size: smaller;
          overflow: hidden;
          text-align: right;
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
      &.broken_image {
        color: var(--icon-broken);
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
.bookmark-list:focus .bookmark-list-item.selected .mdc-table-column {
  background-color: var(--focus);
}
</style>
