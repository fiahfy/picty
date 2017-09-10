<template>
  <td class="mdc-table-column">
    <slot/>
  </td>
</template>

<script>
export default {
  name: 'mdc-table-column',
};
</script>

<style scoped>
.mdc-table-column {
  padding: 8px;
}
</style>
