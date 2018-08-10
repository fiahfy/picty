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
      <v-img
        :src="imageSrc"
        height="150"
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
      return this.isSelectedFile({ filepath: this.file.path })
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
    imageSrc () {
      if (this.file.directory) {
        return ''
      }
      return fileUrl(this.file.path)
    },
    ...mapGetters('local/explorer', [
      'isSelectedFile'
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
.explorer-grid-list-item .v-card {
  cursor: pointer;
  &[active] {
    background-color: #f5f5f5;
  }
  &:hover {
    background-color: #eeeeee;
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
