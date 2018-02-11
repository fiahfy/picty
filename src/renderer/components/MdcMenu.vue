<template>
  <div
    class="mdc-menu mdc-simple-menu"
    tabindex="-1"
    :style="styles"
    @MDCSimpleMenu:cancel="cancel"
    @MDCSimpleMenu:selected="select"
  >
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
      mdcMenu: null,
      parentOffset: {}
    }
  },
  mounted () {
    this.mdcMenu = MDCSimpleMenu.attachTo(this.$el)
    this.parentOffset = this.$el.parentNode.getBoundingClientRect()
  },
  beforeDestroy () {
    this.mdcMenu.destroy()
  },
  computed: {
    styles () {
      const top = 4 + (this.parentOffset.top || 0)
      const left = 4 + (this.parentOffset.left || 0)
      return {
        'max-height': `calc(100vh - ${top}px)`,
        'max-width': `calc(100vw - ${left}px)`
      }
    }
  },
  watch: {
    value (value) {
      this.mdcMenu.open = value
    }
  },
  methods: {
    show () {
      this.mdcMenu.show({ focusIndex: this.selected })
    },
    hide () {
      this.mdcMenu.hide()
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

<style scoped lang="scss">
.mdc-menu {
  .mdc-list, .mdc-list-item {
    font-size: inherit;
  }
}
</style>
