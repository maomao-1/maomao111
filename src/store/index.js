import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)
//  Vuex 和缓存数据得同步 redux
export default new Vuex.Store({
  state: {
    user: auth.getUser() // 从缓存中
  },
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user // 更新数据
      auth.setUser(payload.user) // 将数据同步设置到本地存储中
    },
    // 清空User
    clearUser (state) {
      state.user = {}
      auth.delUser() // 将缓存中的数据也清空
    }
  },
  actions: {},
  modules: {}
})
