import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugin from '@/utils/plugin'
import Vant, { Lazyload } from 'vant' // 引入vant组件库 引入 Lazyload对象
import 'vant/lib/index.less' // vant样式文件
import '@/styles/index.less' // 引入less样式文件
import 'amfe-flexible' // 引入自动适配插件
Vue.use(Vant) // 完成vant全局注册
Vue.use(Lazyload) // 注册好了 支持v-lazy指令
Vue.use(plugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
