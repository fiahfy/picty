<template>
  <tbody class="mdc-virtual-table-body">
    <slot v-for="item in items" :item="item"/>
  </tbody>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  }
}
</script>
