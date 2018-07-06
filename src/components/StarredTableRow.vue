<template>
  <tr
    :active="active"
    class="starred-table-row"
    @click="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td class="pl-2 ellipsis">
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
        <span class="ellipsis">{{ file.name }}</span>
      </v-layout>
    </td>
    <td class="ellipsis">{{ file.dirname }}</td>
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
      isSelectedFile: 'starred/isSelectedFile',
      isStarredFile: 'starred/isStarredFile'
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
      selectFile: 'starred/selectFile',
      searchFiles: 'starred/searchFiles',
      openFile: 'starred/openFile',
      viewFile: 'starred/viewFile',
      toggleFileStarred: 'starred/toggleFileStarred'
    })
  }
}
</script>

<style scoped lang="scss">
.starred-table-row {
  cursor: pointer;
  td {
    .v-icon {
      user-select: none;
    }
    span {
      flex: 1;
    }
  }
}
</style>
