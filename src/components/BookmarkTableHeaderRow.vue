<template>
  <tr class="explorer-table-header-row">
    <th
      v-for="header in headers"
      :key="header.text"
      :class="getClass(header)"
      :style="getStyle(header)"
      @click="(e) => onHeaderClick(e, header)"
    >
      <v-icon small>mdi-arrow_upward</v-icon>
      {{ header.text }}
    </th>
  </tr>
</template>

<script>
import { layoutBookmarkStore } from '~/store'

export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    order() {
      return layoutBookmarkStore.order
    },
  },
  methods: {
    getClass(header) {
      return [
        'column sortable',
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
      layoutBookmarkStore.changeOrderBy({ orderBy: header.value })
    },
  },
}
</script>
