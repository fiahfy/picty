<template>
  <v-flex
    class="explorer-grid-list-item"
  >
    <v-card
      :active="active"
      @click.native="onClick"
      @dblclick="onDblClick"
      @contextmenu.stop="onContextMenu"
    >
      <v-layout
        v-if="message"
        :style="{ height: `${thumbnailHeightValue}px` }"
        align-center
        justify-center
      >
        <v-flex class="text-xs-center caption">{{ message }}</v-flex>
      </v-layout>
      <v-img
        v-else
        :src="imageUrl"
        :contain="contain"
        :height="thumbnailHeightValue"
        @error="onError"
      />
      <v-divider />
      <v-card-title class="pt-2 px-2 pb-0">
        <v-layout class="align-center">
          <v-icon
            :color="iconColor"
            class="pa-1"
          >{{ icon }}</v-icon>
          <span
            :title="file.name"
            class="ellipsis caption"
          >{{ file.name }}</span>
        </v-layout>
      </v-card-title>
      <v-card-actions
        class="pa-0 text-xs-center"
        @click.stop
        @dblclick.stop
      >
        <v-spacer />
        <v-rating
          v-model="rating"
          class="ellipsis"
          half-increments
          clearable
          small
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import workerPromisify from '@fiahfy/worker-promisify'
import fileUrl from 'file-url'
import { mapActions, mapGetters, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'
import Worker from '~/workers/child-fetch.worker.js'

const worker = workerPromisify(new Worker())

export default {
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      error: false,
      imageUrl: ''
    }
  },
  computed: {
    rating: {
      get() {
        return this.file.rating
      },
      set(value) {
        this.$store.dispatch('local/explorer/updateFileRating', {
          filepath: this.file.path,
          rating: value
        })
      }
    },
    active() {
      return this.isFileSelected({ filepath: this.file.path })
    },
    icon() {
      if (this.file.exists) {
        return this.file.directory ? 'folder' : 'photo'
      }
      return 'broken_image'
    },
    iconColor() {
      if (this.file.exists) {
        return this.file.directory ? 'blue lighten-3' : 'green lighten-3'
      }
      return 'grey'
    },
    contain() {
      return this.thumbnailStyle === 'contain'
    },
    message() {
      if (this.loading) {
        return 'Loading...'
      }
      if (this.error) {
        return 'Load failed'
      }
      return this.imageUrl ? '' : 'No image'
    },
    ...mapState('settings', ['thumbnailStyle']),
    ...mapGetters('settings', ['thumbnailHeightValue', 'isFileAvailable']),
    ...mapGetters('local/explorer', ['isFileSelected'])
  },
  async created() {
    if (!this.file.directory) {
      this.imageUrl = fileUrl(this.file.path)
      return
    }
    this.loading = true
    const { data } = await worker.postMessage({
      key: this.file.path,
      data: this.file.path
    })
    if (this.isFileAvailable({ filepath: data })) {
      this.imageUrl = fileUrl(data)
    }
    this.loading = false
  },
  methods: {
    onClick() {
      this.selectFile({ filepath: this.file.path })
    },
    onDblClick() {
      this.openFile({ filepath: this.file.path })
    },
    onContextMenu(e) {
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
    onError() {
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
.explorer-grid-list-item .v-card {
  cursor: pointer;
  &[active] {
    background-color: #f5f5f5;
  }
  &:hover {
    background-color: #eeeeee;
  }
  .v-rating {
    height: 32px;
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
