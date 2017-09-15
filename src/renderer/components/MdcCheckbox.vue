<template>
  <div class="mdc-checkbox-container">
    <div class="mdc-checkbox">
      <input
        type="checkbox"
        class="mdc-checkbox__native-control"
        :id="id"
        :value="value"
        :checked="value"
        @change="updateValue"
      />
      <div class="mdc-checkbox__background">
        <svg
          class="mdc-checkbox__checkmark"
          viewBox="0 0 24 24"
        >
          <path
            class="mdc-checkbox__checkmark__path"
            fill="none"
            stroke="white"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>
    <label :for="id" v-if="label">{{ label }}</label>
  </div>
</template>

<script>
import { MDCCheckbox } from '@material/checkbox'

export default {
  name: 'mdc-checkbox',
  props: {
    value: {
      type: Boolean
    },
    label: {
      type: String
    }
  },
  data () {
    return {
      id: -1
    }
  },
  mounted () {
    MDCCheckbox.attachTo(this.$el.querySelector('.mdc-checkbox'))
    this.id = this._uid // eslint-disable-line no-underscore-dangle
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.checked)
    }
  }
}
</script>

<style scoped lang="scss">
.mdc-checkbox-container {
  font-family: Roboto, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1.25rem;
    text-decoration: inherit;
    text-transform: inherit;
    color: rgba(0, 0, 0, 0.87);
    color: var(--mdc-theme-text-primary-on-light, rgba(0, 0, 0, 0.87));
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
}
label {
  order: 0;
  margin-right: auto;
  padding-left: 4px;
  user-select: none;
}
</style>
