<template>
  <v-data-table
    ref="table"
    v-model="model"
    v-bind="$attrs"
    class="virtual-data-table"
    :options.sync="optionsModel"
    :items="renderItems"
    :class="classes"
    disable-sort
    disable-pagination
  >
    <template v-slot:header="props">
      <slot v-bind="props" name="header" />
    </template>
    <template v-slot:item="props">
      <tr v-if="props.index === 0" :style="{ height: `${padding.top}px` }" />
      <slot v-bind="props" name="item" />
      <tr
        v-if="props.index === renderItems.length - 1"
        :style="{ height: `${padding.bottom}px` }"
      />
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    pagination: {
      type: Object,
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [],
    },
    estimatedHeight: {
      type: Number,
      default: 48,
    },
    threshold: {
      type: Number,
      default: 0,
    },
    stickyHeaders: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrolling: false,
      padding: {
        top: 0,
        bottom: 0,
      },
      renderItems: [],
    }
  },
  computed: {
    optionsModel: {
      get() {
        return this.pagination
      },
      set(value) {
        this.$emit('update:pagination', value)
      },
    },
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    classes() {
      return {
        'sticky-headers': this.stickyHeaders,
        scrolling: this.scrolling,
      }
    },
  },
  watch: {
    items() {
      this.adjustItems()
    },
  },
  mounted() {
    this.container = this.$el.querySelector('.v-data-table__wrapper')
    this.container.addEventListener('scroll', this.onScroll)
    this.observer = new ResizeObserver(this.onResize)
    this.observer.observe(this.container)
    this.adjustItems()
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.onScroll)
    this.observer.disconnect()
  },
  methods: {
    getScrollTop() {
      return this.container.scrollTop
    },
    setScrollTop(value) {
      this.$nextTick(() => {
        this.container.scrollTop = value
      })
    },
    getOffsetHeight() {
      return this.container.offsetHeight
    },
    adjustItems() {
      if (!this.container) {
        return
      }
      const { scrollTop, offsetHeight } = this.container
      const index = Math.floor(scrollTop / this.estimatedHeight)
      const offset = Math.ceil(offsetHeight / this.estimatedHeight) + 1

      let firstIndex = Math.max(0, index - this.threshold)
      let lastIndex = firstIndex + offset + this.threshold
      if (lastIndex > this.items.length) {
        lastIndex = this.items.length
        firstIndex = Math.max(0, lastIndex - offset - this.threshold * 2)
      }

      this.scrolling = scrollTop > 0
      this.padding = {
        top: firstIndex * this.estimatedHeight,
        bottom: (this.items.length - lastIndex) * this.estimatedHeight,
      }
      this.renderItems = this.items.slice(firstIndex, lastIndex)

      this.setScrollTop(scrollTop)
    },
    onResize() {
      this.adjustItems()
    },
    onScroll(e) {
      this.adjustItems()
      this.$emit('scroll', e)
    },
  },
}
</script>

<style scoped lang="scss">
.virtual-data-table.sticky-headers {
  ::v-deep .v-data-table__wrapper {
    height: 100%;
    overflow-y: scroll;
    background: inherit;
    &::-webkit-scrollbar {
      width: 14px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #eee;
      &:hover {
        background-color: #ddd;
      }
      &:active {
        background-color: #ccc;
      }
    }
    table {
      table-layout: fixed;
      background: inherit;
      > thead {
        background: inherit;
        > tr {
          background: inherit;
          > th {
            background: inherit;
            position: sticky;
            top: 0;
            z-index: 1;
          }
        }
      }
    }
  }
}
.theme--dark
  .virtual-data-table.sticky-headers
  ::v-deep
  .v-data-table__wrapper::-webkit-scrollbar-thumb {
  background-color: #424242 !important;
  &:hover {
    background-color: #505050 !important;
  }
  &:active {
    background-color: #616161 !important;
  }
}
</style>
