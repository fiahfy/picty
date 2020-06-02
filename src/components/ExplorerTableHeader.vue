<template>
  <thead class="explorer-table-header v-data-table-header">
    <tr>
      <th
        v-for="header in headers"
        :key="header.text"
        :class="getClass(header)"
        :style="getStyle(header)"
        @click="() => handleClickRow(header)"
      >
        <span>{{ header.text }}</span>
        <v-icon small class="v-data-table-header__icon">mdi-arrow-up</v-icon>
      </th>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'

type Props = {
  header: any[]
  sortBy?: string
  sortDesc: boolean
}

export default defineComponent({
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
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
    const handleClickRow = (header: any) => {
      context.emit('click', header)
    }

    const getClass = (header: any) => {
      return [
        'text-no-wrap',
        'sortable',
        header.value === props.sortBy ? 'active' : '',
        props.sortDesc ? 'desc' : 'asc',
      ]
    }
    const getStyle = (header: any) => {
      return {
        width: header.width ? `${header.width}px` : undefined,
      }
    }

    return {
      handleClickRow,
      getClass,
      getStyle,
    }
  },
})
</script>
