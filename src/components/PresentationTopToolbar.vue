<template>
  <v-toolbar class="presentation-top-toolbar" color="transparent" flat dense>
    <v-btn :title="'Close' | accelerator('Esc')" icon @click="handleClickClose">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <span class="px-3 ellipsis">{{ title }}</span>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, computed, SetupContext } from '@vue/composition-api'
import { File } from '~/models'

type Props = {
  file: File
}

export default defineComponent({
  props: {
    file: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: Props, context: SetupContext) {
    const title = computed(() => {
      if (!props.file) {
        return ''
      }
      return props.file.parent + ' - ' + props.file.name
    })

    const isHover = () => {
      return !!context.root.$el.querySelector(':hover')
    }

    const handleClickClose = () => {
      context.emit('click-close')
    }

    return {
      title,
      isHover,
      handleClickClose,
    }
  },
})
</script>
