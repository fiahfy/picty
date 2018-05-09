<template>
  <v-data-table
    v-bind="$attrs"
    :pagination.sync="paginationModel"
    class="virtual-data-table"
  >
    <template
      slot="headers"
      slot-scope="props"
    >
      <slot
        v-bind="props"
        name="headers"
      />
    </template>
    <template
      slot="items"
      slot-scope="props"
    >
      <slot
        v-bind="props"
        name="items"
      />
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true
    }
  },
  computed: {
    paginationModel: {
      get () {
        return this.pagination
      },
      set (value) {
        this.$emit('update:pagination', value)
      }
    }
  },
  watch: {
    pagination (value) {
      console.log('watch')
    }
  }
}
</script>

<style scoped lang="scss">
.virtual-data-table /deep/ .datatable__progress {
  display: none;
}
</style>
