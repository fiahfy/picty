<template>
  <div
    class="mdc-slider mdc-slider--discrete mdc-slider--display-markers"
    tabindex="0"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :data-step="step"
    aria-label="Select Value"
    @MDCSlider:change="change"
  >
    <div class="mdc-slider__track-container">
      <div class="mdc-slider__track"/>
      <div class="mdc-slider__track-marker-container"/>
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
  model: {
    prop: 'value',
    event: 'change'
  },
  mounted () {
    this.mdcSlider = MDCSlider.attachTo(this.$el)
  },
  beforeDestroy () {
    this.mdcSlider.destroy()
  },
  watch: {
    value (value) {
      this.mdcSlider.value = value
    },
    min (value) {
      this.mdcSlider.min = value
    },
    max (value) {
      this.mdcSlider.max = value
    },
    step (value) {
      this.mdcSlider.step = value
    }
  },
  methods: {
    change (event) {
      this.$emit('change', this.mdcSlider.value)
    }
  }
}
</script>
