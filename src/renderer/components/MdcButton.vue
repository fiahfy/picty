<template>
  <button class="mdc-button" v-on="$listeners">
    <slot/>
  </button>
</template>

<script>
import { MDCRipple } from '@material/ripple'

export default {
  mounted () {
    this.mdcRipple = MDCRipple.attachTo(this.$el)
  },
  beforeDestroy () {
    this.mdcRipple.destroy()
  }
}
</script>
