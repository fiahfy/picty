import Vue from 'vue';
import App from './renderer/App.vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
/* eslint-enable no-new */
