<template>
  <th class="mdc-table-header-column">
    <slot/>
  </th>
</template>

<script>
export default {
  name: 'mdc-table-header-column',
};
</script>

<style scoped>
.mdc-table-header-column {
  padding: 8px;
}
</style>
