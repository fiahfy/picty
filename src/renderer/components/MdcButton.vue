<template>
  <button class="mdc-button" v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
import { MDCRipple } from '@material/ripple'

export default {
  data () {
    return {
      mdcRipple: null
    }
  },
  mounted () {
    this.mdcRipple = MDCRipple.attachTo(this.$el)
  },
  beforeDestroy () {
    this.mdcRipple.destroy()
  }
}
</script>
