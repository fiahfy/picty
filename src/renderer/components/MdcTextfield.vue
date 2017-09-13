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
  name: 'mdc-textfield',
  props: {
    label: {
      type: String
    },
    fullwidth: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String
    }
  },
  data () {
    return {
      id: -1,
      value: this.defaultValue
    }
  },
  mounted () {
    new MDCTextfield(this.$el) // eslint-disable-line no-new
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
    keyup (e) {
      this.$emit('input', e.target.value)
      if (event.keyCode === 13) {
        this.$emit('keyupEnter')
      }
    }
  },
  watch: {
    defaultValue (value) {
      this.value = value
    }
  }
}
</script>
