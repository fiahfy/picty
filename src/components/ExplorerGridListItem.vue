<template>
  <v-card
    :active="active"
    class="explorer-grid-list-item"
    flat
    tile
    active-class="active"
    @click.native="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <v-img
      :src="`file://` + file.path"
      class="white--text"
      height="150px"
    >
      <v-container
        class="pa-0"
        fill-height
        fluid
      >
        <v-layout fill-height>
          <v-flex class="pa-2" xs12 align-end flexbox>
            <span class="">{{ file.name }}</span>
          </v-flex>
        </v-layout>
        <div class="overlay" />
      </v-container>
    </v-img>
  </v-card>
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
.explorer-grid-list-item {
  cursor: pointer;
  .overlay {
    background-color: black;
    bottom: 0;
    left: 0;
    opacity: 0.5;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }
  & /deep/ .v-image .v-responsive__content {
    flex-shrink: 1;
  }
}
</style>
