import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../views/Recommend'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Recommend',
    component: Recommend,
    meta: { isShowNav: true }
  },
  {
    path: '/hotMusic',
    name: 'HotMusic',
    component: () => import('../views/HotMusic.vue'),
    meta: { isShowNav: true }
  },
  {
    path: '/hotMusic/:num',
    name: 'HotMusicItem',
    component: () => import('../views/HotMusic.vue'),
    meta: { isShowNav: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search'),
    meta: { isShowNav: true }
  },
  {
    path: '/recommendContent/:id',
    name: 'RecommendContent',
    props: true,
    component: () => import('../views/RecommendContent'),
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
