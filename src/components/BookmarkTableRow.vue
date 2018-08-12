<template>
  <tr
    :active="active"
    class="bookmark-table-row"
    @click="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td>
      <v-layout class="align-center">
        <v-icon
          class="pa-1"
          color="blue lighten-3"
        >folder</v-icon>
        <span class="ellipsis">{{ bookmark.path }}</span>
      </v-layout>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    bookmark: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    active () {
      return this.isBookmarkSelected({ filepath: this.bookmark.path })
    },
    ...mapGetters('local/bookmark', [
      'isBookmarkSelected'
    ])
  },
  methods: {
    onClick () {
      this.selectBookmark({ filepath: this.bookmark.path })
    },
    onDblClick () {
      this.openBookmark({ filepath: this.bookmark.path })
    },
    onContextMenu (e) {
      this.selectBookmark({ filepath: this.bookmark.path })
      const templates = [
        {
          label: 'Open',
          click: () => {
            this.openBookmark({ filepath: this.bookmark.path })
          },
          accelerator: 'Enter'
        }
      ]
      ContextMenu.show(e, templates)
    },
    ...mapActions('local/bookmark', [
      'selectBookmark',
      'openBookmark'
    ])
  }
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
