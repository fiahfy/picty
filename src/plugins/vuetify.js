import Vue from 'vue'
import { createSimpleTransition } from 'vuetify/es5/components/transitions/createTransition'

const noTransition = createSimpleTransition('no-transition')
Vue.component('no-transition', noTransition)
