<template>
  <v-card class="explorer-grid-list-header" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-spacer />
      <v-select
        v-model="orderModel"
        :items="orders"
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

const orders = [
  { value: { by: 'name', desc: false }, text: 'Name ascending' },
  { value: { by: 'name', desc: true }, text: 'Name descending' },
  { value: { by: 'views', desc: true }, text: 'Views ascending' },
  { value: { by: 'views', desc: false }, text: 'Views descending' },
  {
    value: { by: 'rating', desc: true },
    text: 'Rating ascending',
  },
  {
    value: { by: 'rating', desc: false },
    text: 'Rating descending',
  },
  {
    value: { by: 'modified_at', desc: true },
    text: 'Date Modified ascending',
  },
  {
    value: { by: 'modified_at', desc: false },
    text: 'Date Modified descending',
  },
]

type Props = {
  sortBy?: string
  sortDesc: boolean
}

export default defineComponent({
  props: {
    sortBy: {
      type: String,
      default: undefined,
    },
    sortDesc: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, context: SetupContext) {
    const orderModel = computed<{
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
      orders,
      orderModel,
    }
  },
})
</script>
