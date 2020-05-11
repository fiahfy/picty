<template>
  <v-card class="explorer-grid-list-header" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-spacer />
      <v-select
        v-model="order"
        :items="orders"
        single-line
        append-outer-icon="mdi-sort"
        hide-details
        style="max-width: 256px;"
      />
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      orders: [
        { value: { by: 'name', descending: false }, text: 'Name ascending' },
        { value: { by: 'name', descending: true }, text: 'Name descending' },
        { value: { by: 'views', descending: true }, text: 'Views ascending' },
        { value: { by: 'views', descending: false }, text: 'Views descending' },
        {
          value: { by: 'rating', descending: true },
          text: 'Rating ascending',
        },
        {
          value: { by: 'rating', descending: false },
          text: 'Rating descending',
        },
        {
          value: { by: 'modified_at', descending: true },
          text: 'Date Modified ascending',
        },
        {
          value: { by: 'modified_at', descending: false },
          text: 'Date Modified descending',
        },
      ],
    }
  },
  computed: {
    order: {
      get() {
        return this.$store.getters['local/explorer/order']
      },
      set(value) {
        this.$store.dispatch('local/explorer/changeOrder', { order: value })
      },
    },
  },
}
</script>
