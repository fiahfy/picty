<template>
  <div class="viewer-page">
    <mdc-button @click="click">
      <mdc-icon icon="close" />
    </mdc-button>
    <img :src="src"/>
  </div>
</template>

<script>
import MdcButton from '../components/MdcButton';
import MdcIcon from '../components/MdcIcon';

export default {
  name: 'viewer-page',
  components: {
    MdcButton,
    MdcIcon,
  },
  data() {
    return {
      src: '',
    };
  },
  mounted() {
    this.src = this.$route.params.path;
  },
  methods: {
    click() {
      this.$router.push({ name: 'main' });
    },
  },
};
</script>

<style scoped lang="scss">
.viewer-page {
  height: 100%;
  position:relative;
}
.mdc-button {
  border-radius: 0;
  height: auto;
  min-width: auto;
  padding: 0;
  position: absolute;
  right: 0;
}
img {
  bottom:0;
  left: 0;
  margin:auto;
  max-height: 100%;
  max-width: 100%;
  position:absolute;
  right: 0;
  top:0;
  vertical-align: middle;
}
</style>
