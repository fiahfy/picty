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
      type: String,
      required: true
    }
  },
  mounted () {
    this.snackbar = MDCSnackbar.attachTo(this.$el)
    // const dataObj = {
    //   message: this.message
    // }
    // this.snackbar.show(dataObj)
  },
  updated () {
    console.log('updated')
    const dataObj = {
      message: this.message
    }
    this.snackbar.show(dataObj)
  }
}
</script>
