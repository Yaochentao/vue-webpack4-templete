import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' 

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


Vue.use(VueRouter)
router.beforeEach((to,from,next) => {
  NProgress.start() 
  next()
})

router.afterEach(() => {
  NProgress.done()
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

let test1 = () => {
  return new Promise
}