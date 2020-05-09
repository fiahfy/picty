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
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    bookmark: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    active() {
      return this.isBookmarkSelected({ filepath: this.bookmark.path })
    },
    ...mapGetters('local/bookmark', ['isBookmarkSelected']),
  },
  methods: {
    onClick() {
      this.selectBookmark({ filepath: this.bookmark.path })
    },
    onDblClick() {
      this.openBookmark({ filepath: this.bookmark.path })
    },
    onContextMenu() {
      this.selectBookmark({ filepath: this.bookmark.path })
      let template = [
        {
          label: 'Open',
          click: () => this.openBookmark({ filepath: this.bookmark.path }),
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
          click: () => this.showDialog(),
          accelerator: 'CmdOrCtrl+N',
        },
        { type: 'separator' },
        {
          label: 'Remove',
          click: () => this.removeBookmark(),
          accelerator: 'CmdOrCtrl+Backspace',
        },
      ]
      this.$contextMenu.open(template)
    },
    ...mapActions('local/bookmark', [
      'removeBookmark',
      'selectBookmark',
      'openBookmark',
      'showDialog',
    ]),
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
