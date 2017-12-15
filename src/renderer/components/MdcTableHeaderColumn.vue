<template>
  <th class="mdc-table-header-column mdc-theme--background" :class="classes">
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
.mdc-table-header-column {
  padding: 8px;
  user-select: none;
  &.sticky {
    position: sticky;
    top: 0;
  }
}
</style>
