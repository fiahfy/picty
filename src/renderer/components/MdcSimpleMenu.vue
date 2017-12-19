<template>
  <div class="mdc-simple-menu" tabindex="-1" @MDCSimpleMenu:cancel="cancel" @MDCSimpleMenu:selected="select">
    <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
      <slot />
    </ul>
  </div>
</template>

<script>
import { MDCSimpleMenu } from '@material/menu'

export default {
  props: {
    selected: {
      type: Number
    }
  },
  model: {
    prop: 'selected',
    event: 'change'
  },
  data () {
    return {
      mdcSimpleMenu: null
    }
  },
  mounted () {
    this.mdcSimpleMenu = MDCSimpleMenu.attachTo(this.$el)
  },
  beforeDestroy () {
    this.mdcSimpleMenu.destroy()
  },
  watch: {
    value (value) {
      this.mdcSimpleMenu.open = value
    }
  },
  methods: {
    show () {
      this.mdcSimpleMenu.show({ focusIndex: this.selected })
    },
    hide () {
      this.mdcSimpleMenu.hide()
    },
    select (e) {
      this.$emit('change', e.detail.index)
    },
    cancel () {
      this.$emit('change', null)
    }
  }
}
</script>
