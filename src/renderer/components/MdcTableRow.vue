<template>
  <tr class="mdc-table-row" :class="classes">
    <slot/>
  </tr>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      return {
        selected: this.selected
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.mdc-table-row {
  border-bottom-color: $material-color-grey-300;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  &:hover {
    background-color: $material-color-grey-100;
  }
  &.selected {
    background-color: $material-color-grey-300;
  }
}
.mdc-theme--dark {
  .mdc-table-row {
    border-bottom-color: $material-color-grey-600;
    &:hover {
      background-color: $material-color-grey-800;
    }
    &.selected {
      background-color: $material-color-grey-600;
    }
  }
}
</style>
