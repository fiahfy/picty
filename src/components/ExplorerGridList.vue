<template>
  <virtual-data-iterator
    ref="iterator"
    :items="filteredFiles"
    :loading="loading"
    :no-data-text="noDataText"
    :estimated-height="231"
    :sizes="[6, 4, 3, 2, 2]"
    class="explorer-grid-list"
    container-class="grid-list-md"
    item-key="path"
    hide-actions
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <explorer-grid-list-item
      slot="items"
      slot-scope="props"
      :key="props.item.path"
      :file="props.item"
      class="xs6 sm4 md3 lg2"
    />
    <v-progress-linear
      slot="progress"
      indeterminate
    />
    <v-card
      slot="no-data"
      class="ma-3 pa-3"
    >
      {{ noDataText }}
    </v-card>
    <v-card
      slot="no-results"
      class="ma-3 pa-3"
    >
      {{ noDataText }}
    </v-card>
  </virtual-data-iterator>
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
  watch: {
    directory () {
      this.restore()
    },
    selectedFileIndex (value) {
      this.$nextTick(() => {
        const index = value
        if (index === -1) {
          return
        }
        const rowHeight = 48
        const headerHeight = 58
        const el = {
          offsetTop: rowHeight * (index + 1),
          offsetHeight: rowHeight
        }
        const table = {
          scrollTop: this.$refs.iterator.getScrollTop(),
          offsetHeight: this.$refs.iterator.getOffsetHeight()
        }
        if (el.offsetTop - el.offsetHeight < table.scrollTop) {
          this.$refs.iterator.setScrollTop(el.offsetTop - el.offsetHeight)
        } else if (el.offsetTop + headerHeight > table.scrollTop + table.offsetHeight) {
          this.$refs.iterator.setScrollTop(el.offsetTop + headerHeight - table.offsetHeight)
        }
      })
    }
  },
  mounted () {
    this.restore()
  },
  methods: {
    restore () {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.iterator.setScrollTop(scrollTop)
      })
    },
    onScroll (e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown (e) {
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
