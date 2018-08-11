<template>
  <virtual-data-iterator
    ref="iterator"
    :items="filteredFiles"
    :loading="loading"
    :no-data-text="noDataText"
    :estimated-height="231"
    :sizes="sizes"
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
      :class="classes"
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
import * as Viewport from '~/utils/viewport'

export default {
  components: {
    ExplorerGridListItem,
    VirtualDataIterator
  },
  data () {
    return {
      sizes: [6, 4, 3, 2, 2]
    }
  },
  computed: {
    noDataText () {
      if (this.loading) {
        return 'Loading...'
      }
      return this.query ? 'No matching records found' : 'No data available'
    },
    classes () {
      return Viewport.sizes.map((s, i) => {
        return s + this.sizes[i]
      })
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
        const size = 12 / this.sizes[Viewport.getSizeIndex()]
        const rowHeight = 231
        const el = {
          offsetTop: rowHeight * Math.floor(index / size),
          offsetHeight: rowHeight
        }
        const iterator = {
          scrollTop: this.$refs.iterator.getScrollTop(),
          offsetHeight: this.$refs.iterator.getOffsetHeight()
        }
        if (iterator.scrollTop > el.offsetTop) {
          this.$refs.iterator.setScrollTop(el.offsetTop)
        } else if (iterator.scrollTop < el.offsetTop + el.offsetHeight - iterator.offsetHeight) {
          this.$refs.iterator.setScrollTop(el.offsetTop + el.offsetHeight - iterator.offsetHeight)
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
          this.viewFile({ filepath: this.selectedFilepath })
          break
        case 37:
          this.selectPreviousFile()
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstFile()
          } else {
            const index = this.selectedFileIndex - Math.floor(12 / this.sizes[Viewport.getSizeIndex()])
            this.selectFileIndex({ index })
          }
          break
        case 39:
          this.selectNextFile()
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastFile()
          } else {
            const index = this.selectedFileIndex + Math.floor(12 / this.sizes[Viewport.getSizeIndex()])
            this.selectFileIndex({ index })
          }
          break
      }
    },
    ...mapActions('local/explorer', [
      'selectFileIndex',
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
