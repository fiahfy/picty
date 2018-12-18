import Vue from 'vue'
import { createSimpleTransition } from 'vuetify/es5/util/helpers'

const noTransition = createSimpleTransition('no-transition')
Vue.component('no-transition', noTransition)
