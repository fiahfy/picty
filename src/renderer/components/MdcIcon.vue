<template>
  <i class="mdc-icon material-icons">
    {{ icon }}
  </i>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.mdc-icon {
  padding: 4px;
  user-select: none;
}
</style>
