<template>
  <div class="mdc-checkbox">
    <input
      type="checkbox"
      class="mdc-checkbox__native-control"
      :id="id"
      :value="value"
      :checked="value"
      @change="updateValue"/>
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
</div>

  </div>
</template>

<script>
// import { MDCCheckbox } from '@material/checkbox'

export default {
  props: {
    value: {
      type: Boolean
    },
    id: {
      type: String
    }
  },
  mounted () {
    // MDCCheckbox.attachTo(document.querySelector('.mdc-checkbox'))
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.checked)
    }
  }
}
</script>
