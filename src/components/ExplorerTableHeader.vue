<template>
  <thead class="explorer-table-header v-data-table-header">
    <tr>
      <th
        v-for="header in headers"
        :key="header.text"
        :class="getClass(header)"
        :style="getStyle(header)"
        @click="(e) => onHeaderClick(e, header)"
      >
        {{ header.text }}
        <v-icon small class="v-data-table-header__icon">mdi-arrow-up</v-icon>
      </th>
    </tr>
  </thead>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters('local/explorer', ['order']),
  },
  methods: {
    getClass(header) {
      return [
        'sortable',
        this.order.descending ? 'desc' : 'asc',
        header.value === this.order.by ? 'active' : '',
      ]
    },
    getStyle(header) {
      return {
        width: header.width ? `${header.width}px` : null,
      }
    },
    onHeaderClick(_e, header) {
      this.changeOrderBy({ orderBy: header.value })
    },
    ...mapActions('local/explorer', ['changeOrderBy']),
  },
}
</script>
