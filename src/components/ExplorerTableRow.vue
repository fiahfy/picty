<template>
  <tr
    :active="active"
    class="explorer-table-row"
    @click="onClick"
    @dblclick="onDblClick"
    @contextmenu.stop="onContextMenu"
  >
    <td>
      <v-layout class="align-center">
        <v-menu
          :disabled="menuDisabled"
          open-on-hover
          right
          offset-x
          lazy
        >
          <v-icon
            slot="activator"
            :color="iconColor"
            class="pa-1"
          >{{ icon }}</v-icon>
          <v-card :width="previewWidthValue">
            <v-img
              :src="imageUrl"
              contain
              @error="onError"
            >
              <v-layout
                fill-height
                align-center
                justify-center
              >
                <v-flex class="py-3 text-xs-center caption">{{ message }}</v-flex>
              </v-layout>
            </v-img>
          </v-card>
        </v-menu>
        <span
          :title="file.name"
          class="ellipsis"
        >{{ file.name }}</span>
      </v-layout>
    </td>
    <td class="text-xs-right">
      {{ file.views || '' }}
    </td>
    <td
      @click.stop
      @dblclick.stop
    >
      <v-rating
        v-model="rating"
        half-increments
        clearable
      />
    </td>
    <td class="no-wrap">
      <template v-if="file.modified_at">{{ file.modified_at | moment('YYYY-MM-DD HH:mm') }}</template>
    </td>
  </tr>
</template>

<script>
import workerPromisify from '@fiahfy/worker-promisify'
import fileUrl from 'file-url'
import { mapActions, mapGetters } from 'vuex'
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
    message() {
      if (this.loading) {
        return 'Loading...'
      }
      if (this.error) {
        return 'Load failed'
      }
      return this.imageUrl ? '' : 'No image'
    },
    menuDisabled() {
      return !this.previewWidthValue
    },
    ...mapGetters('settings', ['previewWidthValue']),
    ...mapGetters('settings', ['isFileAvailable']),
    ...mapGetters('local/explorer', ['isFileSelected'])
  },
  async created() {
    if (this.menuDisabled) {
      return
    }
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
</style>
