<template>
  <tr class="mdc-table-row" @click="click">
    <slot/>
  </tr>
</template>

<script>
export default {
  name: 'mdc-table-row',
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color_palette.scss";

.mdc-table-row {
  border-bottom-color: $material-color-grey-300;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  &:hover {
    background-color: $material-color-grey-100;
  }
}
</style>
