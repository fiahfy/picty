<template>
  <tr
    :class="classes"
    v-bind="$attrs"
    class="mdc-table-row"
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
