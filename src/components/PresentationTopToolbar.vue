<template>
  <v-toolbar
    ref="toolbar"
    class="presentation-top-toolbar"
    color="transparent"
    flat
    dense
  >
    <v-btn :title="'Close' | accelerator('Esc')" icon @click="handleClickClose">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div
      v-if="file"
      class="px-3 d-flex flex-grow-1 text-no-wrap"
      style="min-width: 0;"
    >
      <span class="text-truncate" v-text="dirname" />
      <span class="px-3"> - </span>
      <span v-text="file.name" />
    </div>
  </v-toolbar>
</template>

<script lang="ts">
import path from 'path'
import {
  defineComponent,
  computed,
  ref,
  SetupContext,
} from '@vue/composition-api'
import { File } from '~/models'

type Props = {
  file?: File
}

export default defineComponent({
  props: {
    file: {
      type: Object,
    },
  },
  setup(props: Props, context: SetupContext) {
    const dirname = computed(() => {
      if (!props.file) {
        return ''
      }
      return path.basename(props.file.parent)
    })

    const toolbar = ref<Vue>()

    const isHover = () => {
      return !!toolbar.value?.$el.querySelector(':hover')
    }

    const handleClickClose = () => {
      context.emit('click-close')
    }

    return {
      dirname,
      toolbar,
      isHover,
      handleClickClose,
    }
  },
})
</script>
