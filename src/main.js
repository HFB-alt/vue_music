import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import { Lazyload } from 'vant';

Vue.use(Lazyload);

Vue.config.productionTip = false

new Vue({
  router,

  data: {
    playMusic: {
      musicID: 0,
      isPlay: false,
      currentIndex: -1,
      isShow: false,
      flag: false,
      isShowPlayPage: false,
      musicList: [],
      comments: [],
      hotComments: [],
    }
  },

  store,
  render: h => h(App)
}).$mount('#app')
