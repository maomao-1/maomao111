import router from '@/router' // 引入路由守卫
import store from '@/store' // 引入store
// 前置守卫，当你得路由发生之前触发
//  to 到哪里去， from 从哪里来。 next是通行证
// next() 放行
router.beforeEach(function (to, from, next) {
  // 判断前往得页面是否以user为开头
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 判断有无token  有得话放行， 没有得话回登录页面
    let toPath = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.path
      }
    }
    next(toPath)
  } else {
    next() // 不以user为开头则直接放行
  }
})
export default router
