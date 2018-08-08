<template>
  <div
    class="explorer-grid-list"
    tabindex="0"
    @scroll="onScroll"
    @keydown="onKeyDown"
  >
    <virtual-data-iterator
      ref="iterator"
      :items="filteredFiles"
      :loading="loading"
      :no-data-text="noDataText"
      :estimated-height="231"
      :sizes="[6, 4, 3, 2, 2]"
      item-key="path"
      class="grid-list-md"
      hide-actions
      grid-list-md
    >
      <explorer-grid-list-item
        slot="items"
        slot-scope="props"
        :file="props.item"
      />
      <v-progress-linear
        slot="progress"
        indeterminate
      />
    </virtual-data-iterator>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ExplorerGridListItem from './ExplorerGridListItem'
import VirtualDataIterator from './VirtualDataIterator'

export default {
  components: {
    ExplorerGridListItem,
    VirtualDataIterator
  },
  computed: {
    noDataText () {
      if (this.loading) {
        return 'Loading...'
      }
      return this.query ? 'No matching records found' : 'No data available'
    },
    ...mapState([
      'directory'
    ]),
    ...mapState('local/explorer', [
      'loading',
      'query',
      'selectedFilepath'
    ]),
    ...mapGetters('local/explorer', [
      'filteredFiles',
      'scrollTop',
      'selectedFileIndex'
    ])
  },
  methods: {
    restore () {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.table.setScrollTop(scrollTop)
      })
    },
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown (e) {
      console.log(e)
      switch (e.keyCode) {
        case 13:
          e.preventDefault()
          this.viewFile({ filepath: this.selectedFilepath })
          break
        case 38:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstFile()
          } else {
            this.selectPreviousFile()
          }
          break
        case 40:
          e.preventDefault()
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastFile()
          } else {
            this.selectNextFile()
          }
          break
      }
    },
    ...mapActions('local/explorer', [
      'selectFirstFile',
      'selectLastFile',
      'selectPreviousFile',
      'selectNextFile',
      'setScrollTop',
      'viewFile'
    ])
  }
}
</script>

<style scoped lang="scss">
.explorer-grid-list {
  outline: none;
}
</style>
