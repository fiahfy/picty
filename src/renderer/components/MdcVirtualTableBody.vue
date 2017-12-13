<template>
  <mdc-table-body>
    <mdc-table-row :style="`height: ${offsetTop}px;`" />
    <slot v-for="item in renderItems" :item="item" />
    <mdc-table-row :style="`height: ${offsetBottom}px;`" />
  </mdc-table-body>
</template>

<script>
import MdcTableBody from '../components/MdcTableBody'
import MdcTableRow from '../components/MdcTableRow'

export default {
  props: {
    items: {
      type: Array
    },
    estimatedHeight: {
      type: Number
    }
  },
  components: {
    MdcTableBody,
    MdcTableRow
  },
  mounted () {
    const container = this.$el.parentNode.parentNode
    container.addEventListener('scroll', this.scroll)
    window.addEventListener('resize', this.scroll)
    this.scroll()
  },
  data () {
    return {
      offsetTop: 0,
      offsetBottom: 0,
      renderItems: []
    }
  },
  methods: {
    scroll () {
      const container = this.$el.parentNode.parentNode
      if (!container) {
        return
      }
      const top = container.scrollTop
      const offset = Math.ceil(container.offsetHeight / this.estimatedHeight)
      const startIndex = Math.max(0, Math.floor(top / this.estimatedHeight))
      const endIndex = Math.min(startIndex + offset, this.items.length)
      this.renderItems = this.items.slice(startIndex, endIndex)
      this.offsetTop = startIndex * this.estimatedHeight
      this.offsetBottom = (this.items.length - endIndex) * this.estimatedHeight
    }
  },
  watch: {
    items () {
      this.scroll()
    }
  }
}
</script>

<style scoped>
.mdc-table-row {
  border: none;
  margin: 0;
  padding: 0;
}
</style>
