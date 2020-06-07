<template>
  <v-card class="explorer-grid-list-header" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-spacer />
      <v-select
        v-model="option"
        :items="options"
        dense
        filled
        rounded
        single-line
        prepend-inner-icon="mdi-sort"
        hide-details
        style="max-width: 256px;"
      />
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, SetupContext } from '@vue/composition-api'
import { Item } from '~/models'

type Option = {
  value: { by: keyof Item; desc: boolean }
  text: string
}

const options: Option[] = [
  { value: { by: 'name', desc: false }, text: 'Name ascending' },
  { value: { by: 'name', desc: true }, text: 'Name descending' },
  {
    value: { by: 'rating', desc: false },
    text: 'Rating ascending',
  },
  {
    value: { by: 'rating', desc: true },
    text: 'Rating descending',
  },
  {
    value: { by: 'lastModified', desc: false },
    text: 'Last Modified ascending',
  },
  {
    value: { by: 'lastModified', desc: true },
    text: 'Last Modified descending',
  },
]

type Props = {
  sortBy?: keyof Item
  sortDesc: boolean
}

export default defineComponent({
  props: {
    sortBy: {
      type: String,
    },
    sortDesc: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, context: SetupContext) {
    const option = computed<{
      by: string
      desc: boolean
    }>({
      get() {
        return { by: props.sortBy ?? 'name', desc: props.sortDesc }
      },
      set(option) {
        context.emit('change-sort-option', option)
      },
    })

    return {
      options,
      option,
    }
  },
})
</script>
