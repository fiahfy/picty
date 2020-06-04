<template>
  <v-layout class="virtual-data-iterator" column>
    <v-container :class="classes" fluid pa-0 overflow-hidden>
      <v-data-iterator
        ref="iterator"
        v-model="model"
        v-bind="$attrs"
        class="fill-height"
        :options.sync="optionsModel"
        :items="renderItems"
        disable-sort
        disable-pagination
        row
        wrap
      >
        <template v-slot:header="props">
          <div class="header">
            <slot v-bind="props" name="header" />
          </div>
        </template>
        <template v-slot:default="props">
          <v-row class="ma-0">
            <v-col
              :style="{ height: `${padding.top}px` }"
              class="pa-0"
              xs="12"
              style="min-width: 100%;"
            />
            <template v-for="item in props.items">
              <slot v-bind="{ item }" name="item" />
            </template>
            <v-col
              :style="{ height: `${padding.bottom}px` }"
              class="pa-0"
              xs="12"
              style="min-width: 100%;"
            />
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </v-layout>
</template>

<script>
import * as viewport from '~/utils/viewport'

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
    itemKey: {
      type: String,
      default: 'id',
    },
    sizes: {
      type: [Number, Array],
      default: 6,
    },
    containerClass: {
      type: [String],
      default: '',
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
        [this.containerClass]: true,
        'sticky-headers': this.stickyHeaders,
        scrolling: this.scrolling,
      }
    },
    calculatedSizes() {
      return Array.isArray(this.sizes) ? this.sizes : Array(5).fill(this.sizes)
    },
  },
  watch: {
    items() {
      this.adjustItems()
    },
  },
  mounted() {
    this.container = this.$el.querySelector('.v-data-iterator')
    this.container.classList.add('scrollbar')
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
          this.estimatedHeight,
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
    },
  },
}
</script>

<style lang="scss" scoped>
.virtual-data-iterator > .container {
  position: relative;
  .v-data-iterator {
    overflow-y: scroll;
    text-align: center;
  }
  ::v-deep .header {
    position: sticky;
    top: 0;
    z-index: 1;
  }
}
</style>
