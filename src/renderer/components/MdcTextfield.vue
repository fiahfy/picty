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
      :value="value"
      @input="updateValue"
      @keyup="keyup"
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
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    fullwidth: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: -1
    }
  },
  mounted () {
    MDCTextfield.attachTo(this.$el)
    this.id = this._uid // eslint-disable-line no-underscore-dangle
  },
  computed: {
    classes () {
      return {
        'mdc-textfield--fullwidth': this.fullwidth
      }
    },
    placeholder () {
      return this.fullwidth ? this.label : null
    }
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.value)
    },
    keyup (e) {
      this.$emit('keyup', e)
    }
  }
}
</script>
