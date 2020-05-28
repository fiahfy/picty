<template>
  <tr class="explorer-table-row">
    <td>
      <v-layout class="align-center">
        <v-menu :disabled="menuDisabled" open-on-hover right offset-x>
          <template v-slot:activator="{ on }">
            <v-icon slot="activator" :color="iconColor" class="pa-1" v-on="on">
              {{ icon }}
            </v-icon>
          </template>
          <v-card :width="previewWidthValue">
            <v-img :src="state.imageUrl" contain @error="handleError">
              <div class="py-3 text-center caption">
                {{ message }}
              </div>
            </v-img>
          </v-card>
        </v-menu>
        <span :title="item.name" class="ellipsis spacer">{{ item.name }}</span>
        <span
          v-if="state.images !== ''"
          class="images text-xs-right caption ml-3"
        >
          {{ state.images }} images
        </span>
      </v-layout>
    </td>
    <td class="text-xs-right">{{ item.views || '' }}</td>
    <td @click.stop @dblclick.stop>
      <v-rating v-model="rating" half-increments clearable />
    </td>
    <td class="no-wrap">
      <template v-if="item.modified_at">
        {{ item.modified_at | moment('YYYY-MM-DD HH:mm') }}
      </template>
    </td>
  </tr>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  SetupContext,
} from '@vue/composition-api'
import { settingsStore } from '~/store'

const fileUrl = require('file-url')
const workerPromisify = require('@fiahfy/worker-promisify').default
const Worker = require('~/workers/fetch.worker.js')

const worker = workerPromisify(new Worker())

type Props = {
  item: any
}

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
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
      if (props.item.exists) {
        return props.item.directory ? 'mdi-folder' : 'mdi-image'
      }
      return 'mdi-image-broken-variant'
    })
    const iconColor = computed(() => {
      if (props.item.exists) {
        return props.item.directory ? 'blue lighten-3' : 'green lighten-3'
      }
      return 'grey'
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
    const previewWidthValue = computed(() => {
      return settingsStore.previewWidthValue
    })
    const menuDisabled = computed(() => {
      return !previewWidthValue.value
    })

    const load = async () => {
      if (!props.item.directory) {
        state.imageUrl = fileUrl(props.item.path)
      } else {
        state.loading = true
        const { data } = await worker.postMessage({
          key: props.item.path,
          data: props.item.path,
        })
        const filepathes = data.filter((filepath: string) =>
          settingsStore.isFileAvailable({ filepath })
        )
        if (filepathes.length) {
          state.imageUrl = fileUrl(filepathes[0])
        }
        state.images = filepathes.length
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
      previewWidthValue,
      menuDisabled,
      handleError,
    }
  },
})
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
    .images {
      white-space: nowrap;
    }
  }
}
</style>
