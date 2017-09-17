<template>
  <i
    class="mdc-icon-toggle material-icons"
    role="button"
    :aria-pressed="checked"
    :data-toggle-on="toggleOn"
    :data-toggle-off="toggleOff"
  />
</template>

<script>
import { MDCIconToggle } from '@material/icon-toggle'

export default {
  props: {
    icon: {
      type: String
    },
    checkedIcon: {
      type: String
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    MDCIconToggle.attachTo(this.$el)
    this.$el.addEventListener('MDCIconToggle:change', ({ detail }) => {
      this.$emit('change', detail.isOn)
    })
  },
  computed: {
    toggleOn () {
      return JSON.stringify({
        content: this.checkedIcon ? this.checkedIcon : this.icon,
        cssClass: 'mdc-icon-toggle--primary'
      })
    },
    toggleOff () {
      return JSON.stringify({
        content: this.icon
      })
    }
  }
}
</script>

<style scoped lang="scss">
i {
  overflow: hidden;
}
</style>
