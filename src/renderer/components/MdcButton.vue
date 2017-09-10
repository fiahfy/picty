<template>
  <button class="mdc-button" @click="click">
    <slot/>
  </button>
</template>

<script>
import { MDCRipple } from '@material/ripple';

export default {
  name: 'mdc-button',
  mounted() {
    MDCRipple.attachTo(this.$el);
  },
  methods: {
    click() {
      this.$emit('click');
    }
  },
};
</script>

<style scoped>
</style>
