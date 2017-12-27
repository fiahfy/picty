<template>
  <th class="mdc-table-header-column mdc-theme--background" :class="classes" v-bind="$attrs" v-on="$listeners">
    <slot />
  </th>
</template>

<script>
export default {
  props: {
    sticky: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      return {
        sticky: this.sticky
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.mdc-table-header-column {
  color: $material-color-grey-600;
  font-size: smaller;
  font-weight: normal;
  padding: 8px;
  user-select: none;
  &.sticky {
    position: sticky;
    top: 0;
  }
}
.mdc-theme--dark {
  .mdc-table-header-column {
    color: $material-color-grey-300;
  }
}
</style>
