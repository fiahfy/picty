<template>
  <i class="mdc-icon material-icons">
    {{ content }}
  </i>
</template>

<script>
export default {
  name: 'mdc-icon',
  props: {
    icon: {
      type: String
    }
  },
  computed: {
    content () {
      return this.icon
    }
  }
}
</script>

<style scoped lang="scss">
.mdc-icon {
  padding: 12px;
  user-select: none;
}
</style>
