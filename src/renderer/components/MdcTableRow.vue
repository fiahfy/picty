<template>
  <tr class="mdc-table-row" @click="click">
    <slot/>
  </tr>
</template>

<script>
export default {
  name: 'mdc-table-row',
  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
.mdc-table-row {
  border-bottom-color: rgba(0, 0, 0, 0.06);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.mdc-table-row:hover {
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
