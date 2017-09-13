import Vue from 'vue'
import Router from 'vue-router'
import Container from '../pages/Container'
import Explorer from '../pages/Explorer'
import Settings from '../pages/Settings'
import Viewer from '../pages/Viewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Container,
      children: [
        {
          path: '',
          name: 'explorer',
          component: Explorer
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings
        }
      ]
    },
    {
      path: '/viewer',
      name: 'viewer',
      component: Viewer
    }
  ]
})
