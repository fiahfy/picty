<template>
  <tr
    :active="active"
    class="explorer-table-row"
    @click="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td :title="file.name">
      <v-layout
        slot="activator"
        class="align-center"
      >
        <v-menu
          open-on-hover
          right
          offset-x
          lazy
        >
          <v-icon
            slot="activator"
            :color="color"
            class="icon pa-1"
          >{{ icon }}</v-icon>
          <v-card>
            <v-layout
              v-if="message"
              align-center
              justify-center
            >
              <v-flex class="text-xs-center caption">{{ message }}</v-flex>
            </v-layout>
            <v-img
              v-else
              :src="imageUrl"
              contain
              height="256"
              width="256"
              @error="onError"
            />
          </v-card>
        </v-menu>
        <span class="ellipsis">{{ file.name }}</span>
      </v-layout>
    </td>
    <td class="text-xs-right">
      {{ file.views || '' }}
    </td>
    <td
      class="text-xs-right"
      @click.stop
      @dblclick.stop
    >
      <v-rating
        v-model="rating"
        half-increments
        clearable
      />
    </td>
    <td class="text-xs-right">
      <template v-if="file.modified_at">{{ file.modified_at | moment('YYYY-MM-DD HH:mm') }}</template>
    </td>
  </tr>
</template>

<script>
import fileUrl from 'file-url'
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      error: false
    }
  },
  computed: {
    rating: {
      get () {
        return this.file.rating
      },
      set (value) {
        this.$store.dispatch('local/explorer/updateFileRating', { filepath: this.file.path, rating: value })
      }
    },
    active () {
      return this.isFileSelected({ filepath: this.file.path })
    },
    color () {
      if (this.file.exists) {
        return this.file.directory ? 'blue lighten-3' : 'green lighten-3'
      }
      return 'grey'
    },
    icon () {
      if (this.file.exists) {
        return this.file.directory ? 'folder' : 'photo'
      }
      return 'broken_image'
    },
    imageUrl () {
      const imagePath = this.file.imagePath
      return imagePath ? fileUrl(imagePath) : null
    },
    message () {
      if (this.error) {
        return 'Load failed'
      }
      if (this.imageUrl === null) {
        return 'No preview'
      }
      return ''
    },
    ...mapGetters('local/explorer', [
      'isFileSelected'
    ])
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
          click: () => this.viewFile({ filepath: this.file.path }),
          accelerator: 'Enter'
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
            click: () => this.searchFiles({ query: text }),
            accelerator: 'CmdOrCtrl+F'
          }
        ]
      }
      ContextMenu.show(e, templates)
    },
    onError () {
      this.error = true
    },
    ...mapActions('local/explorer', [
      'selectFile',
      'searchFiles',
      'openFile',
      'viewFile'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-table-row {
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
.v-menu__content>.v-card>.layout {
  height: 256px;
  width: 256px;
}
</style>
