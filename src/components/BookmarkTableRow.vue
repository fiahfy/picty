<template>
  <tr
    :active="active"
    class="bookmark-table-row"
    @click="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td :title="bookmark.path">
      <v-layout class="align-center">
        <v-icon class="pa-1" color="blue lighten-3">mdi-folder</v-icon>
        <span class="ellipsis">{{ bookmark.path }}</span>
      </v-layout>
    </td>
    <td class="no-wrap">
      <template v-if="bookmark.added_at">
        {{ bookmark.added_at | moment('YYYY-MM-DD HH:mm') }}
      </template>
    </td>
  </tr>
</template>

<script>
import { layoutBookmarkStore } from '~/store'

export default {
  props: {
    bookmark: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    active() {
      return layoutBookmarkStore.isBookmarkSelected({
        filepath: this.bookmark.path,
      })
    },
    isBookmarkSelected() {
      return layoutBookmarkStore.isBookmarkSelected
    },
  },
  methods: {
    onClick() {
      layoutBookmarkStore.selectBookmark({ filepath: this.bookmark.path })
    },
    onDblClick() {
      layoutBookmarkStore.openBookmark({ filepath: this.bookmark.path })
    },
    onContextMenu() {
      layoutBookmarkStore.selectBookmark({ filepath: this.bookmark.path })
      let template = [
        {
          label: 'Open',
          click: () =>
            layoutBookmarkStore.openBookmark({ filepath: this.bookmark.path }),
          accelerator: 'Enter',
        },
      ]
      const text = getSelection().toString()
      if (text) {
        template = [...template, { type: 'separator' }, { role: 'copy' }]
      }
      template = [
        ...template,
        { type: 'separator' },
        {
          label: 'New Bookmark',
          click: () => layoutBookmarkStore.showDialog(),
          accelerator: 'CmdOrCtrl+N',
        },
        { type: 'separator' },
        {
          label: 'Remove',
          click: () => layoutBookmarkStore.removeBookmark(),
          accelerator: 'CmdOrCtrl+Backspace',
        },
      ]
      this.$contextMenu.open(template)
    },
  },
}
</script>

<style scoped lang="scss">
.bookmark-table-row {
  cursor: pointer;
  td {
    .v-icon {
      user-select: none;
    }
    .v-rating {
      white-space: nowrap;
    }
    span {
      flex: 1;
    }
  }
}
</style>
