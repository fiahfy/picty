<template>
  <div
    class="mdc-text-field"
    :class="classes"
  >
    <input
      type="text"
      class="mdc-text-field__input"
      :id="id"
      :placeholder="placeholder"
      :aria-label="placeholder"
      :value="value"
      @input="input"
      v-on="listeners"
    />
    <label
      class="mdc-text-field__label"
      :for="id"
      v-if="!fullwidth"
    >{{ label }}</label>
  </div>
</template>

<script>
import { MDCTextField } from '@material/textfield'

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
      mdcTextField: null,
      id: -1
    }
  },
  mounted () {
    this.mdcTextField = MDCTextField.attachTo(this.$el)
    this.id = this._uid // eslint-disable-line no-underscore-dangle
  },
  beforeDestroy () {
    this.mdcTextField.destroy()
  },
  computed: {
    listeners () {
      const listeners = this.$listeners
      delete listeners.input
      return listeners
    },
    classes () {
      return {
        'mdc-text-field--fullwidth': this.fullwidth
      }
    },
    placeholder () {
      return this.fullwidth ? this.label : null
    }
  },
  methods: {
    input (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
