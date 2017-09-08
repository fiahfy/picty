<template>
  <i
    class="mdc-icon-toggle material-icons"
    role="button"
    :aria-pressed="checked"
    :data-toggle-on="toggleOn"
    :data-toggle-off="toggleOff"/>
</template>

<script>
import { MDCIconToggle } from '@material/icon-toggle';

export default {
  name: 'mdc-icon-toggle',
  props: {
    icon: {
      type: String,
    },
    checkedIcon: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    MDCIconToggle.attachTo(this.$el);
    this.$el.addEventListener('MDCIconToggle:change', ({detail}) => {
      // emit;
    });
  },
  computed: {
    toggleOn() {
      return JSON.stringify({
        content: this.checkedIcon ? this.checkedIcon : this.icon,
        cssClass: 'mdc-icon-toggle--primary',
      });
    },
    toggleOff() {
      return JSON.stringify({
        content: this.icon,
      });
    },
  },
};
</script>

<style scoped>
</style>
