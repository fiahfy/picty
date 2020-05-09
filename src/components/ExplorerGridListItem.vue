<template>
  <v-flex class="explorer-grid-list-item">
    <v-card
      flat
      tile
      :active="active"
      @click.native="onClick"
      @dblclick="onDblClick"
      @contextmenu.stop="onContextMenu"
    >
      <v-img
        :src="imageUrl"
        :contain="contain"
        :height="thumbnailHeightValue"
        @error="onError"
      >
        <v-layout slot="placeholder" fill-height align-center justify-center>
          <v-flex class="text-xs-center caption">{{ message }}</v-flex>
        </v-layout>
        <div v-if="images" class="images caption white--text ma-2 px-1">
          {{ images }} images
        </div>
      </v-img>
      <v-icon :color="iconColor" class="pa-1">{{ icon }}</v-icon>
      <v-divider />
      <v-card-title class="pt-2 px-2 pb-0">
        <v-spacer />
        <div class="title">
          <div>
            <span :title="file.name" class="text-xs-center caption">
              {{ file.name }}
            </span>
          </div>
        </div>
        <v-spacer />
      </v-card-title>
      <v-card-actions class="pa-0" @click.stop @dblclick.stop>
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
import Worker from '~/workers/fetch.worker.js'

const worker = workerPromisify(new Worker())

export default {
  props: {
    file: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      imageUrl: '',
      images: '',
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
          rating: value,
        })
      },
    },
    active() {
      return this.isFileSelected({ filepath: this.file.path })
    },
    icon() {
      if (this.file.exists) {
        return this.file.directory ? 'mdi-folder' : 'mdi-photo'
      }
      return 'mdi-broken_image'
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
      return this.imageUrl ? '' : 'No images'
    },
    ...mapState('settings', ['thumbnailStyle']),
    ...mapGetters('settings', ['thumbnailHeightValue', 'isFileAvailable']),
    ...mapGetters('local/explorer', ['isFileSelected']),
  },
  async created() {
    if (!this.file.directory) {
      this.imageUrl = fileUrl(this.file.path)
      return
    }
    this.loading = true
    const { data } = await worker.postMessage({
      key: this.file.path,
      data: this.file.path,
    })
    const filepathes = data.filter((filepath) =>
      this.isFileAvailable({ filepath })
    )
    if (filepathes.length) {
      this.imageUrl = fileUrl(filepathes[0])
    }
    this.images = filepathes.length
    this.loading = false
  },
  methods: {
    onClick() {
      this.selectFile({ filepath: this.file.path })
    },
    onDblClick() {
      this.openFile({ filepath: this.file.path })
    },
    onContextMenu() {
      this.selectFile({ filepath: this.file.path })
      let template = [
        {
          label: 'View',
          click: () => this.viewFile({ filepath: this.file.path }),
          accelerator: 'Enter',
        },
      ]
      const text = getSelection().toString()
      if (text) {
        template = [
          ...template,
          { type: 'separator' },
          { role: 'copy' },
          {
            label: `Search "${text}"`,
            click: () => this.searchFiles({ query: text }),
            accelerator: 'CmdOrCtrl+F',
          },
        ]
      }
      this.$contextMenu.open(template)
    },
    onError() {
      this.error = true
    },
    ...mapActions('local/explorer', [
      'selectFile',
      'searchFiles',
      'openFile',
      'viewFile',
    ]),
  },
}
</script>

<style scoped lang="scss">
.explorer-grid-list-item .v-card {
  cursor: pointer;
  position: relative;
  &[active] {
    background-color: #f5f5f5;
  }
  &:hover {
    background-color: #eeeeee;
  }
  .v-image .images {
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .v-icon {
    position: absolute;
    left: 0;
    top: 0;
  }
  .v-card__title .title {
    display: table;
    > div {
      display: table-cell;
      height: 28px;
      vertical-align: middle;
      > span {
        display: -webkit-box;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        /* autoprefixer: ignore next */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
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
