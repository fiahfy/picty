<template>
  <div
    class="mdc-textfield"
    :class="classes"
  >
    <input
      type="text"
      class="mdc-textfield__input"
      :id="id"
      :placeholder="placeholder"
      :aria-label="placeholder"
    />
    <label
      class="mdc-textfield__label"
      :for="id"
      v-if="!fullwidth"
    >{{ label }}</label>
  </div>
</template>

<script>
import { MDCTextfield } from '@material/textfield'

export default {
  name: 'mdc-textfield',
  props: {
    label: {
      type: String,
    },
    fullwidth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: -1,
    };
  },
  mounted() {
    new MDCTextfield(this.$el);
    this.id = this._uid;
  },
  computed: {
    classes() {
      return {
        'mdc-textfield--fullwidth': this.fullwidth,
      };
    },
    placeholder() {
      return this.fullwidth ? this.label : null;
    },
  },
};
</script>

<style scoped>
</style>
