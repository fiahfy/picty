<template>
  <div
    class="mdc-menu"
    tabindex="-1"
    :style="styles"
    @MDCMenu:cancel="cancel"
    @MDCMenu:selected="select"
  >
    <ul
      class="mdc-menu__items mdc-list"
      role="menu"
      aria-hidden="true"
    >
      <slot />
    </ul>
  </div>
</template>

<script>
import { MDCMenu } from '@material/menu'

export default {
  model: {
    prop: 'selected',
    event: 'change'
  },
  props: {
    selected: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      mdcMenu: null,
      parentOffset: {}
    }
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
  mounted () {
    this.mdcMenu = MDCMenu.attachTo(this.$el)
    this.parentOffset = this.$el.parentNode.getBoundingClientRect()
  },
  beforeDestroy () {
    this.mdcMenu.destroy()
  },
  methods: {
    show () {
      this.mdcMenu.show(this.selected > -1 ? { focusIndex: this.selected } : {})
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
.mdc-menu .mdc-list, .mdc-list-item {
  font-size: inherit;
}
</style>
