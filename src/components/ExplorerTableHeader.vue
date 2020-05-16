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
import { layoutExplorerStore } from '~/store'

export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getClass(header) {
      return [
        'sortable',
        layoutExplorerStore.order.descending ? 'desc' : 'asc',
        header.value === layoutExplorerStore.order.by ? 'active' : '',
      ]
    },
    getStyle(header) {
      return {
        width: header.width ? `${header.width}px` : null,
      }
    },
    onHeaderClick(_e, header) {
      layoutExplorerStore.changeOrderBy({ orderBy: header.value })
    },
  },
}
</script>
