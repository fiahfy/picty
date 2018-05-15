<template>
  <tr
    :active="isSelected({ filepath: item.path })"
    class="explorer-table-row"
    @click="select({ filepath: item.path })"
    @dblclick="action({ filepath: item.path })"
    @contextmenu="onContextMenu"
  >
    <td>
      <v-btn
        flat
        icon
        class="my-0"
        @click="toggleBookmark({ filepath: item.path })"
      >
        <v-icon :color="starColor">{{ starIcon }}</v-icon>
      </v-btn>
      <v-icon
        :color="fileColor"
        class="pa-1"
      >{{ fileIcon }}</v-icon>
      <span>{{ item.name }}</span>
    </td>
    <td class="text-xs-right">{{ fileSize | readableSize }}</td>
    <td class="text-xs-right">{{ item.mtime | moment('YYYY-MM-DD HH:mm') }}</td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '../utils/context-menu'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    starColor () {
      return this.isBookmarked({ filepath: this.item.path }) ? 'yellow darken-2' : 'grey'
    },
    starIcon () {
      return this.isBookmarked({ filepath: this.item.path }) ? 'star' : 'star_outline'
    },
    fileIcon () {
      return this.item.directory ? 'folder' : 'photo'
    },
    fileColor () {
      return this.item.directory ? 'blue lighten-3' : 'green lighten-3'
    },
    fileSize () {
      return this.item.directory ? null : this.item.size
    },
    ...mapGetters({
      isSelected: 'explorer/isSelected',
      isBookmarked: 'explorer/isBookmarked'
    })
  },
  methods: {
    onContextMenu (e) {
      this.select({ filepath: this.item.path })
      ContextMenu.show(e, [
        {
          label: this.isBookmarked({ filepath: this.item.path }) ? 'Unstar' : 'Star',
          click: () => {
            this.toggleBookmark({ filepath: this.item.path })
          },
          accelerator: 'CmdOrCtrl+D'
        },
        {
          label: 'View',
          click: () => {
            this.showViewer({ filepath: this.item.path })
          },
          accelerator: 'Enter'
        },
        { type: 'separator' },
        { role: ContextMenu.Role.copy }
      ])
    },
    ...mapActions({
      select: 'explorer/select',
      action: 'explorer/action',
      showViewer: 'explorer/showViewer',
      toggleBookmark: 'explorer/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-table-row {
  cursor: pointer;
  &>td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &>span {
      line-height: 48px;
    }
  }
}
</style>
