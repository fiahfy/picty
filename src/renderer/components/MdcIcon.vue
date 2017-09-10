<template>
  <i class="mdc-icon material-icons" :class="classes">
    {{ content }}
  </i>
</template>

<script>
export default {
  name: 'mdc-icon',
  props: {
    icon: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        'mdc-icon-toggle--primary': this.checked,
      };
    },
    content() {
      return this.icon;
    },
  },
};
</script>

<style scoped>
.mdc-icon {
  padding: 12px;
}
</style>
