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
          class="overflow-hidden"
          half-increments
          clearable
          small
          background-color="primary lighten-3"
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
import { promisify } from '@fiahfy/worker-promisify'
import { Item } from '~/models'
import { settingsStore } from '~/store'

const Worker = require('~/workers/fetch-pathes.worker')

const worker = promisify(new Worker())

// Resize image with antialiasing
// @see https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing
const getDataUrlFromImg = (img: HTMLImageElement, size: number) => {
  const s = size * window.devicePixelRatio
  let steps = 0
  let w = img.width
  let h = img.height
  if (w < h) {
    steps = w / s / 2
    h = (h * s) / w
    w = s
  } else {
    steps = h / s / 2
    w = (w * s) / h
    h = s
  }

  const tc = document.createElement('canvas')
  tc.width = img.width
  tc.height = img.height

  const tctx = tc.getContext('2d')
  if (!tctx) {
    return undefined
  }
  tctx.filter = `blur(${steps}px)`
  tctx.drawImage(img, 0, 0)

  const c = document.createElement('canvas')
  c.width = w
  c.height = h

  const ctx = c.getContext('2d')
  if (!ctx) {
    return undefined
  }
  ctx.drawImage(tc, 0, 0, w, h)

  return c.toDataURL('image/png')
}

const getDataUrl = (url: string, size: number): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if (!url) {
      return resolve(url)
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      resolve(getDataUrlFromImg(img, size))
    }
  })
}

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
      state.loading = true
      if (!props.item.directory) {
        state.imageUrl = (await getDataUrl(fileUrl(props.item.path), 256)) ?? ''
      } else {
        const { data } = await worker.parallelPostMessage(
          props.item.path,
          props.item.path
        )
        const filePathes = data.filter((filePath: string) =>
          settingsStore.isFileAvailable(filePath)
        )
        if (filePathes.length) {
          state.imageUrl = (await getDataUrl(fileUrl(filePathes[0]), 256)) ?? ''
        }
        state.images = filePathes.length
      }
      state.loading = false
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
