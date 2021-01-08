import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../views/Recommend'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/hotMusic',
    name: 'HotMusic',
    component: () => import('../views/HotMusic.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
