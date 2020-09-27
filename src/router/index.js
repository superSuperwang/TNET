import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/Home',
    },
    //首页
    {
      path: '/Home',
      name: 'Home',
      component: () => import('@/pages/Home/Home')
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   let titlename = to.meta.title;
//   document.title = titlename;
//   next()
// })

export default router;
