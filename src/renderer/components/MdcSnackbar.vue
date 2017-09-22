<template>
  <div
    class="mdc-snackbar"
    aria-live="assertive"
    aria-atomic="true"
    aria-hidden="true"
  >
    <div class="mdc-snackbar__text"></div>
    <div class="mdc-snackbar__action-wrapper">
      <button type="button" class="mdc-snackbar__action-button"></button>
    </div>
  </div>
</template>

<script>
import { MDCSnackbar } from '@material/snackbar'

export default {
  props: {
    message: {
      type: String
    }
  },
  mounted () {
    this.snackbar = MDCSnackbar.attachTo(this.$el)
    this.show()
  },
  methods: {
    show () {
      if (!this.message) {
        return
      }
      const dataObj = {
        message: this.message
      }
      this.snackbar.show(dataObj)
    }
  },
  watch: {
    message () {
      this.show()
    }
  }
}
</script>
