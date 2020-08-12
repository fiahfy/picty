<template>
  <v-col ref="root" class="explorer-grid-list-item pa-1">
    <v-card flat tile style="box-shadow: none !important;">
      <v-img
        position="top center"
        :src="state.imageUrl"
        :contain="contain"
        :height="thumbnailHeightValue"
        :transition="false"
        @error="handleError"
      >
        <template v-slot:placeholder>
          <div class="d-flex fill-height align-center justify-center">
            <div class="caption">{{ message }}</div>
          </div>
        </template>
        <div v-show="state.images" class="images caption white--text ma-2 px-1">
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
          v-if="!state.loading"
          v-model="rating"
          class="overflow-hidden"
          half-increments
          clearable
          small
          background-color="primary lighten-3"
        />
        <div v-else style="height: 32px;" />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import fileUrl from 'file-url'
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  ref,
  SetupContext,
} from '@nuxtjs/composition-api'
import { promisify } from '@fiahfy/worker-promisify'
import { Item } from '~/models'
import { settingsStore } from '~/store'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Worker = require('~/workers/fetch-pathes.worker').default

const worker = promisify(new Worker())

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
    const state = reactive<{
      loading: boolean
      error: boolean
      imageUrl: string
      images: number
      timer?: number
    }>({
      loading: true,
      error: false,
      imageUrl: '',
      images: 0,
      timer: undefined,
    })

    const rating = computed({
      get: () => {
        return props.item.rating
      },
      set: (value) => {
        context.emit('change:rating', value)
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

    const root = ref<HTMLDivElement>()

    const load = async () => {
      if (props.item.file) {
        state.imageUrl = fileUrl(props.item.path)
      } else {
        const { data } = await worker.parallelPostMessage(
          props.item.path,
          props.item.path
        )
        const filePathes = data.filter((filePath: string) =>
          settingsStore.isFileAvailable(filePath)
        )
        if (filePathes.length) {
          state.imageUrl = fileUrl(filePathes[0])
        }
        state.images = filePathes.length
      }
      state.loading = false
    }

    const handleError = () => {
      state.error = true
    }

    onMounted(() => {
      let prevTop = 0
      let time = Date.now() + 100
      state.timer = window.setInterval(() => {
        if (!root.value) {
          return
        }
        const top = root.value.getBoundingClientRect().top
        if (prevTop !== top) {
          prevTop = top
          time = Date.now() + 100
          return
        }
        if (Date.now() < time) {
          return
        }
        clearTimeout(state.timer)
        load()
      }, 10)
    })

    onUnmounted(() => {
      clearTimeout(state.timer)
    })

    return {
      state,
      rating,
      icon,
      iconColor,
      message,
      contain,
      thumbnailHeightValue,
      root,
      handleError,
    }
  },
})
</script>

<style lang="scss" scoped>
.explorer-grid-list-item {
  > .v-card {
    position: relative;
    > .v-image .images {
      background-color: rgba(0, 0, 0, 0.8);
      position: absolute;
      bottom: 0;
      right: 0;
    }
    > .v-icon {
      position: absolute;
      left: 0;
      top: 0;
    }
    > .v-card__title .title {
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
