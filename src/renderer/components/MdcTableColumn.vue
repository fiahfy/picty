<template>
  <td class="mdc-table-column">
    <slot/>
  </td>
</template>

<script>
export default {
  name: 'mdc-table-column'
}
</script>

<style scoped lang="scss">
.mdc-table-column {
  padding: 8px;
  user-select: none;
}
</style>
