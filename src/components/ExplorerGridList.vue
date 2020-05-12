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
    hide-default-footer
    tabindex="0"
    @scroll="onScroll"
    @keydown.native="onKeyDown"
  >
    <template v-slot:header>
      <explorer-grid-list-header />
    </template>
    <template v-slot:item="props">
      <explorer-grid-list-item
        :key="props.item.path"
        :file="props.item"
        :class="classes"
      />
    </template>
    <v-progress-linear slot="progress" indeterminate />
    <v-card slot="no-data" class="ma-3 pa-3">{{ noDataText }}</v-card>
    <v-card slot="no-results" class="ma-3 pa-3">{{ noDataText }}</v-card>
  </virtual-data-iterator>
</template>

<script>
import ExplorerGridListHeader from './ExplorerGridListHeader'
import ExplorerGridListItem from './ExplorerGridListItem'
import VirtualDataIterator from './VirtualDataIterator'
import viewport from '~/utils/viewport'
import { layoutExplorerStore, settingsStore } from '~/store'

export default {
  components: {
    ExplorerGridListHeader,
    ExplorerGridListItem,
    VirtualDataIterator,
  },
  data() {
    return {
      sizes: [6, 4, 3, 2, 2],
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
      return viewport.SIZES.map((size, i) => {
        return `col-${size}-${this.sizes[i]}`
      })
    },
    estimatedHeight() {
      return this.thumbnailHeightValue + 77
    },
    thumbnailHeightValue() {
      return settingsStore.thumbnailHeightValue
    },
    directory() {
      return layoutExplorerStore.directory
    },
    query() {
      return layoutExplorerStore.query
    },
    loading() {
      return layoutExplorerStore.loading
    },
    selectedFilepath() {
      return layoutExplorerStore.selectedFilepath
    },
    filteredFiles() {
      return layoutExplorerStore.filteredFiles
    },
    scrollTop() {
      return layoutExplorerStore.scrollTop
    },
    selectedFileIndex() {
      return layoutExplorerStore.selectedFileIndex
    },
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
          offsetHeight: this.estimatedHeight,
        }
        const iterator = {
          scrollTop: this.$refs.iterator.getScrollTop(),
          offsetHeight: this.$refs.iterator.getOffsetHeight(),
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
    },
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
      return 12 / this.sizes[viewport.getSizeIndex()]
    },
    onScroll(e) {
      const scrollTop = e.target.scrollTop
      layoutExplorerStore.setScrollTop({ scrollTop })
    },
    onKeyDown(e) {
      const offset = this.getItemOffset()
      switch (e.keyCode) {
        case 13:
          layoutExplorerStore.viewFile({ filepath: this.selectedFilepath })
          break
        case 37:
          layoutExplorerStore.selectLeftFile({ offset })
          break
        case 38:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutExplorerStore.selectFirstFile()
          } else {
            layoutExplorerStore.selectTopFile({ offset })
          }
          break
        case 39:
          layoutExplorerStore.selectRightFile({ offset })
          break
        case 40:
          if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            layoutExplorerStore.selectLastFile()
          } else {
            layoutExplorerStore.selectBottomFile({ offset })
          }
          break
      }
    },
  },
}
</script>

<style scoped lang="scss">
.explorer-grid-list {
  outline: none;
}
</style>
