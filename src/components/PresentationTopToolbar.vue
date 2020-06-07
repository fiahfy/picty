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

    <span class="px-3 text-truncate" style="direction: rtl;">
      {{ title }}
    </span>
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
    const title = computed(() => {
      if (!props.file) {
        return ''
      }
      return path.basename(props.file.parent) + ' - ' + props.file.name
    })

    const toolbar = ref<Vue>(null)

    const isHover = () => {
      return !!toolbar.value?.$el.querySelector(':hover')
    }

    const handleClickClose = () => {
      context.emit('click-close')
    }

    return {
      title,
      toolbar,
      isHover,
      handleClickClose,
    }
  },
})
</script>
