<template>
  <tr
    :active="active"
    class="explorer-table-row"
    @click="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td class="pl-2">
      <v-layout class="align-center">
        <v-btn
          class="my-0"
          flat
          icon
          @click="onButtonClick"
        >
          <v-icon :color="starColor">{{ starIcon }}</v-icon>
        </v-btn>
        <v-icon
          :color="fileColor"
          class="pa-1"
        >{{ fileIcon }}</v-icon>
        <span>{{ file.name }}</span>
      </v-layout>
    </td>
    <td class="text-xs-right">{{ fileSize | readableSize }}</td>
    <td class="text-xs-right">
      <template v-if="file.mtime">{{ file.mtime | moment('YYYY-MM-DD HH:mm') }}</template>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    active () {
      return this.isSelectedFile({ filepath: this.file.path })
    },
    starred () {
      return this.isStarredFile({ filepath: this.file.path })
    },
    starColor () {
      return this.starred ? 'yellow darken-2' : 'grey'
    },
    starIcon () {
      return this.starred ? 'star' : 'star_outline'
    },
    fileColor () {
      if (this.file.exists) {
        return this.file.directory ? 'blue lighten-3' : 'green lighten-3'
      }
      return 'grey'
    },
    fileIcon () {
      if (this.file.exists) {
        return this.file.directory ? 'folder' : 'photo'
      }
      return 'broken_image'
    },
    fileSize () {
      return this.file.directory ? null : this.file.size
    },
    ...mapGetters({
      isSelectedFile: 'explorer/isSelectedFile',
      isStarredFile: 'explorer/isStarredFile'
    })
  },
  methods: {
    onClick () {
      this.selectFile({ filepath: this.file.path })
    },
    onDblClick () {
      this.openFile({ filepath: this.file.path })
    },
    onContextMenu (e) {
      this.selectFile({ filepath: this.file.path })
      let templates = [
        {
          label: 'View',
          click: () => {
            this.viewFile({ filepath: this.file.path })
          },
          accelerator: 'Enter'
        },
        {
          label: this.starred ? 'Unstar' : 'Star',
          click: () => {
            this.toggleFileStarred({ filepath: this.file.path })
          },
          accelerator: 'CmdOrCtrl+D'
        }
      ]
      const text = getSelection().toString()
      if (text) {
        templates = [
          ...templates,
          { type: 'separator' },
          { role: ContextMenu.Role.copy },
          {
            label: `Search "${text}"`,
            click: () => {
              this.searchFiles({ query: text })
            },
            accelerator: 'CmdOrCtrl+F'
          }
        ]
      }
      ContextMenu.show(e, templates)
    },
    onButtonClick () {
      this.toggleFileStarred({ filepath: this.file.path })
    },
    ...mapActions({
      selectFile: 'explorer/selectFile',
      searchFiles: 'explorer/searchFiles',
      openFile: 'explorer/openFile',
      viewFile: 'explorer/viewFile',
      toggleFileStarred: 'explorer/toggleFileStarred'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-table-row {
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
