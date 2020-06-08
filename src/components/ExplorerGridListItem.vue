<template>
  <v-col class="explorer-grid-list-item pa-1">
    <v-card flat tile>
      <v-img
        :src="state.imageUrl"
        :contain="contain"
        :height="thumbnailHeightValue"
        @error="handleError"
      >
        <v-layout slot="placeholder" fill-height align-center justify-center>
          <v-flex class="text-center caption">{{ message }}</v-flex>
        </v-layout>
        <div v-if="state.images" class="images caption white--text ma-2 px-1">
          {{ state.images }} images
        </div>
      </v-img>
      <v-icon :color="iconColor" class="pa-1">{{ icon }}</v-icon>
      <v-divider />
      <v-card-title class="pt-2 px-2 pb-0">
        <v-spacer />
        <div class="title">
          <div>
            <span :title="item.name" class="text-xs-center caption">
              {{ item.name }}
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
  </v-col>
</template>

<script lang="ts">
import fileUrl from 'file-url'
import {
  defineComponent,
  SetupContext,
  reactive,
  computed,
} from '@vue/composition-api'
import { Item } from '~/models'
import { settingsStore } from '~/store'

const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/fetch-pathes.worker')

const worker = workerPromisify(new Worker())

type Props = {
  item: Item
}

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive({
      loading: false,
      error: false,
      imageUrl: '',
      images: '',
    })

    const rating = computed({
      get() {
        return props.item.rating
      },
      set(value) {
        context.emit('change-rating', Number(value))
      },
    })
    const icon = computed(() => {
      return props.item.directory ? 'mdi-folder' : 'mdi-file-image'
    })
    const iconColor = computed(() => {
      return props.item.directory ? 'blue lighten-3' : 'green lighten-3'
    })
    const message = computed(() => {
      if (state.loading) {
        return 'Loading...'
      }
      if (state.error) {
        return 'Load failed'
      }
      return state.imageUrl ? '' : 'No images'
    })
    const contain = computed(() => {
      return settingsStore.thumbnailStyle === 'contain'
    })
    const thumbnailHeightValue = computed(() => {
      return settingsStore.thumbnailHeightValue
    })

    const load = async () => {
      if (!props.item.directory) {
        state.imageUrl = fileUrl(props.item.path)
      } else {
        state.loading = true
        const { data } = await worker.postMessage({
          key: props.item.path,
          path: props.item.path,
        })
        const filePathes = data.filter((filePath: string) =>
          settingsStore.isFileAvailable(filePath)
        )
        if (filePathes.length) {
          state.imageUrl = fileUrl(filePathes[0])
        }
        state.images = filePathes.length
        state.loading = false
      }
    }

    const handleError = () => {
      state.error = true
    }

    load()

    return {
      state,
      rating,
      icon,
      iconColor,
      message,
      contain,
      thumbnailHeightValue,
      handleError,
    }
  },
})
</script>

<style lang="scss" scoped>
.explorer-grid-list-item {
  .v-card {
    cursor: pointer;
    position: relative;
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
}
.theme--light .explorer-grid-list-item {
  &.selected .v-card {
    background-color: #f5f5f5;
  }
  &:hover .v-card {
    background-color: #eeeeee;
  }
}
.theme--dark .explorer-grid-list-item {
  &.selected .v-card {
    background-color: #505050;
  }
  &:hover .v-card {
    background-color: #616161;
  }
}
</style>
