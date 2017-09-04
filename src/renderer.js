import Vue from 'vue';
import App from './renderer/App';
import router from './renderer/router';

Vue.config.devtools = false;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
/* eslint-enable no-new */
