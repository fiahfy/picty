<template>
  <v-flex
    class="explorer-grid-list-item"
  >
    <v-card
      :active="active"
      :title="file.name"
      @click.native="onClick"
      @dblclick="onDblClick"
      @contextmenu.stop="onContextMenu"
    >
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
        height="150"
        @error="onError"
      />
      <v-card-title class="pt-2 px-2 pb-0">
        <v-layout class="align-center">
          <v-icon
            :color="color"
            class="pa-1"
          >{{ icon }}</v-icon>
          <span class="ellipsis caption">{{ file.name }}</span>
        </v-layout>
      </v-card-title>
      <v-card-actions class="pa-0 text-xs-center">
        <v-spacer />
        <v-rating
          v-model="rating"
          class="ellipsis"
          half-increments
          small
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import fileUrl from 'file-url'
import { mapActions, mapGetters, mapState } from 'vuex'
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
        const file = {
          ...this.file,
          rating: value
        }
        this.$store.dispatch('local/explorer/updateFile', { file })
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
      if (!this.file.directory) {
        return fileUrl(this.file.path)
      }
      const path = this.directoryImagePathes[this.file.path]
      if (path === null) {
        return path
      }
      return path ? fileUrl(path) : ''
    },
    message () {
      if (this.error) {
        return 'Load failed'
      }
      if (this.imageUrl === null) {
        return 'No image'
      }
      return ''
    },
    ...mapState('local/explorer', [
      'directoryImagePathes'
    ]),
    ...mapGetters('local/explorer', [
      'isFileSelected',
      'isFileAvailable'
    ])
  },
  created () {
    if (this.file.directory) {
      this.requestDirectoryImage({ filepath: this.file.path })
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
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
    onError () {
      this.error = true
    },
    ...mapActions('local/explorer', [
      'selectFile',
      'searchFiles',
      'openFile',
      'viewFile',
      'requestDirectoryImage'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-grid-list-item .v-card {
  cursor: pointer;
  &[active] {
    background-color: #f5f5f5;
  }
  &:hover {
    background-color: #eeeeee;
  }
  &>.layout {
    height: 150px;
  }
}
.theme--dark .explorer-grid-list-item .v-card {
  &[active] {
    background-color: #505050;
  }
  &:hover {
    background-color: #616161;
  }
}
</style>
