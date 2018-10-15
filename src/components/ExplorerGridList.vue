<template>
  <virtual-data-iterator
    ref="iterator"
    :items="filteredFiles"
    :loading="loading"
    :no-data-text="noDataText"
    :estimated-height="estimatedHeight"
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
      :key="props.item.path"
      slot-scope="props"
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
  data() {
    return {
      sizes: [6, 4, 3, 2, 2]
    }
  },
  computed: {
    noDataText() {
      if (this.loading) {
        return 'Loading...'
      }
      return this.query ? 'No matching records found' : 'No data available'
    },
    classes() {
      return Viewport.sizes.map((s, i) => {
        return s + this.sizes[i]
      })
    },
    estimatedHeight() {
      return this.thumbnailHeightValue + 81
    },
    ...mapGetters('settings', ['thumbnailHeightValue']),
    ...mapState('local/explorer', [
      'directory',
      'query',
      'loading',
      'selectedFilepath'
    ]),
    ...mapGetters('local/explorer', [
      'filteredFiles',
      'scrollTop',
      'selectedFileIndex'
    ])
  },
  watch: {
    loading() {
      this.restore()
    },
    selectedFileIndex(value) {
      this.$nextTick(() => {
        const index = value
        if (index === -1) {
          return
        }
        const offset = this.getItemOffset()
        const el = {
          offsetTop: this.estimatedHeight * Math.floor(index / offset),
          offsetHeight: this.estimatedHeight
        }
        const iterator = {
          scrollTop: this.$refs.iterator.getScrollTop(),
          offsetHeight: this.$refs.iterator.getOffsetHeight()
        }
        if (iterator.scrollTop > el.offsetTop) {
          this.$refs.iterator.setScrollTop(el.offsetTop)
        } else if (
          iterator.scrollTop <
          el.offsetTop + el.offsetHeight - iterator.offsetHeight
        ) {
          this.$refs.iterator.setScrollTop(
            el.offsetTop + el.offsetHeight - iterator.offsetHeight
          )
        }
      })
    }
  },
  mounted() {
    this.restore()
  },
  methods: {
    restore() {
      const scrollTop = this.scrollTop
      this.$nextTick(() => {
        this.$refs.iterator.setScrollTop(scrollTop)
      })
    },
    getItemOffset() {
      return 12 / this.sizes[Viewport.getSizeIndex()]
    },
    onScroll(e) {
      this.setScrollTop({ scrollTop: e.target.scrollTop })
    },
    onKeyDown(e) {
      const offset = this.getItemOffset()
      switch (e.keyCode) {
        case 13:
          this.viewFile({ filepath: this.selectedFilepath })
          break
        case 37:
          this.selectLeftFile({ offset })
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectFirstFile()
          } else {
            this.selectTopFile({ offset })
          }
          break
        case 39:
          this.selectRightFile({ offset })
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            this.selectLastFile()
          } else {
            this.selectBottomFile({ offset })
          }
          break
      }
    },
    ...mapActions('local/explorer', [
      'selectFirstFile',
      'selectLastFile',
      'selectLeftFile',
      'selectTopFile',
      'selectRightFile',
      'selectBottomFile',
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
