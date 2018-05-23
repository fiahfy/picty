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
        <v-btn
          flat
          icon
          class="my-0"
          @click="onButtonClick"
        >
          <v-icon :color="starColor">{{ starIcon }}</v-icon>
        </v-btn>
        <v-icon
          :color="fileColor"
          class="pa-1"
        >{{ fileIcon }}</v-icon>
        <span>{{ item.name }}</span>
      </v-layout>
    </td>
    <td>{{ item.dirpath }}</td>
    <td class="text-xs-right">{{ fileSize | readableSize }}</td>
    <td class="text-xs-right">
      <template v-if="item.mtime">{{ item.mtime | moment('YYYY-MM-DD HH:mm') }}</template>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    active () {
      return this.isSelected({ filepath: this.item.path })
    },
    bookmarked () {
      return this.isBookmarked({ filepath: this.item.path })
    },
    starColor () {
      return this.bookmarked ? 'yellow darken-2' : 'grey'
    },
    starIcon () {
      return this.bookmarked ? 'star' : 'star_outline'
    },
    fileColor () {
      if (this.item.exists) {
        return this.item.directory ? 'blue lighten-3' : 'green lighten-3'
      }
      return 'grey'
    },
    fileIcon () {
      if (this.item.exists) {
        return this.item.directory ? 'folder' : 'photo'
      }
      return 'broken_image'
    },
    fileSize () {
      return this.item.directory ? null : this.item.size
    },
    ...mapGetters({
      isSelected: 'app/bookmark/isSelected',
      isBookmarked: 'app/bookmark/isBookmarked'
    })
  },
  methods: {
    onClick () {
      this.select({ filepath: this.item.path })
    },
    onDblClick () {
      this.action({ filepath: this.item.path })
    },
    onContextMenu (e) {
      this.select({ filepath: this.item.path })
      let templates = [
        {
          label: this.bookmarked ? 'Unstar' : 'Star',
          click: () => {
            this.toggleBookmarked({ filepath: this.item.path })
          },
          accelerator: 'CmdOrCtrl+D'
        },
        {
          label: 'View',
          click: () => {
            this.showViewer({ filepath: this.item.path })
          },
          accelerator: 'Enter'
        }
      ]
      if (getSelection().toString()) {
        templates = [
          ...templates,
          { type: 'separator' },
          { role: ContextMenu.Role.copy }
        ]
      }
      ContextMenu.show(e, templates)
    },
    onButtonClick () {
      this.toggleBookmarked({ filepath: this.item.path })
    },
    ...mapActions({
      select: 'app/bookmark/select',
      action: 'app/bookmark/action',
      showViewer: 'app/bookmark/showViewer',
      toggleBookmarked: 'app/bookmark/toggleBookmarked'
    })
  }
}
</script>

<style scoped lang="scss">
.bookmark-table-row {
  cursor: pointer;
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
