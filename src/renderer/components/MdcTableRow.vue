<template>
  <tr
    class="mdc-table-row"
    :class="classes"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
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
