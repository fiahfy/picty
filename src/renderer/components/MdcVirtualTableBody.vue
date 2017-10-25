<template>
  <mdc-table-body>
    <mdc-table-row/>
    <slot v-for="item in renderItems()" :item="item"/>
    <mdc-table-row/>
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
    this.$el.parentNode.parentNode.addEventListener('scroll', (e) => {
      console.log(e.target.scrollTop, e.target.offsetHeight)
    })
  },
  data () {
    return {}
  },
  methods: {
    m () {
      return new Date()
    },
    renderItems () {
      console.log(1)
      return this.items
    }
  }
}
</script>
