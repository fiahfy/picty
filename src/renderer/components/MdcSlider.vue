<template>
  <div
    class="mdc-slider mdc-slider--discrete"
    tabindex="0"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :data-step="step"
    aria-label="Select Value"
  >
    <div class="mdc-slider__track-container">
      <div class="mdc-slider__track"/>
    </div>
    <div class="mdc-slider__thumb-container">
      <div class="mdc-slider__pin">
        <span class="mdc-slider__pin-value-marker"/>
      </div>
      <svg class="mdc-slider__thumb" width="21" height="21">
        <circle cx="10.5" cy="10.5" r="7.875"/>
      </svg>
      <div class="mdc-slider__focus-ring"/>
    </div>
  </div>
</template>

<script>
import { MDCSlider } from '@material/slider'

export default {
  props: {
    value: {
      type: Number
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    }
  },
  mounted () {
    this.slider = new MDCSlider(this.$el)
    this.slider.listen('MDCSlider:input', () => {
      this.$emit('input', this.slider.value)
    })
  },
  watch: {
    value (value) {
      this.slider.layout()
      this.slider.value = value
    }
  }
}
</script>
