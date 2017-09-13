<template>
  <table class="mdc-table">
    <slot/>
  </table>
</template>

<script>
export default {
  name: 'mdc-table'
}
</script>

<style scoped lang="scss">
.mdc-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
</style>
