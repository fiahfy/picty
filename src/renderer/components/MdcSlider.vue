<template>
<div class="mdc-slider mdc-slider--discrete" tabindex="0" role="slider"
     :aria-valuemin="minValue" :aria-valuemax="maxValue" :aria-valuenow="value"
     aria-label="Select Value">
  <div class="mdc-slider__track-container">
    <div class="mdc-slider__track"></div>
  </div>
  <div class="mdc-slider__thumb-container">
    <div class="mdc-slider__pin">
      <span class="mdc-slider__pin-value-marker"></span>
    </div>
    <svg class="mdc-slider__thumb" width="21" height="21">
      <circle cx="10.5" cy="10.5" r="7.875"></circle>
    </svg>
    <div class="mdc-slider__focus-ring"></div>
  </div>
</div>
</template>

<script>
import { MDCSlider } from '@material/slider'

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 100
    }
  },
  mounted () {
    MDCSlider.attachTo(this.$el)
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.checked)
    }
  }
}
</script>
