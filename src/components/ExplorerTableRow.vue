<template>
  <tr class="explorer-table-row">
    <td class="d-flex align-center">
      <v-icon :color="iconColor" class="pr-1">
        {{ icon }}
      </v-icon>
      <span :title="item.name" class="text-truncate spacer">
        {{ item.name }}
      </span>
      <span v-if="state.images" class="images text-xs-right caption ml-3">
        {{ state.images }} images
      </span>
    </td>
    <td @click.stop @dblclick.stop>
      <v-rating
        v-model="rating"
        half-increments
        clearable
        background-color="primary lighten-3"
      />
    </td>
    <td class="no-wrap">
      {{ item.lastModified | date('YYYY-MM-DD HH:mm') }}
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
import { promisify } from '@fiahfy/worker-promisify'
import { Item } from '~/models'
import { settingsStore } from '~/store'

const Worker = require('~/workers/fetch-pathes.worker')

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
    const state = reactive({
      loading: false,
      error: false,
      images: 0,
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

    const load = async () => {
      if (!props.item.directory) {
        return
      }
      state.loading = true
      const { data } = await worker.parallelPostMessage(
        props.item.path,
        props.item.path
      )
      const filePathes = data.filter((filePath: string) =>
        settingsStore.isFileAvailable(filePath)
      )
      state.images = filePathes.length
      state.loading = false
    }

    load()

    return {
      state,
      rating,
      icon,
      iconColor,
    }
  },
})
</script>

<style lang="scss" scoped>
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
