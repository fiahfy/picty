<template>
  <mdc-table-body>
    <mdc-table-row :style="`height: ${offsetTop}px;`"/>
    <slot v-for="item in renderItems" :item="item"/>
    <mdc-table-row :style="`height: ${offsetBottom}px;`"/>
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
    this.scrollHandler = () => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        const top = container.scrollTop
        const bottom = container.scrollTop + container.offsetHeight
        const startIndex = Math.floor(top / this.estimatedHeight)
        const endIndex = Math.ceil(bottom / this.estimatedHeight)
        this.renderItems = this.items.slice(startIndex, endIndex)
        this.offsetTop = startIndex * this.estimatedHeight
        this.offsetBottom = (this.items.length - endIndex) * this.estimatedHeight
        console.log(top, bottom, startIndex, endIndex, this.items.length, this.renderItems.length)
      }, 500)
    }
    container.addEventListener('scroll', this.scrollHandler)
    this.scrollHandler()
  },
  data () {
    return {
      offsetTop: 0,
      offsetBottom: 0,
      renderItems: []
    }
  }
}
</script>
