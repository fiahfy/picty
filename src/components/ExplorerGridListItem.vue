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
        v-if="imageUrl || loading"
        :src="imageUrl"
        height="150"
      />
      <v-layout
        v-else
        align-center
        justify-center
      >
        <v-flex class="text-xs-center caption">No image</v-flex>
      </v-layout>
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
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'
import * as File from '~/utils/file'
import { clearTimeout } from 'timers';

export default {
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      loading: false,
      imageUrl: ''
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
    ...mapGetters('local/explorer', [
      'isFileSelected',
      'isFileAvailable'
    ])
  },
  created () {
    this.loading = true
    this.timer = setTimeout(() => {
      console.log('c', this.file.path, this.timer)
      if (!this.file.directory) {
        this.imageUrl = fileUrl(this.file.path)
        return
      }
      const files = File.listFiles(this.file.path)
      const file = files.find((file) => this.isFileAvailable({ filepath: file.path }))
      this.imageUrl = file ? fileUrl(file.path) : ''
      this.loading = false
    }, 3000)
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
