<template>
  <v-layout class="virtual-data-iterator" column>
    <slot name="header" />
    <v-container :class="classes" fluid pa-0 overflow-hidden>
      <slot v-if="loading" name="progress" />
      <v-data-iterator
        ref="iterator"
        v-model="model"
        v-bind="$attrs"
        class="fill-height scroll-y"
        :pagination.sync="paginationModel"
        :items="renderItems"
        :disable-initial-sort="true"
        content-tag="v-layout"
        row
        wrap
      >
        <template slot="item" slot-scope="props">
          <v-flex
            v-if="props.index === 0"
            :style="{ height: `${padding.top}px` }"
            class="pa-0"
            xs12
          />
          <slot v-bind="props" name="items" />
          <v-flex
            v-if="props.index === renderItems.length - 1"
            :style="{ height: `${padding.bottom}px` }"
            class="pa-0"
            xs12
          />
        </template>
        <slot slot="no-data" name="no-data" />
        <slot slot="no-results" name="no-results" />
      </v-data-iterator>
    </v-container>
  </v-layout>
</template>

<script>
import viewport from '~/utils/viewport'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    estimatedHeight: {
      type: Number,
      default: 48
    },
    threshold: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    sizes: {
      type: [Number, Array],
      default: 6
    },
    containerClass: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      scrolling: false,
      padding: {
        top: 0,
        bottom: 0
      },
      renderItems: []
    }
  },
  computed: {
    paginationModel: {
      get() {
        return this.pagination
      },
      set(value) {
        this.$emit('update:pagination', value)
      }
    },
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    classes() {
      return {
        [this.containerClass]: true,
        scrolling: this.scrolling
      }
    },
    calculatedSizes() {
      return Array.isArray(this.sizes) ? this.sizes : Array(5).fill(this.sizes)
    }
  },
  watch: {
    items() {
      this.adjustItems()
    }
  },
  mounted() {
    this.container = this.$el.querySelector('.v-data-iterator')
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
      const size = 12 / this.calculatedSizes[viewport.getSizeIndex()]

      const { scrollTop, offsetHeight } = this.container
      const index = Math.floor(scrollTop / this.estimatedHeight)
      const offset = Math.ceil(offsetHeight / this.estimatedHeight) + 1

      let firstIndex = Math.max(0, index - this.threshold)
      let lastIndex = firstIndex + offset + this.threshold
      if (lastIndex > Math.ceil(this.items.length / size)) {
        lastIndex = Math.ceil(this.items.length / size)
        firstIndex = Math.max(0, lastIndex - offset - this.threshold * 2)
      }

      this.scrolling = scrollTop > 0
      this.padding = {
        top: firstIndex * this.estimatedHeight,
        bottom:
          (Math.ceil(this.items.length / size) - lastIndex) *
          this.estimatedHeight
      }
      this.renderItems = this.items.slice(firstIndex * size, lastIndex * size)

      this.setScrollTop(scrollTop)
    },
    onResize() {
      this.adjustItems()
    },
    onScroll(e) {
      this.adjustItems()
      this.$emit('scroll', e)
    }
  }
}
</script>

<style scoped lang="scss">
.virtual-data-iterator > .container {
  position: relative;
  .v-progress-linear {
    left: 0;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  .v-data-iterator {
    height: 100%;
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
    &:before {
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
      content: '';
      left: 0;
      position: absolute;
      right: 14px;
      top: -10px;
      z-index: 1;
    }
    /deep/ .layout {
      margin: 0px !important;
    }
  }
  &.scrolling .v-data-iterator:before {
    height: 10px;
  }
}
.theme--dark .virtual-data-iterator .v-data-iterator::-webkit-scrollbar-thumb {
  background-color: #424242 !important;
  &:hover {
    background-color: #505050 !important;
  }
  &:active {
    background-color: #616161 !important;
  }
}
</style>
