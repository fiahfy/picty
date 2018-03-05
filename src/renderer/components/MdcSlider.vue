<template>
  <div
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :data-step="step"
    class="mdc-slider mdc-slider--discrete mdc-slider--display-markers"
    tabindex="0"
    role="slider"
    aria-label="Select Value"
    @MDCSlider:input="input"
  >
    <div class="mdc-slider__track-container">
      <div class="mdc-slider__track" />
      <div class="mdc-slider__track-marker-container" />
    </div>
    <div class="mdc-slider__thumb-container">
      <div class="mdc-slider__pin">
        <span class="mdc-slider__pin-value-marker" />
      </div>
      <svg
        class="mdc-slider__thumb"
        width="21"
        height="21"
      >
        <circle
          cx="10.5"
          cy="10.5"
          r="7.875"
        />
      </svg>
      <div class="mdc-slider__focus-ring" />
    </div>
  </div>
</template>

<script>
import { MDCSlider } from '@material/slider'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      required: true
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
  data () {
    return {
      mdcSlider: null
    }
  },
  watch: {
    value (value) {
      this.mdcSlider.value = value
      this.mdcSlider.layout()
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
  mounted () {
    this.mdcSlider = MDCSlider.attachTo(this.$el)
  },
  beforeDestroy () {
    this.mdcSlider.destroy()
  },
  methods: {
    input () {
      this.$emit('change', this.mdcSlider.value)
    }
  }
}
</script>
